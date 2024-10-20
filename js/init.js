const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
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
      if (!response.ok) throw new Error('Error en la petición');
      const data = await response.json();
      // Maneja los datos recibidos aquí
  } catch (error) {
      console.error('Error:', error);
  }
}

// Llamar a la función init al cargar la página
document.addEventListener("DOMContentLoaded", init);