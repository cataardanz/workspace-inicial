function checkAuth() {
    if (!localStorage.getItem("loggedIn")) {
        window.location.href = "login.html"; // Redirige a login.html si no está autenticado
    }
}

// Llamar a la función checkAuth al cargar la página
document.addEventListener("DOMContentLoaded", checkAuth);