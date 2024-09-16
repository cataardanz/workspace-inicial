const data_url = "https://japceibal.github.io/emercado-api/cats_products/101.json";

let productsArray = [];

function showProductsList(array) {
  let htmlContentToAppend = `
    <div class="row row-cols-1 row-cols-md-3 g-4">`;

  for (let p of array) {
    htmlContentToAppend += `
    <a href="product-info.html" onclick="setProdID(${p.id})">
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
      </div>
    </a>`;  
  }

  htmlContentToAppend += `
    </div>`; // Cerrar la fila
  document.getElementById("list-cards-products").innerHTML = htmlContentToAppend;
}

function setProdID(id) {
  localStorage.setItem("ProdID", id);
  window.location = "product-info.html"
}

function searchProducts(query, products) {
 
    return products.filter(product => {
      return product.name.toLowerCase().includes(query.toLowerCase()) ||
             product.description.toLowerCase().includes(query.toLowerCase());
  });
}

document.addEventListener("DOMContentLoaded",function(){
  let catID = localStorage.getItem("catID");
  let url = `${PRODUCTS_URL}${catID}.json`;

 getJSONData(url).then(function(resultObj) {
    if (resultObj.status === "ok") {
      productsArray =resultObj.data.products;
      showProductsList(productsArray);
    }
  }).catch(function(error) {
    console.error("Error fetching data: ", error);
  });

  //Filtra
  document.getElementById('rangeFilterCount').addEventListener('click', function() {
    let minPrice = document.getElementById('rangeFilterCountMin').value;
    let maxPrice = document.getElementById('rangeFilterCountMax').value;
  
    let filteredProducts = productsArray.filter(product => {
      let price = product.cost;
      return (!minPrice || price >= minPrice) && (!maxPrice || price <= maxPrice);
    });
  
    showProductsList(filteredProducts);
  });

  document.getElementById('clearRangeFilter').addEventListener('click', function() {
    document.getElementById('rangeFilterCountMin').value = '';
    document.getElementById('rangeFilterCountMax').value = '';
    showProductsList(productsArray);
  });
  
  //Ordenan
  document.getElementById('sortPriceAsc').addEventListener('change', function() {
    let sortedProducts = [...productsArray].sort((a, b) => a.cost - b.cost);
    showProductsList(sortedProducts);
  });
  
  document.getElementById('sortPriceDesc').addEventListener('change', function() {
    let sortedProducts = [...productsArray].sort((a, b) => b.cost - a.cost);
    showProductsList(sortedProducts);
  });
  
  document.getElementById('sortByRelevance').addEventListener('change', function() {
    let sortedProducts = [...productsArray].sort((a, b) => b.soldCount - a.soldCount);
    showProductsList(sortedProducts);
  });

  document.getElementById("searchInput").addEventListener("input", function (event) {
    const searchQuery = event.target.value;
    const filteredProducts = searchProducts(searchQuery, productsArray);
    showProductsList(filteredProducts);
  });
});