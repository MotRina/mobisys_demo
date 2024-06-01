import sys
import json
import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import matplotlib.pyplot as plt

model_path = './model/model.h5'
model = load_model(model_path)

log_path = '/home/s21803rm/public_html/LostCat/start/error_log.txt'

def log_message(message):
    with open(log_path, 'a') as f:
        f.write(message + '\n')

def make_gradcam_heatmap(img_array, model, last_conv_layer_name):
    grad_model = tf.keras.models.Model(
        [model.input],
        [model.get_layer(last_conv_layer_name).output, model.output]
    )

    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        loss = predictions[:, np.argmax(predictions[0])]

    grads = tape.gradient(loss, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    return heatmap.numpy()

def save_and_display_gradcam(img_path, heatmap, cam_path, alpha=0.4):
    try:
        img = image.load_img(img_path)
        img = image.img_to_array(img)

        heatmap = np.uint8(255 * heatmap)
        jet = plt.get_cmap("jet")
        jet_colors = jet(np.arange(256))[:, :3]
        jet_heatmap = jet_colors[heatmap]

        jet_heatmap = tf.keras.preprocessing.image.array_to_img(jet_heatmap)
        jet_heatmap = jet_heatmap.resize((img.shape[1], img.shape[0]))
        jet_heatmap = tf.keras.preprocessing.image.img_to_array(jet_heatmap)

        superimposed_img = jet_heatmap * alpha + img
        superimposed_img = tf.keras.preprocessing.image.array_to_img(superimposed_img)

        if not os.path.exists(os.path.dirname(cam_path)):
            os.makedirs(os.path.dirname(cam_path))
        superimposed_img.save(cam_path)
        os.chmod(cam_path, 0o644)
        log_message(f"Saved heatmap to {cam_path} with permissions set to 644")
    except Exception as e:
        log_message(f"Error saving heatmap {cam_path}: {str(e)}")



def predict(image_paths):
    predictions = []
    heatmaps = []

    for img_path in image_paths:
        try:
            log_message(f"Processing image: {img_path}")
            full_img_path = os.path.join('/home/s21803rm/public_html/LostCat/start', img_path.lstrip('./'))
            img = image.load_img(full_img_path, target_size=(224, 224))
            img_array = image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0)
            img_array = tf.keras.applications.resnet50.preprocess_input(img_array)

            preds = model.predict(img_array)
            predicted_class = np.argmax(preds, axis=1)[0]
            predictions.append('pet' if predicted_class == 1 else 'stray')

            heatmap = make_gradcam_heatmap(img_array, model, 'conv5_block3_out')
            heatmap_filename = os.path.basename(full_img_path).replace('.png', '_heatmap.png')
            heatmap_path = os.path.join('./images/heatmaps', heatmap_filename)
            save_and_display_gradcam(full_img_path, heatmap, heatmap_path)
            heatmaps.append(os.path.join('./images/heatmaps', heatmap_filename))
        except Exception as e:
            log_message(f"Error processing {img_path}: {str(e)}")

    return {'predictions': predictions, 'heatmaps': heatmaps}

if __name__ == '__main__':
    try:
        log_message("Script started.")
        if len(sys.argv) > 1:
            image_paths = json.loads(sys.argv[1])
            log_message(f"Received image paths: {image_paths}")
            result = predict(image_paths)
            log_message(f"Result: {json.dumps(result)}")
            print(json.dumps(result))
        else:
            log_message("No image paths provided.")
            print(json.dumps({"error": "No image paths provided"}))
    except Exception as e:
        error_message = str(e)
        log_message(f"Error: {error_message}")
        print(json.dumps({"error": error_message}))
