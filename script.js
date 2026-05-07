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
    e.preventDefault(); // <--- THIS PREVENTS THE BLACK WINDOW FROM OPENING
    
    const nameInput = document.getElementById('cust-name').value.trim();
    // ... the rest of your code ...
    const emailInput = document.getElementById('cust-email').value.trim();
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    if (nameInput === "" || emailInput === "") {
        alert("Please enter your name and email.");
        return;
    }

    // Disable button so they don't click twice
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = "Sending...";

    // Prepare data
    let orderSummary = cartItems.map(item => 
        `${item.name} (x${item.quantity}) - NT$ ${item.price * item.quantity}`
    ).join('\n');
    const grandTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Send via Fetch (AJAX)
    fetch("https://formsubmit.co/ajax/your@email.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            Name: nameInput,
            Email: emailInput,
            Order: orderSummary,
            Total: `NT$ ${grandTotal}`,
            Payment: "Cash"
        })
    })
    .then(response => {
    if (response.status === 429) {
        throw new Error("Too many requests! Please wait a few minutes before trying again.");
    }
    return response.json();
})
    .then(data => {
        alert("Thank you for your order!");
        // ... clear cart logic ...
    })
    .catch(error => {
        alert(error.message); // This will now say "Too many requests!" instead of failing silently
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = "Submit Order";
    });
        // Reset everything
        cartItems = [];
        document.getElementById('cust-name').value = '';
        document.getElementById('cust-email').value = '';
        updateCartCount();
        document.getElementById('cart-modal').style.display = 'none';
        
        // Reset button
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = "Submit Order";
    })
    .catch(error => {
        console.log(error);
        alert("Something went wrong. Please try again.");
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = "Submit Order";
    });
}
let isLoginMode = true;

// 7. Auth Logic
document.addEventListener('click', function(e) {
    const authModal = document.getElementById('auth-modal');
    
    // Open Modal
    if (e.target.id === 'login-trigger-btn') {
        if (e.target.textContent === 'Logout') {
            localStorage.removeItem('currentUser');
            location.reload(); // Refresh to reset
            return;
        }
        authModal.style.display = 'block';
    }

    // Close Modal
    if (e.target.classList.contains('close-auth') || e.target === authModal) {
        authModal.style.display = 'none';
    }

    // Switch between Login and Register
    if (e.target.id === 'auth-switch') {
        isLoginMode = !isLoginMode;
        document.getElementById('auth-title').textContent = isLoginMode ? 'Login' : 'Register';
        document.getElementById('auth-submit-btn').textContent = isLoginMode ? 'Login' : 'Register';
        e.target.textContent = isLoginMode ? "Don't have an account? Register" : "Already have an account? Login";
    }

    // Handle Submit
    if (e.target.id === 'auth-submit-btn') {
        const user = document.getElementById('auth-username').value.trim();
        const pass = document.getElementById('auth-password').value.trim();

        if (!user || !pass) return alert("Fill all fields");

        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (isLoginMode) {
            // LOGIN logic
            const foundUser = users.find(u => u.username === user && u.password === pass);
            if (foundUser) {
                localStorage.setItem('currentUser', user);
                alert("Welcome back, " + user);
                location.reload();
            } else {
                alert("Invalid credentials");
            }
        } else {
            // REGISTER logic
            if (users.find(u => u.username === user)) return alert("User exists!");
            users.push({ username: user, password: pass });
            localStorage.setItem('users', JSON.stringify(users));
            alert("Account created! Now please Login.");
            // Switch back to login
            document.getElementById('auth-switch').click();
        }
    }
});

// Check if user is already logged in on page load
window.onload = function() {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
        document.getElementById('user-display').textContent = "Hi, " + loggedInUser;
        document.getElementById('login-trigger-btn').textContent = "Logout";
        // Auto-fill the email field in the checkout if you want
        if(document.getElementById('cust-name')) {
            document.getElementById('cust-name').value = loggedInUser;
        }
    }
};
