document.getElementById("button_log").addEventListener("click", function () {
    const usuario = document.querySelector(".log").value;
    const password = document.querySelector(".password").value;

    if (usuario && password) {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "index.html";
    } else {
        alert("Usuario o contaseña incorrectos");
    }

});
