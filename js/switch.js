const mode = document.querySelector(".dark-mode"); 
const switchElement = document.querySelector("#switch"); 

document.addEventListener("DOMContentLoaded", () => {
    loadDarkMode(); // Cargar la preferencia de modo oscuro al cargar la página
    mode.addEventListener("click", switchDarkMode);
});

function switchDarkMode() {
    mode.classList.toggle("active");
    switchElement.classList.toggle("active"); // Cambiar a switchElement
    saveDarkMode(switchElement.classList.contains("active"));
}

function saveDarkMode(state) {
    localStorage.setItem("darkMode", state); // Guardar el estado como string
}

function loadDarkMode() {
    const darkModeGuardado = localStorage.getItem("darkMode") === "true";
    if (darkModeGuardado) {
        mode.classList.add("active");
        switchElement.classList.add("active"); // Cambiar a switchElement
    }
}




