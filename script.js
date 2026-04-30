let cartItems = [];

// 1. Function to add items to the cart
function addToCart(name, price) {
    const existingItem = cartItems.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartItems.push({ name, price, quantity: 1 });
    }
    updateCartDisplay();
}

// 2. Function to update the number shown in the header
function updateCartDisplay() {
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}

// 3. Function to build and show the modal
function showCartModal() {
    const cartModal = document.getElementById('cart-modal');
    const cartItemsDisplay = document.getElementById('cart-items');
    const cartTotalDisplay = document.getElementById('cart-total');

    // Clear previous content
    cartItemsDisplay.innerHTML = '';
    cartTotalDisplay.innerHTML = '';

    if (cartItems.length === 0) {
        cartItemsDisplay.innerHTML = `<div class="cart-item">Your cart is empty.</div>`;
    } else {
        cartItems.forEach(item => {
            // Note the use of backticks `` for template strings
            cartItemsDisplay.innerHTML += `
                <div class="cart-item">
                    ${item.name} (x${item.quantity}) - NT$ ${item.price * item.quantity}
                </div>`;
        });
        
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalDisplay.innerHTML = `<strong>Total: NT$ ${total}</strong>`;
    }

    cartModal.style.display = "block";
}

// 4. EVENT LISTENERS

// Listen for "Add to Cart" button clicks
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (event) => {
        const productElement = event.target.closest('.product');
        const productName = productElement.dataset.name;
        const productPrice = parseInt(productElement.dataset.price, 10);
        
        addToCart(productName, productPrice);
    });
});

// Show modal when clicking the Cart summary in header
document.getElementById('cart').addEventListener('click', showCartModal);

// Close modal when clicking 'X' or outside the box
document.addEventListener('click', (event) => {
    if (event.target.matches('.close') || event.target.id === 'cart-modal') {
        document.getElementById('cart-modal').style.display = "none";
    }
});

// Function to clear everything
function clearCart() {
    if (confirm("Are you sure you want to clear your cart?")) {
        cartItems = []; // Empty the array
        updateCartDisplay(); // Reset the header count
        showCartModal(); // Refresh the modal view (it will show "empty")
    }
}

// Add the event listener (put this with your other listeners at the bottom)
document.getElementById('clear-cart').addEventListener('click', clearCart);
