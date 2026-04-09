let cartCount = 0;
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        cartCount++;
        document.getElementById('cart-count').textContent = cartCount;
        alert(${button.parentElement.dataset.name} has been added to your cart.);
    });
});
