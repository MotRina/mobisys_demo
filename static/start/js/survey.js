document.addEventListener("DOMContentLoaded", () => {
    const surveyContent = document.getElementById('survey-content');
    const submitButton = document.getElementById('submit-survey');
    const errorMessage = document.getElementById('error-message');

    const classificationResults = JSON.parse(localStorage.getItem('classificationResults'));

    function createSurveyQuestion(result, index) {
        const surveyDiv = document.createElement('div');
        surveyDiv.classList.add('survey-question');
        surveyDiv.innerHTML = `
            <img src="${result.path}" alt="Image">
            <p>Correct Class: ${result.correctClass}</p>
            <p>Your Class: ${result.userClass}</p>
            <p class="${result.isCorrect ? 'correct' : 'incorrect'}">${result.isCorrect ? 'Correct' : 'Incorrect'}</p>
            <div class="survey-options">
                <label><input type="checkbox" name="feature${index}" value="Eyes"> Eyes</label>
                <label><input type="checkbox" name="feature${index}" value="Ears"> Ears</label>
                <label><input type="checkbox" name="feature${index}" value="Nose"> Nose</label>
                <label><input type="checkbox" name="feature${index}" value="Mouth"> Mouth</label>
                <label><input type="checkbox" name="feature${index}" value="Outline"> Outline</label>
                <label><input type="checkbox" name="feature${index}" value="Others"> Others</label>
            </div>
        `;
        surveyContent.appendChild(surveyDiv);
    }

    classificationResults.forEach((result, index) => {
        createSurveyQuestion(result, index);
    });

    submitButton.addEventListener('click', () => {
        const surveyResponses = [];

        classificationResults.forEach((result, index) => {
            const checkboxes = document.querySelectorAll(`input[name="feature${index}"]:checked`);
            const features = Array.from(checkboxes).map(checkbox => checkbox.value);
            surveyResponses.push({
                image: result.path,
                features: features.join(', ') // Join features with a comma
            });
        });

        const allAnswered = surveyResponses.every(response => response.features.length > 0);
        if (!allAnswered) {
            errorMessage.textContent = 'Please select at least one feature for each image.';
            errorMessage.style.color = 'red';
            return;
        }

        fetch('../php/save_survey.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: sessionStorage.getItem('user_id'),
                responses: surveyResponses
            }),
        }).then(response => response.json())
          .then(data => {
            if (data.status === 'success') {
                window.location.href = '../src/model.html';
            } else {
                errorMessage.textContent = 'Failed to save survey responses: ' + data.message;
                errorMessage.style.color = 'red';
            }
        }).catch(error => console.error('Error:', error));
    });
});
