document.addEventListener('DOMContentLoaded', () => {
  const username = sessionStorage.getItem('username');
  if (username) {
    document.getElementById('username').innerText = `Welcome, ${username}`;
    document.querySelector('.login').style.display = 'none';
    document.querySelector('.signup').style.display = 'none';
    document.getElementById('logout').style.display = 'block';
    document.getElementById('start-btn-1').href = '../start/src/start.html';
    document.getElementById('start-btn-2').href = '../start/src/start.html';
  }
});

document.getElementById('start-btn-1').addEventListener('click', function(event) {
  if (!sessionStorage.getItem('username')) {
    event.preventDefault();
    document.getElementById('start-error-1').style.display = 'block';
  }
});

document.getElementById('start-btn-2').addEventListener('click', function(event) {
  if (!sessionStorage.getItem('username')) {
    event.preventDefault();
    document.getElementById('start-error-2').style.display = 'block';
  }
});

document.getElementById('logout').addEventListener('click', function() {
  fetch('logout.php')
    .then(() => {
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('user_id');
      document.getElementById('username').innerText = '';
      document.querySelector('.login').style.display = 'block';
      document.querySelector('.signup').style.display = 'block';
      document.getElementById('logout').style.display = 'none';
      window.location.href = 'index.html';
    });
});
