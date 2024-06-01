document.addEventListener("DOMContentLoaded", () => {
    const modelContent = document.getElementById('model-content');
    const heatmapContent = document.getElementById('heatmap-content');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');
    const loadingMessage = document.getElementById('loading-message');
    const loadingSpinner = document.getElementById('loading-spinner');

    if (!progressBar) {
        console.error("Progress bar element not found");
        return;
    }

    let requestSent = false;

    function updateProgressBar(percentage) {
        progressBar.style.width = percentage + '%';
        progressBar.setAttribute('data-label', `${percentage}%`);
    }

    function setLoadingMessage(message) {
        loadingMessage.innerText = message;
    }

    function gradualIncrement(start, end, duration, callback) {
        const range = end - start;
        const increment = range / (duration / 50);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                clearInterval(timer);
                current = end;
            }
            callback(current);
        }, 50);
    }

    fetch('../php/get_selections.php')
        .then(response => response.json())
        .then(data => {
            console.log("Data from server:", data);

            if (!Array.isArray(data) || data.length === 0) {
                throw new Error("No data received from server");
            }

            const imagePaths = data.map(selection => selection.image_path);
            const userClassifications = data.map(selection => selection.classification);
            const correctClasses = data.map(selection => selection.correct_class);

            updateProgressBar(100);

            if (!requestSent) {
                requestSent = true;

                fetch('../php/predict.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image_paths: imagePaths })
                })
                .then(response => response.json())
                .then(data => {
                    gradualIncrement(100, 100, 100, updateProgressBar); // 予測処理中にプログレスバーを90%まで進める

                    const { predictions, heatmaps } = data;
                    let correctCount = 0;

                    predictions.forEach((predictedClass, index) => {
                        const imagePath = imagePaths[index];
                        const userClass = userClassifications[index];
                        const correctClass = correctClasses[index];
                        const formattedCorrectClass = correctClass.toLowerCase() === 'stray cat' ? 'stray' : 'pet';
                        const isCorrect = formattedCorrectClass === predictedClass.toLowerCase();
                        const heatmapPath = `../${heatmaps[index]}`;

                        if (isCorrect) correctCount++;

                        const resultDiv = document.createElement('div');
                        resultDiv.classList.add('result');
                        resultDiv.innerHTML = `
                            <img src="${imagePath}" alt="Image">
                            <p>Correct Class: ${correctClass}</p>
                            <p>Model's Class: ${predictedClass === 'stray' ? 'Stray Cat' : 'Pet Cat'}</p>
                            <p class="${isCorrect ? 'correct' : 'incorrect'}">${isCorrect ? 'Correct' : 'Incorrect'}</p>
                        `;
                        modelContent.appendChild(resultDiv);

                        const heatmapDiv = document.createElement('div');
                        heatmapDiv.classList.add('heatmap');
                        heatmapDiv.innerHTML = `<img src="${heatmapPath}" alt="Heatmap" style="max-width: 300px;">`;
                        heatmapContent.appendChild(heatmapDiv);
                    });

                    updateProgressBar(100); // 画像表示直前にプログレスバーを100%にする

                    const accuracy = (correctCount / predictions.length) * 100;
                    const accuracyDiv = document.createElement('div');
                    accuracyDiv.classList.add('accuracy');
                    accuracyDiv.innerHTML = `<h2>Accuracy: ${accuracy.toFixed(2)}%</h2>`;
                    heatmapContent.appendChild(accuracyDiv);

                    const surveyButtonDiv = document.createElement('div');
                    surveyButtonDiv.classList.add('button-container');
                    const surveyButton = document.createElement('button');
                    surveyButton.id = 'survey-button';
                    surveyButton.innerText = 'I see';
                    surveyButton.addEventListener('click', () => {
                        window.location.href = '../src/thankyou.html';
                    });
                    surveyButtonDiv.appendChild(surveyButton);
                    heatmapContent.appendChild(surveyButtonDiv);

                    setTimeout(() => {
                        progressContainer.style.display = 'none'; // プログレスバーを非表示にする
                        loadingMessage.remove();
                        loadingSpinner.remove();
                    }, 1000); // 1秒の遅延を追加してからプログレスバーを非表示にする
                })
                .catch(error => {
                    console.error('Error:', error);
                    setLoadingMessage('An error occurred. Please try again.');
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setLoadingMessage('An error occurred. Please try again.');
        });
});
