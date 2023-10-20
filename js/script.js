function showLogin() {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("register-form").style.display = "none";
}

function showRegister() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "block";
}

function login() {
  // Обработка логики входа пользователя
  var username = document.getElementById("login-username").value;
  var password = document.getElementById("login-password").value;
  
  // Получение сохраненных данных из Local Storage
  var storedUsername = localStorage.getItem("username");
  var storedPassword = localStorage.getItem("password");
  
  // Проверка логина и пароля
  if (username === storedUsername && password === storedPassword) {
    // Вход выполнен успешно
    window.location.href = 'choseHero.html'
  } else {
    alert("Неверное имя пользователя или пароль.");
  }
}

function register() {
  // Обработка логики регистрации пользователя
  var username = document.getElementById("register-username").value;
  var password = document.getElementById("register-password").value;
  
  // Проверка наличия логина и пароля
  if (username && password) {
    // Сохранение данных в Local Storage
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    
    alert("Регистрация выполнена успешно!");
  } else {
    alert("Введите имя пользователя и пароль.");
  }
}

  showLogin();