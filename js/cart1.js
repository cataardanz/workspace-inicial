const cartProducts = JSON.parse(localStorage.getItem("cart_products")) || [];
const cartContainer = document.getElementById('cart-container');
const cartList = document.getElementById('product-list')

document.addEventListener('DOMContentLoaded', () => {
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

    //Función que maneja los cambios de cantidad de productos.
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

    //Función que maneja la eliminación de productos con icono de papelera.
        const trashIcon = productElement.querySelector('.trash');
        trashIcon.addEventListener('click', () => {
            const itemIndexToDelete = cartProducts.findIndex(p => p.name === product.name)
            cartProducts.splice(itemIndexToDelete, 1); // Eliminar producto
            localStorage.setItem("cart_products", JSON.stringify(cartProducts));
            cartList.removeChild(productElement);
                
    //Mostrar mensaje si el carrito está vacío después de eliminar
        if (cartProducts.length === 0) {
            cartContainer.innerHTML = `
                <div id="empty">
                    <p class="empty">No hay productos en el carrito</p>
                </div>`;
            }   
            updateCartTitleCount();
            updateSummary();});
        });

        updateSummary();}
});


//Función para actualizar el resumen de costos.
function updateSummary() {
    
    // Pasar todos los precios a moneda UYU (subtotal) con tipo de cambio
    let subtotal = 0;
    const exchangeRate = 40; // Tipo de cambio: 1 USD = 40 UYU

    cartProducts.forEach(product => {
        let costInUYU;
        if (product.currency === "USD") { // Convertir de dólares a pesos uruguayos
            costInUYU = product.cost * exchangeRate;
        } else { // Si ya está en UYU, usar el costo directamente   
            costInUYU = product.cost;
        }
        subtotal += costInUYU * product.quantity;
    });
    
    const subtotalElement = document.getElementById('subtotal');
    const totalCostElement = document.getElementById('totalCost');
    const shippingOptions = document.getElementsByName('shipping');
    const shippingCostElement = document.getElementById('shippingCost');
    
    // Obtener la opción de envío seleccionada
    const selectedShipping = [...shippingOptions].find(option => option.checked);
    const shippingRate = selectedShipping ? parseFloat(selectedShipping.value) : 0;

    // Calcular el porcentaje del envío y sumarlo al subtotal
    const shippingCost = subtotal * shippingRate;
    const total = subtotal + shippingCost;

    // Elementos actualizados del resumen de costos
    subtotalElement.innerText = subtotal.toFixed(2) + " UYU";
    shippingCostElement.innerText = shippingCost.toFixed(2) + " UYU";
    totalCostElement.innerText = total.toFixed(2) + " UYU";
    updateCartCount();
    updateCartTitleCount();
}

// Función que actualiza y muestra la cantidad de los productos en el título.
function updateCartTitleCount() {
    const totalQuantity = cartProducts.reduce((sum, item) => sum + item.quantity, 0);
    const cartTitle = document.getElementById('cart-title');
    cartTitle.innerHTML = `
        <p>Mi carrito (${totalQuantity} Item(s))</p> `;
}

//Función que muestra el toast de notificación.
function showToast(message, type = 'danger') {
    const toastNotification = document.createElement('div');

    toastNotification.classList.add('toast', `bg-${type}`, 'text-white', 'position-fixed', 'bottom-0', 'end-0', 'm-3');
    toastNotification.innerHTML = `
        <div class="toast-body">
            ${message}
        </div> `;
    document.body.appendChild(toastNotification);

    const toast = new bootstrap.Toast(toastNotification);
    toast.show();
    setTimeout(() => {
        toastNotification.remove();
    }, 3000);
}

//Función que valida que se hayan completado todos los campos necesarios para procesar el pago y realizar la compra.
const checkoutButton = document.getElementById('checkoutButton');
checkoutButton.addEventListener('click', (e) => {
    e.preventDefault(); 
    
    // Validación de si el carrito tiene productos
    if (cartProducts.length === 0) {
        showToast('Tu carrito está vacío. Por favor agrega productos antes de finalizar la compra.', 'danger');
        return; // Evita que el resto de la validación se ejecute
    }

    //Obtención de los valores de los campos de dirección de envío
    const department = document.getElementById('department').value.trim();
    const locality = document.getElementById('locality').value.trim();
    const street = document.getElementById('street').value.trim();
    const number = document.getElementById('number').value.trim();
    const corner = document.getElementById('corner').value.trim();

    //Acordeón de tarjeta de crédito  y de transferencia bancaria 
    const creditCardAccordion = document.getElementById('collapseCreditCard');
    const bankTransferAccordion = document.getElementById('collapseBankTransfer');
    
    //Obtención de los valores de los campos del formulario de pago
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const cardHolderName = document.getElementById('cardHolderName').value.trim();
    const expirationDate = document.getElementById('expirationDate').value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    const bankAccount = document.getElementById('bankAccount').value.trim();

    //Condición de validación de pago:
    let paymentValid = false;

    if (creditCardAccordion.classList.contains('show')) { 
        // Si el acordeón de tarjeta de crédito está desplegado, verificar campos de tarjeta
        paymentValid = (cardNumber && cardHolderName && expirationDate && cvv) && !bankAccount;
    } else if (bankTransferAccordion.classList.contains('show')) { 
        // Si el acordeón de transferencia bancaria está desplegado, verificar campo de cuenta bancaria
        paymentValid = bankAccount && !cardNumber && !cardHolderName && !expirationDate && !cvv;
    }

    //Validación de dirección de envío y tipo de envío:
    const shippingOption = document.querySelector('input[name="shipping"]:checked');
    const isShippingValid = shippingOption;
    
    //Validación final y mostrar mensaje:
    if (!department || !locality || !street || !number || !corner) {
        showToast('Por favor completa todos los campos de dirección de envío');
    } else if (!paymentValid) {
        showToast('Por favor completa todos los campos de método de pago');
    } else if (!isShippingValid) {
        showToast('Por favor selecciona una forma de envío');
    } else {
        showToast('Tu compra ha sido realizada con éxito', 'success');
    }
});
