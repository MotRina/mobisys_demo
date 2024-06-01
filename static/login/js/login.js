document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch('login.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            sessionStorage.setItem('user_id', data.user_id); // Store user_id in sessionStorage
            sessionStorage.setItem('username', data.username); // Store username in sessionStorage
            window.location.href = '../home/index.html';
        } else {
            document.getElementById('error-message').innerText = data.message;
        }
    })
    .catch(error => console.error('Error:', error));
});
