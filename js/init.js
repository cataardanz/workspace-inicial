const BackendBaseUrl = "http://localhost:3000/api";
const CATEGORIES_URL = BackendBaseUrl + "/categories";
const PUBLISH_PRODUCT_URL = BackendBaseUrl + "/static/sell/publish.json"; 
const PRODUCTS_URL = BackendBaseUrl + "/cats_products/"; //
const PRODUCT_INFO_URL = BackendBaseUrl + "/products"; //
const PRODUCT_INFO_COMMENTS_URL = BackendBaseUrl + "/products_comments"; //
const CART_INFO_URL = BackendBaseUrl + "/cart_info"; 
const CART_BUY_URL = BackendBaseUrl + "/cart_buy";
const EXT_TYPE = ".json";

// Parte 2 Entrega 5

function configureUserDropdown() {
  const usuarioAutenticado = localStorage.getItem('loggedIn');  
  if (usuarioAutenticado) {
    // Redirigir a la pantalla del carrito
    document.getElementById('miCarrito').addEventListener('click', function() {
      window.location.href = 'cart.html'; 
    });
  
    // Redirigir a la pantalla del perfil
    document.getElementById('miPerfil').addEventListener('click', function() {
      window.location.href = 'my-profile.html'; 
    });
  
    document.getElementById('cerrarSesion').addEventListener('click', function() {
      // Cierra sesion
      localStorage.removeItem('loggedIn');
      
      // Redirige a la pantalla de login
      window.location.href = 'login.html'; 
    });
  }
}
configureUserDropdown();

// Desafiate E6
// Función para actualizar el contador del carrito
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart_products")) || [];
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.getElementById("cart-count").textContent = totalCount;
} 

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

// Entrega 1 
function checkAuth() {
  if (!localStorage.getItem("loggedIn") && ! window.location.href.includes("login.html")) {
      window.location.href = "login.html"; // Redirige a login.html si no está autenticado
  }
}

// Llamar a la función checkAuth al cargar la página
document.addEventListener("DOMContentLoaded", checkAuth);

async function init(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Datos recibidos:', data);
  } catch (error) {
    console.error('Error en la solicitud:', error.message);
  }
}


// Llamar a la función init al cargar la página
document.addEventListener("DOMContentLoaded", init);
updateCartCount();

let token = null;  // Aquí guardaremos el token JWT

// Función para realizar el login
async function login(username, password) {
  try {
      const response = await fetch(`${BackendBaseUrl}/login`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
      });
      if (!response.ok) {
          throw new Error('Credenciales incorrectas');
      }
      const data = await response.json();
      if (data.token) {
          token = data.token;
          console.log('Login exitoso', token);
          localStorage.setItem('jwtToken', token);
      }
  } catch (error) {
      console.error('Error en login:', error);
  }
}

// Función para obtener datos protegidos
async function getProtectedData() {
  const tokenFromStorage = localStorage.getItem('jwtToken');
  if (tokenFromStorage) {
      try {
          const response = await fetch(`${BackendBaseUrl}/protected`, {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${tokenFromStorage}`
              }
          });
          if (!response.ok) {
              throw new Error('No autorizado');
          }
          const data = await response.json();
          console.log('Datos protegidos:', data);
      } catch (error) {
          console.error('Error al acceder a datos protegidos:', error);
      }
  } else {
      console.log('No hay token disponible. Por favor, inicia sesión.');
  }
}