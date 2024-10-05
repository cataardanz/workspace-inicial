let producto = {};
let prodID = localStorage.getItem("ProdID");
let urlComments = `${PRODUCT_INFO_COMMENTS_URL}${prodID}.json`;

document.addEventListener("DOMContentLoaded", function () {
    let url = `${PRODUCT_INFO_URL}${prodID}.json`;

    getJSONData(url).then(function (resultObj) {
        if (resultObj.status === "ok") {
            producto = resultObj.data;
            showProductInfo();
            fetchRelatedProductData();
        }
    }).catch(function (error) {
        console.error("Error al obtener los datos: ", error);
    });

    getJSONData(urlComments).then(function (resultObj) {
        if (resultObj.status === "ok") {
            comentarios = resultObj.data;
            showComments();
        }
    }).catch(function (error) {
        console.error("Error al obtener los comentarios: ", error);
    });

  // Mostrar las estrellas de reseñas
    const stars = document.querySelectorAll('.fa-star');
    let lastClickedIndex = -1;
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            if (index === lastClickedIndex) {
                // Si se hace clic en la misma estrella, desmarcar todas
                stars.forEach(s => s.classList.remove('checked'));
                lastClickedIndex = -1; // Reiniciar el índice
            } else {
                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.classList.add('checked');
                    } else {
                        s.classList.remove('checked');
                    }
                });
                lastClickedIndex = index;
            }
        });
    });
  
});

function showProductInfo() {
    let htmlContentToAppend = `

    <div class="product-container">
    <h2>${producto.name}</h2>
    <hr>
    <div class="section">
    <div class="product-image">
    ${showImages(producto.images)}  
    </div>          
    <div class="product-info">
    <p><strong>Precio:</strong> ${producto.currency} ${producto.cost}</p>
    <p><strong>Vendidos:</strong> ${producto.soldCount}</p>
    <p><strong>Categoría:</strong> ${producto.category}</p><br>
    <p><strong>Descripción</strong></p>
    <p>${producto.description}</p>
    </div> 
    </div>  
    </div>`;

    document.getElementById("product-details").innerHTML = htmlContentToAppend;
}

function showImages(images) {
    if (images && images.length) {
        // Crear los indicadores del carrusel
        const indicators = images.map((_, index) => `
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}" ${index === 0 ? 'class="active" aria-current="true"' : ''} aria-label="Slide ${index + 1}"></button>
        `).join('');

        // Crear los items del carrusel
        const carouselItems = images.map((img, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
        <img src="${img}" class="d-block w-100" alt="Imagen del producto">
        </div>
        `).join('');

        // Construir el HTML del carrusel
        return `
        <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        ${indicators}
        </div>
        <div class="carousel-inner">
        ${carouselItems}
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
        </button>
        </div>
        `;
    }
    return '<p>No hay imágenes disponibles</p>';
}

// Función para mostrar los comentarios de las reseñas.
function showComments() {
    let htmlCommentsToAppend = '';

    if (comentarios.length > 0) {
        comentarios.forEach(function(comment) {
            htmlCommentsToAppend += `
                <div class="review-card">
                    <div class="review-header d-flex justify-content-between">
                        <span class="checked">${getStars(comment.score)}</span>
                    </div>
                    <div class="review-body mt-2">
                        <div class="user-info">
                            <p class="pb-1 fs-6"><strong>${comment.user}</strong></p>
                            <p style="font-size: 14px">${comment.description}</p>
                        </div>
                        <p class="review-date"><em>${comment.dateTime}</em></p>
                    </div>
                </div>`;
        });
    } else {
        htmlCommentsToAppend += `<p>Este producto no tiene reseñas.</p>`;
    }

    document.getElementById("comments-section").innerHTML = htmlCommentsToAppend;
}

// Función para crear las estrellas de puntuación
function getStars(score) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= score) {
            stars += `<i class="fa fa-star checked" style="color: gold;"></i>`; // estrella llena dorada
        } else {
            stars += `<i class="fa fa-star" style="color: lightgray;"></i>`; // estrella vacía
        }
    }
    return stars;
}

// Parte 4 :)

// URL de la API para obtener los datos de la categoría
const apiCategoryURL = PRODUCTS_URL + localStorage.getItem("catID") + ".json";
let categoryData = null;

// Función para cargar los datos desde la API
async function fetchRelatedProductData() {
    try {
        const response = await fetch(apiCategoryURL);
        if (!response.ok) {
            throw new Error("Error al obtener los datos de la API: " + response.statusText);
        }
        categoryData = await response.json();
        initializeRelatedSection();
    } catch (error) {
        console.error("Error:", error);
    }
};

// Función para renderizar productos relacionados
function renderRelatedProducts(products) {
    const relatedProductsContainer = document.getElementById('related-products');
    relatedProductsContainer.innerHTML = ''; 

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('col-md-4'); 
        productElement.innerHTML = `
        <div class="card mb-4"> <!-- Agregamos un margen inferior -->
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <div class="card-body">
        <h5 class="card-title">${product.name}</h5>
        <p class="card-text">${product.currency} ${product.cost}</p>
        <button class="btn btn-primary" onclick="updateProduct(${product.id})">Ver más</button>
        </div>
        </div>
        `;
        relatedProductsContainer.appendChild(productElement);
    });
}

// Función para inicializar la seccion productos relacionados
function initializeRelatedSection() {
    if (categoryData && categoryData.products) {
        const relatedProducts = categoryData.products.filter(product => product.id != producto.id);
        renderRelatedProducts(relatedProducts);
    } else {
        console.error('Datos de categoría no encontrados');
    }
}

// Función para actualizar el producto actual
function updateProduct(id) {
    localStorage.setItem("ProdID", id)
    window.location.href = `product-info.html`; 
}
