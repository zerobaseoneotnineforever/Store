let cartItems = [];

// Updates the number in the header
function updateCartCount() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

// Shows the modal window
function showCart() {
    const itemsContainer = document.getElementById('cart-items');
    const totalContainer = document.getElementById('cart-total');
    
    itemsContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
        itemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        totalContainer.innerHTML = '';
    } else {
        cartItems.forEach(item => {
            itemsContainer.innerHTML += `
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span>${item.name} x${item.quantity}</span>
                    <span>NT$ ${item.price * item.quantity}</span>
                </div>`;
        });
        const grandTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalContainer.innerHTML = `<strong>Total: NT$ ${grandTotal}</strong>`;
    }
    
    document.getElementById('cart-modal').style.display = 'block';
}

// THE BUTTON LOGIC
document.addEventListener('click', function(e) {
    // 1. Add to Cart Logic
    if (e.target.classList.contains('add-to-cart')) {
        const parent = e.target.closest('.product');
        const name = parent.getAttribute('data-name');
        const price = parseInt(parent.getAttribute('data-price'));

        const existing = cartItems.find(i => i.name === name);
        if (existing) {
            existing.quantity++;
        } else {
            cartItems.push({ name, price, quantity: 1 });
        }
        updateCartCount();
    }

    // 2. Open Cart
    if (e.target.closest('#cart')) {
        showCart();
    }

    // 3. Close Cart
    if (e.target.classList.contains('close') || e.target.id === 'cart-modal') {
        document.getElementById('cart-modal').style.display = 'none';
    }

    // 4. Clear Cart Logic
    if (e.target.id === 'clear-cart-btn') {
        cartItems = [];
        updateCartCount();
        showCart();
    }
});
