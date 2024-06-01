document.addEventListener("DOMContentLoaded", () => {
    const accuracyContent = document.getElementById('accuracy-content');

    fetch('../php/get_selections.php')
        .then(response => response.json())
        .then(data => {
            console.log("Data from server:", data);  // デバッグ用にコンソールにデータを表示

            if (!Array.isArray(data)) {
                throw new Error("Invalid data format from server");
            }

            if (data.length === 0) {
                throw new Error("No data received from server");
            }

            let correctCount = 0;
            const results = [];

            data.forEach((selection, index) => {
                // Check if selection is null or undefined
                if (selection == null) {
                    console.error(`Invalid selection data at index ${index}:`, selection);
                    return;
                }

                const imagePath = selection.image_path;
                const userClass = selection.classification;
                const correctClass = selection.correct_class;

                // Check if any of the required fields are missing or null
                if (!imagePath || !userClass || !correctClass) {
                    console.error(`Incomplete data for selection at index ${index}:`, selection);
                    return;
                }

                // Debug logs for each field
                console.log(`Selection at index ${index}:`, selection);
                console.log(`Image Path:`, imagePath);
                console.log(`User Classification:`, userClass);
                console.log(`Correct Classification:`, correctClass);

                const isCorrect = correctClass === userClass;

                if (isCorrect) correctCount++;

                const result = {
                    path: imagePath,
                    correctClass: correctClass,
                    userClass: userClass,
                    isCorrect: isCorrect
                };
                results.push(result);

                const resultDiv = document.createElement('div');
                resultDiv.classList.add('result');
                resultDiv.innerHTML = `
                    <img src="${imagePath}" alt="Image">
                    <p>Correct Class: ${correctClass}</p>
                    <p>Your Class: ${userClass}</p>
                    <p class="${isCorrect ? 'correct' : 'incorrect'}">${isCorrect ? 'Correct' : 'Incorrect'}</p>
                `;
                accuracyContent.appendChild(resultDiv);
            });

            if (results.length > 0) {
                localStorage.setItem('classificationResults', JSON.stringify(results));

                const accuracy = (correctCount / results.length) * 100;
                const accuracyDiv = document.createElement('div');
                accuracyDiv.classList.add('accuracy');
                accuracyDiv.innerHTML = `<h2>Accuracy: ${accuracy.toFixed(2)}%</h2>`;
                accuracyContent.appendChild(accuracyDiv);

                const surveyButton = document.createElement('button');
                surveyButton.id = 'survey-button';
                surveyButton.innerText = 'Proceed to Survey';
                surveyButton.addEventListener('click', () => {
                    window.location.href = '../src/survey.html';
                });
                accuracyContent.appendChild(surveyButton);
            } else {
                const noDataDiv = document.createElement('div');
                noDataDiv.classList.add('no-data');
                noDataDiv.innerHTML = `<p>No valid data to display results.</p>`;
                accuracyContent.appendChild(noDataDiv);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const errorDiv = document.createElement('div');
            errorDiv.classList.add('error');
            errorDiv.innerHTML = `<p>${error.message}</p>`;
            accuracyContent.appendChild(errorDiv);
        });
});
