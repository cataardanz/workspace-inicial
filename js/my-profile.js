document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("form-validation");
    const userEmail = localStorage.getItem('userEmail');
    
    // Cargar el email del usuario
    if (userEmail) {
        form.querySelector('input[type="email"]').value = userEmail;
    }

    // Manejo del envío del formulario
    form.addEventListener('submit', event => {
        event.preventDefault(); // Prevenir el envío por defecto
        if (validateOptionalFields(form)) {
            saveUserData(form);
            alert('Datos guardados correctamente.');
        }
        document.body.classList.add('was-validated');
    });
});

function saveUserData(form) {
    const userData = {
        nombre: form.querySelector('input[placeholder="Ingrese nombre"]').value,
        segundoNombre: form.querySelector('input[placeholder="Ingrese segundo nombre"]').value,
        apellido: form.querySelector('input[placeholder="Ingrese apellido"]').value,
        segundoApellido: form.querySelector('input[placeholder="Ingrese segundo apellido"]').value,
        email: form.querySelector('input[type="email"]').value,
        telefono: form.querySelector('input[placeholder="Ingrese teléfono de contacto"]').value,
    };

    // Guardar en localStorage
    let existingData = JSON.parse(localStorage.getItem('userData')) || {};
    Object.assign(existingData, userData); // Combinar datos existentes con nuevos
    localStorage.setItem('userData', JSON.stringify(existingData));
}

function validateOptionalFields(form) {
    const inputs = form.querySelectorAll('input');
    let valid = true;

    inputs.forEach(input => {
        const errorMessage = input.nextElementSibling; // Obtiene el siguiente hermano (small)
        if (input.required && !input.value) {
            valid = false;
            errorMessage.style.display = 'block'; // Mostrar mensaje de error
        } else {
            errorMessage.style.display = 'none'; // Ocultar mensaje de error
        }
    });

    return valid;
}





function previewImage(event) {
    var reader = new FileReader();
    
    reader.onload = function() {
        var output = document.getElementById('imagePreview');
        output.src = reader.result;
        output.style.display = 'block';

        // Guarda la imagen en localStorage
        localStorage.setItem('profileImage', reader.result);
    };
    
    reader.readAsDataURL(event.target.files[0]);
}