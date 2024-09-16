let producto = {};

document.addEventListener("DOMContentLoaded", function() {
    let prodID = localStorage.getItem("ProdID");
    let url = `${PRODUCT_INFO_URL}${prodID}.json`;

    getJSONData(url).then(function(resultObj) {
        if (resultObj.status === "ok") {
            producto = resultObj.data;
            showProductInfo();
        }
    }).catch(function(error) {
        console.error("Error al obtener los datos: ", error);
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

    document.getElementById("product-info").innerHTML = htmlContentToAppend;
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