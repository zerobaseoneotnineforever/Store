let cartItems = [];
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const productElement = button.parentElement;
        const productName = productElement.dataset.name;
        const productPrice = parseFloat(productElement.dataset.price);
        addToCart(productName, productPrice);
        updateCartDisplay();
    });
});
// Function to add items to the cart
function addToCart(name, price) {
    const existingItem = cartItems.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartItems.push({ name, price, quantity: 1 });
    }
}
// Update the cart display count
function updateCartDisplay() {
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}
// Show modal
function showCartModal() {
    const cartModal = document.getElementById('cart-modal');
    const modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = '<span class="close">&times;</span>';
    cartItems.forEach(item => {
        modalContent.innerHTML += <div class="cart-item">${item.name} (x${item.quantity}) - NT$ ${item.price * item.quantity}</div>;
    });
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    modalContent.innerHTML += <div class="cart-item"><strong>Total: NT$ ${total}</strong></div>;
    cartModal.style.display = "block";
}
// Close modal
document.addEventListener('click', (event) => {
    if (event.target.matches('#cart')) {
        showCartModal();
    }
    if (event.target.matches('.close') || event.target.matches('#cart-modal')) {
        document.getElementById('cart-modal').style.display = "none";
    }
});
<div class="cart-item">${item.name} (x${item.quantity}) - NT$ ${item.price * item.quantity}</div><div class="cart-item"><strong>Total: NT$ ${total}</strong></div>
