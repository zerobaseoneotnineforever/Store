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
    const img = parent.getAttribute('data-img');

    const existing = cartItems.find(i => i.name === name);
    if (existing) {
        existing.quantity++;
    } else {
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
                cartItems[itemIndex].quantity--;
            } else {
                cartItems.splice(itemIndex, 1);
            }
        }
        
        updateCartCount();
        showCart();
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
        document.getElementById('cust-name').value = ''; 
        document.getElementById('cust-email').value = ''; 
        updateCartCount();
        showCart();
    }

    // 6. Checkout Logic (MODIFIED FOR FETCH)
    if (e.target.id === 'checkout-btn') {
        const nameInput = document.getElementById('cust-name').value.trim();
        const emailInput = document.getElementById('cust-email').value.trim();
    
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        if (nameInput === "" || emailInput === "") {
            alert("Please enter your name and email to proceed.");
            return;
        }
    
        let orderSummary = cartItems.map(item => 
            `${item.name} (x${item.quantity}) - NT$ ${item.price * item.quantity}`
        ).join('\n');
    
        const grandTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
        // Disable button to prevent double clicks
        const btn = e.target;
        btn.disabled = true;
        btn.innerText = "Sending...";

        // Prepare Data for Fetch
        const formData = new FormData();
        formData.append("Customer_Name", nameInput);
        formData.append("Customer_Email", emailInput);
        formData.append("Order_Details", orderSummary);
        formData.append("Total_Price", `NT$ ${grandTotal}`);
        formData.append("Payment_Method", "Cash");
        formData.append("_subject", "New Drink Order!");
        // This stops FormSubmit from showing its own "Thank You" page
        formData.append("_captcha", "false"); 

        // 4. Submit using Fetch (No Redirect)
        fetch("https://formsubmit.co/ajax/rafaeldistribution811@gmail.com", {
            method: "POST",
            body: formData
        })
        .then(response => {
            if (response.ok) {
                alert("Thank you for your order!");
                // Clear the cart
                cartItems = [];
                document.getElementById('cust-name').value = '';
                document.getElementById('cust-email').value = '';
                updateCartCount();
                document.getElementById('cart-modal').style.display = 'none';
            } else {
                alert("Oops! There was a problem. You might be sending orders too fast.");
            }
        })
        .catch(error => {
            alert("Error: Could not connect to the server.");
        })
        .finally(() => {
            btn.disabled = false;
            btn.innerText = "Submit Order";
        });
    }
});
