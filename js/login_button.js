/*Desafiate 2 */
document.addEventListener("DOMContentLoaded", function () {
    const userName = localStorage.getItem("username");
    if (userName) {
        const loginLink = document.getElementById('login-link');
        const userInfo = document.getElementById('user-info');
        const userNameElement = document.getElementById('user-name');

        userNameElement.innerHTML = `Hola, ${userName}`;
        loginLink.style.display = 'none';
        userInfo.style.display = 'block';
    }

    /*Desafiate 1*/
    if (localStorage.getItem("loggedIn") !== "true") {
        window.location.href = "login.html";
    }
});