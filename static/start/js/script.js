document.addEventListener("DOMContentLoaded", () => {
    const imageGrid = document.getElementById('image-grid');
    const submitButton = document.getElementById('submit-button');
    let selectedImages = [];
    const totalImages = 10;
    const progressBar = document.getElementById('progress-bar');

    const imagePaths = [
        '../images/cat-dataset/pet/pet206.png',
        '../images/cat-dataset/pet/pet263.png',
        '../images/cat-dataset/stray/stray386.png',
        '../images/cat-dataset/pet/pet3.png',
        '../images/cat-dataset/stray/stray303.png',
        '../images/cat-dataset/stray/stray92.png',
        '../images/cat-dataset/pet/pet393.png',
        '../images/cat-dataset/pet/pet222.png',
        '../images/cat-dataset/stray/stray292.png',
        '../images/cat-dataset/pet/pet10.png',
        '../images/cat-dataset/stray/stray19.png',
        '../images/cat-dataset/pet/pet9.png',
        '../images/cat-dataset/pet/pet117.png',
        '../images/cat-dataset/stray/stray37.png',
        '../images/cat-dataset/pet/pet17.png',
        '../images/cat-dataset/stray/stray39.png',
        '../images/cat-dataset/stray/stray11.png',
        '../images/cat-dataset/stray/stray35.png',
        '../images/cat-dataset/stray/stray38.png',
        '../images/cat-dataset/pet/pet19.png',
        '../images/cat-dataset/stray/stray105.png',
        '../images/cat-dataset/stray/stray40.png',
        '../images/cat-dataset/pet/pet242.png',
        '../images/cat-dataset/pet/pet176.png',
        '../images/cat-dataset/pet/pet30.png',
        '../images/cat-dataset/pet/pet31.png',
        '../images/cat-dataset/stray/stray41.png',
        '../images/cat-dataset/pet/pet230.png',
        '../images/cat-dataset/pet/pet368.png',
        '../images/cat-dataset/stray/stray26.png',
        '../images/cat-dataset/pet/pet370.png',
        '../images/cat-dataset/pet/pet360.png',
        '../images/cat-dataset/stray/stray25.png',
        '../images/cat-dataset/stray/stray109.png',
        '../images/cat-dataset/pet/pet379.png',
        '../images/cat-dataset/pet/pet42.png',
        '../images/cat-dataset/stray/stray298.png',
        '../images/cat-dataset/stray/stray142.png',
        '../images/cat-dataset/pet/pet145.png',
        '../images/cat-dataset/pet/pet356.png',
        '../images/cat-dataset/pet/pet327.png',
        '../images/cat-dataset/pet/pet47.png',
        '../images/cat-dataset/pet/pet48.png',
        '../images/cat-dataset/pet/pet395.png',
        '../images/cat-dataset/pet/pet52.png',
        '../images/cat-dataset/stray/stray54.png',
        '../images/cat-dataset/stray/stray57.png',
        '../images/cat-dataset/stray/stray58.png',
        '../images/cat-dataset/stray/stray98.png',
        '../images/cat-dataset/stray/stray110.png',
        '../images/cat-dataset/pet/pet54.png',
        '../images/cat-dataset/pet/pet351.png',
        '../images/cat-dataset/pet/pet343.png',
        '../images/cat-dataset/pet/pet57.png',
        '../images/cat-dataset/pet/pet262.png',
        '../images/cat-dataset/pet/pet63.png',
        '../images/cat-dataset/pet/pet156.png',
        '../images/cat-dataset/pet/pet66.png',
        '../images/cat-dataset/pet/pet252.png',
        '../images/cat-dataset/pet/pet175.png',
        '../images/cat-dataset/stray/stray1.png',
        '../images/cat-dataset/stray/stray2.png',
        '../images/cat-dataset/stray/stray4.png',
        '../images/cat-dataset/pet/pet181.png',
        '../images/cat-dataset/pet/pet78.png',
        '../images/cat-dataset/stray/stray5.png',
        '../images/cat-dataset/pet/pet338.png',
        '../images/cat-dataset/pet/pet213.png',
        '../images/cat-dataset/stray/stray7.png',
        '../images/cat-dataset/stray/stray385.png',
        '../images/cat-dataset/stray/stray267.png',
        '../images/cat-dataset/pet/pet337.png',
        '../images/cat-dataset/stray/stray12.png',
        '../images/cat-dataset/pet/pet7.png',
        '../images/cat-dataset/stray/stray256.png',
        '../images/cat-dataset/stray/stray115.png',
        '../images/cat-dataset/stray/stray13.png',
        '../images/cat-dataset/pet/pet191.png',
        '../images/cat-dataset/pet/pet221.png',
        '../images/cat-dataset/stray/stray228.png',
        '../images/cat-dataset/stray/stray29.png',
        '../images/cat-dataset/pet/pet121.png',
        '../images/cat-dataset/pet/pet139.png',
        '../images/cat-dataset/stray/stray137.png',
        '../images/cat-dataset/stray/stray22.png',
        '../images/cat-dataset/stray/stray23.png',
        '../images/cat-dataset/stray/stray30.png',
        '../images/cat-dataset/stray/stray32.png',
        '../images/cat-dataset/stray/stray33.png',
        '../images/cat-dataset/pet/pet34.png',
        '../images/cat-dataset/pet/pet128.png',
        '../images/cat-dataset/stray/stray44.png',
        '../images/cat-dataset/stray/stray46.png',
        '../images/cat-dataset/pet/pet150.png',
        '../images/cat-dataset/stray/stray42.png',
        '../images/cat-dataset/stray/stray232.png',
        '../images/cat-dataset/pet/pet246.png',
        '../images/cat-dataset/stray/stray47.png',
        '../images/cat-dataset/stray/stray48.png',
        '../images/cat-dataset/stray/stray218.png',
        '../images/cat-dataset/stray/stray50.png',
        '../images/cat-dataset/stray/stray161.png',
        '../images/cat-dataset/stray/stray52.png',
        '../images/cat-dataset/stray/stray182.png',
        '../images/cat-dataset/pet/pet58.png',
        '../images/cat-dataset/pet/pet59.png',
        '../images/cat-dataset/pet/pet161.png',
        '../images/cat-dataset/stray/stray108.png',
        '../images/cat-dataset/stray/stray65.png',
        '../images/cat-dataset/stray/stray68.png',
        '../images/cat-dataset/stray/stray69.png',
        '../images/cat-dataset/stray/stray288.png',
    ];

    function updateGridLayout() {
        if (window.innerWidth <= 768) {
            imageGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(50px, 1fr))';
        } else {
            imageGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(70px, 1fr))';
        }
    }

    window.addEventListener('resize', updateGridLayout);
    updateGridLayout();

    imagePaths.forEach(path => {
        const img = document.createElement('img');
        img.src = path;
        img.addEventListener('click', () => {
            if (img.classList.contains('selected')) {
                img.classList.remove('selected');
                selectedImages = selectedImages.filter(selected => selected !== path);
            } else {
                if (selectedImages.length < totalImages) {
                    img.classList.add('selected');
                    selectedImages.push(path);
                } else {
                    alert('You can only select up to 10 images.');
                }
            }
            updateProgress();
        });
        imageGrid.appendChild(img);
    });

    function updateProgress() {
        const progressPercentage = (selectedImages.length / totalImages) * 100;
        progressBar.style.width = progressPercentage + '%';
        progressBar.innerText = progressPercentage + '%';
    }

    submitButton.addEventListener('click', () => {
        if (selectedImages.length !== totalImages) {
            alert('Please select exactly 10 images.');
            return;
        }

        const userId = sessionStorage.getItem('user_id');
        if (!userId) {
            alert('User ID not found. Please log in again.');
            return;
        }

        // セッションストレージに選択した画像を保存
        sessionStorage.setItem('selected_images', JSON.stringify(selectedImages));

        fetch('../php/save_selections.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                selections: selectedImages.map(image => ({
                    image_path: image,
                    classification: null
                }))
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                // Navigate to classify.html
                window.location.href = '../src/classify.html';
            } else {
                alert('Failed to save selections: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error saving selections:', error);
            alert('Error saving selections: ' + error.message);
        });
    });
});