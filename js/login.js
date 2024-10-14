document.querySelector("#button_log").addEventListener("click", function() {
    
    var usuario = document.querySelector(".log").value;
    var password = document.querySelector(".password").value;

    if (usuario === "" || password === "") {
        alert ("Asegúrese de llenar ambos campos");
    } else {
        // Simular autenticación ficticia
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", usuario); // Guarda el nombre de usuario
        window.location.href = "index.html"; // Redirigir a la portada
    }

});