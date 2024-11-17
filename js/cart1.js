document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-container');
    const cartList = document.getElementById('product-list')
    const cartCost = document.getElementById('cost');
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
                        <p class="name">${product.name}</p>
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
            cartList.appendChild(productElement);

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
                cartList.removeChild(productElement);
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
            totalUSD += product.cost / 40 * product.quantity;
        } else if (product.currency === 'USD') {
            dollarSubtotal += product.cost * product.quantity;
            totalUSD += product.cost * product.quantity; // Sumar al total en USD
            totalUYU += product.cost * 40 * product.quantity;
        }
    });

    // Desafiate E6
    updateCartCount();
    updateCartTitleCount();
}

//E7 P2b 

// Actualiza los costos cada vez que cambie el método de envío
document.getElementById('shippingOption').addEventListener('change', updateSummary);

updateSummary();

function updateCartTitleCount() {
    const cartProducts = JSON.parse(localStorage.getItem("cart_products")) || [];
    const totalQuantity = cartProducts.reduce((sum, item) => sum + item.quantity, 0);
    const cartTitle = document.getElementById('cart-title');
    cartTitle.innerHTML = `
        <p>Mi carrito (${totalQuantity} Item(s))</p>
    `;
}

document.getElementById('shippingOption').addEventListener('change', updateSummary);