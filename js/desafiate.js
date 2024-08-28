/* Desafiate S1 */
document.getElementById("button_log").addEventListener("click", function () {
    const usuario = document.querySelector(".log").value;
    const password = document.querySelector(".password").value;

    if (usuario && password) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", usuario); // Guarda el nombre de usuario
        window.location.href = "index.html";
    }
});
