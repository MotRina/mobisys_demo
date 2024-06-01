document.addEventListener("DOMContentLoaded", () => {
    const currentImage = document.getElementById('current-image');
    const strayCatButton = document.getElementById('stray-cat-button');
    const petCatButton = document.getElementById('pet-cat-button');
    const submitButton = document.getElementById('submit-classification');
    const progressBar = document.getElementById('progress-bar');
    const errorMessage = document.getElementById('error-message');
    const loadingIndicator = document.getElementById('loading');

    let selectedImages = [];
    const classifications = {};
    let currentIndex = 0;

    function loadNextImage() {
        if (currentIndex < selectedImages.length) {
            currentImage.src = selectedImages[currentIndex];
            updateProgress();
        } else {
            alert('Classification complete.');
        }
    }



    function updateProgress() {
        const progressPercentage = ((currentIndex + 1) / selectedImages.length) * 100;
        progressBar.style.width = progressPercentage + '%';
        progressBar.innerText = progressPercentage + '%';
    }

    selectedImages = JSON.parse(sessionStorage.getItem('selected_images') || '[]');

    loadNextImage();

    strayCatButton.addEventListener('click', () => {
        classifications[selectedImages[currentIndex]] = 'Stray Cat';
        currentIndex++;
        loadNextImage();
    });

    petCatButton.addEventListener('click', () => {
        classifications[selectedImages[currentIndex]] = 'Pet Cat';
        currentIndex++;
        loadNextImage();
    });

    submitButton.addEventListener('click', () => {
        if (currentIndex < selectedImages.length) {
            errorMessage.textContent = 'Please classify all images before submitting.';
            errorMessage.style.color = 'red';
        } else {
            errorMessage.textContent = '';
            loadingIndicator.style.display = 'block';

            fetch('../php/save_selections.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: sessionStorage.getItem('user_id'),
                    selections: Object.keys(classifications).map(imagePath => ({
                        image_path: imagePath,
                        classification: classifications[imagePath],
                    })),
                }),
            })
            .then(response => response.json())
            .then(data => {
                loadingIndicator.style.display = 'none';
                if (data.status === 'success') {
                    window.location.href = '../src/accuracy.html';
                } else {
                    alert('Failed to save selections: ' + data.message);
                }
            })
            .catch(error => {
                loadingIndicator.style.display = 'none';
                console.error('Error:', error);
                alert('Error saving selections: ' + error.message);
            });
        }
    });
});
