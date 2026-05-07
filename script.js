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
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                    <div style="display:flex; align-items:center;">
                        <img src="${item.img}" style="width:50px; height:50px; object-fit:contain; margin-right:10px; border-radius:5px;">
                        <div>
                            <div style="font-weight:bold;">${item.name}</div>
                            <div style="font-size:0.9em; color:#666;">NT$ ${item.price} x ${item.quantity}</div>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap: 10px;">
                        <span>NT$ ${item.price * item.quantity}</span>
                        <button class="remove-item" data-name="${item.name}" style="background:#ff4444; color:white; border:none; border-radius:3px; cursor:pointer; padding: 2px 8px;">×</button>
                    </div>
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
    const img = parent.getAttribute('data-img'); // <--- CRITICAL: This grabs the URL

    const existing = cartItems.find(i => i.name === name);
    if (existing) {
        existing.quantity++;
    } else {
        // Ensure 'img' is being added to the new object
        cartItems.push({ name, price, img, quantity: 1 }); 
    }
    updateCartCount();
}

        // 5. Remove/Decrease Item Logic
    if (e.target.classList.contains('remove-item')) {
        const name = e.target.getAttribute('data-name');
        const itemIndex = cartItems.findIndex(i => i.name === name);
    
        if (itemIndex > -1) {
            if (cartItems[itemIndex].quantity > 1) {
                // If more than 1, just decrease the count
                cartItems[itemIndex].quantity--;
            } else {
                // If it's the last one, remove it from the array
                cartItems.splice(itemIndex, 1);
            }
        }
        
        updateCartCount();
        showCart(); // Refresh the modal view
    }

    // 2. Open Cart
    if (e.target.closest('#cart')) {
        showCart();
    }

    // 3. Close Cart
    if (e.target.classList.contains('close') || e.target.id === 'cart-modal') {
        document.getElementById('cart-modal').style.display = 'none';
    }

     if (e.target.id === 'clear-cart-btn') {
        cartItems = [];
        document.getElementById('cust-name').value = ''; // Clear name
        document.getElementById('cust-email').value = ''; // Clear email
        updateCartCount();
        showCart();
    }

            // 6. Checkout Logic
    if (e.target.id === 'checkout-btn') {
        const nameInput = document.getElementById('cust-name').value.trim();
        const emailInput = document.getElementById('cust-email').value.trim();
    
        // 1. Validation
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        if (nameInput === "" || emailInput === "") {
            alert("Please enter your name and email to proceed.");
            return;
        }
    
        // 2. Prepare order summary
        let orderSummary = cartItems.map(item => 
            `${item.name} (x${item.quantity}) - NT$ ${item.price * item.quantity}`
        ).join('\n');
    
        const grandTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
        // 3. Fill the hidden form
        document.getElementById('form-name').value = nameInput;
        document.getElementById('form-email').value = emailInput;
        document.getElementById('form-order-details').value = orderSummary;
        document.getElementById('form-total-price').value = `NT$ ${grandTotal}`;
    
        // 4. Submit
        document.getElementById('checkout-form').submit();
    }
});
