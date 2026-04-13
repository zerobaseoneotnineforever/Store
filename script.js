let cartItems = [];
// Event listeners for "Add to Cart" buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const productElement = button.parentElement;
        const productName = productElement.dataset.name;
        const productPrice = parseInt(productElement.dataset.price, 10); // Convert to integer
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
// Function to update the cart display count
function updateCartDisplay() {
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}
// Show the cart modal with items
function showCartModal() {
    const cartModal = document.getElementById('cart-modal');
    const cartItemsDisplay = document.getElementById('cart-items');
    const cartTotalDisplay = document.getElementById('cart-total');
    // Clear previous content
    cartItemsDisplay.innerHTML = '';
    cartTotalDisplay.innerHTML = '';
    // Populate modal with cart items
    if (cartItems.length === 0) {
        cartItemsDisplay.innerHTML = <div class="cart-item">Your cart is empty.</div>;
    } else {
        cartItems.forEach(item => {
            cartItemsDisplay.innerHTML += <div class="cart-item">${item.name} (x${item.quantity}) - NT$ ${item.price * item.quantity}</div>;
        });
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalDisplay.innerHTML = <strong>Total: NT$ ${total}</strong>;
    }
    // Display the modal
    cartModal.style.display = "block";
}
// Event listener to show cart modal when clicking the cart summary
document.getElementById('cart').addEventListener('click', showCartModal);
// Close modal functionality
document.addEventListener('click', (event) => {
    if (event.target.matches('.close') || event.target.matches('#cart-modal')) {
        document.getElementById('cart-modal').style.display = "none";
    }
});
<div class="cart-item">Your cart is empty.</div><div class="cart-item">${item.name} (x${item.quantity}) - NT$ ${item.price * item.quantity}</div><strong>Total: NT$ ${total}</strong>
