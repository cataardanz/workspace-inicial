document.querySelector("#button_log").addEventListener("click", function() {
    
    var usuario = document.querySelector(".log").value;
    var password = document.querySelector(".password").value;

    if (usuario === "" || password === "") {
        alert ("Asegúrese de llenar ambos campos");
    } else {
        window.location.href = "index.html";
    }

})