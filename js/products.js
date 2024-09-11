const data_url = "https://japceibal.github.io/emercado-api/cats_products/101.json";

function showProductsList(array) {
  let htmlContentToAppend = `
    <div class="row row-cols-1 row-cols-md-3 g-4">`;

  for (let p of array) {
    htmlContentToAppend += `
      <div class="col">
        <div class="card h-100" style="border: 3px solid #69B5CC;">
          <img src="${p.image}" class="card-img-top" alt="Product Image">
          <div class="card-body">
            <h5 class="card-title fw-bold">${p.name}</h5>
            <p class="card-text">${p.description}</p>
            <p class="card-currency-cost">${p.currency} ${p.cost}</p>
          </div>
          <div class="card-footer">
            <small class="text-muted">Vendidos: ${p.soldCount}</small>
          </div>
        </div>
      </div>`;
  }

  htmlContentToAppend += `
    </div>`; // Cerrar la fila
  document.getElementById("list-cards-products").innerHTML = htmlContentToAppend;
}

function searchProducts(query, products) {
  const filteredProducts = products.filter(product => {
    return product.name.toLowerCase().includes(query.toLowerCase()) ||
           product.description.toLowerCase().includes(query.toLowerCase());   

  });
  return filteredProducts;
}

document.addEventListener("DOMContentLoaded",function(){
  let catID = localStorage.getItem("catID");
  let url = `${PRODUCTS_URL}${catID}.json`;

 getJSONData(url).then(function(resultObj) {
    if (resultObj.status === "ok") {
      showProductsList(resultObj.data.products);
    }
  }).catch(function(error) {
    console.error("Error fetching data: ", error);
  });
});