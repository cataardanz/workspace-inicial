document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('item');
    const cartSummary = document.getElementById('cart-summary');
    const cartProducts = JSON.parse(localStorage.getItem("cart_products")) || [];

    // Verificar si hay productos en el carrito
    if (cartProducts.length === 0) {
        cartContainer.innerHTML = `
            <div id="empty">
                <p class="empty">No hay productos en el carrito</p>
            </div>`;
    } else {
        // Mostrar cada producto en el carrito
        cartProducts.forEach((product, index) => {
            const productElement = document.createElement('div');
            productElement.className = 'cart-product';
            productElement.innerHTML = `
                <img src="${product.image}" alt="Imagen del producto">
                <div class="product-info">
                    <div class="name">
                        <h3>${product.name}</h3>
                        <div class="trash" data-index="${index}">
                            <ion-icon name="trash-outline"></ion-icon>
                        </div>
                    </div>
                    <div class="price">
                        <p>Precio</p>
                        <p>${product.currency} ${product.cost}</p>
                    </div>
                    <div class="quantity">
                        <label for="quantity-${index}">Cantidad</label>
                        <input type="number" id="quantity-${index}" min="1" value="${product.quantity}">
                    </div>
                </div>
            `;
            cartContainer.appendChild(productElement);

            // Manejar cambios de cantidad
            const quantityInput = productElement.querySelector(`#quantity-${index}`);

            quantityInput.addEventListener('change', (e) => {
                const newQuantity = parseInt(e.target.value);
                if (newQuantity > 0) {
                    product.quantity = newQuantity;
                    localStorage.setItem("cart_products", JSON.stringify(cartProducts));
                    updateSummary();
                } else {
                    e.target.value = 1; // Restablecer a 1 si se intenta establecer a menos de 1
                }
            });

            // Manejar eliminación de producto
            const trashIcon = productElement.querySelector('.trash');

            trashIcon.addEventListener('click', () => {
                cartProducts.splice(index, 1); // Eliminar producto
                localStorage.setItem("cart_products", JSON.stringify(cartProducts));
                cartContainer.removeChild(productElement);
                updateSummary();
            });
        });

        updateSummary();
    }
});

// Función para actualizar el resumen, poner resumen en UYU Y USD
function updateSummary() {
    const cartProducts = JSON.parse(localStorage.getItem("cart_products")) || [];
    let localSubtotal = 0; // Subtotal en UYU
    let dollarSubtotal = 0; // Subtotal en USD
    let totalUYU = 0; // Total en UYU
    let totalUSD = 0; // Total en USD

    cartProducts.forEach(product => {
        if (product.currency === 'UYU') {
            localSubtotal += product.cost * product.quantity;
            totalUYU += product.cost * product.quantity; // Sumar al total en UYU
        } else if (product.currency === 'USD') {
            dollarSubtotal += product.cost * product.quantity;
            totalUSD += product.cost * product.quantity; // Sumar al total en USD
        }
});

    const cartSummary = document.getElementById('summary');

    cartSummary.innerHTML = `
        <div id="cart-summary">
            <div class="title-summary">
                <p>Resumen</p>
            </div>
            <div class="text-summary">
                <div class="subtotal">
                    <p class="sub">Subtotal</p>
                    <p>UYU  ${localSubtotal}</p>
                </div>
                <div class="subtotal-usd">
                    <p class="sub">Subtotal</p>
                    <p>USD  ${dollarSubtotal}</p>
                </div>
                <div class="total">
                    <p class="total">Total </p>
                    <p>UYU ${totalUYU}</p>
                </div>
                <div class="total-usd">
                    <p class="total">Total </p>
                    <p>USD ${totalUSD}</p>
                </div>
            </div>
            <button>Comprar</button>
        </div>
    `;
}

    // Desafiate E6

    // Parte 2 - Función para actualizar el contador de productos en el carrito

    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

        document.getElementById("cart-count").textContent = totalCount;
    }

    // Llamar a updateCartCount cuando se cargue la página para actualizar el badge
    document.addEventListener("DOMContentLoaded", updateCartCount);


    // Parte 1 - Función para agregar diferentes productos al carrito

    function addToCart(product) {
        // Obtener el carrito actual o crear uno nuevo si no existe
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Buscar si el producto ya está en el carrito
        const existingProduct = cart.find(item => item.name === product.name);

        if (existingProduct) {
            existingProduct.quantity += product.quantity;
        } else {
            cart.push(product);
        }

        // Guardar el carrito actualizado en localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartCount();
    }