let cart = [];

async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  const container = document.getElementById('products');
  container.innerHTML = '';
  products.forEach(p => {
    const item = document.createElement('div');
    item.innerHTML = `${p.name} - $${p.price} <button onclick='addToCart(${JSON.stringify(p)})'>Add</button>`;
    container.appendChild(item);
  });
}

function addToCart(product) {
  cart.push(product);
  updateCart();
}

function updateCart() {
  const cartDiv = document.getElementById('cart');
  cartDiv.innerHTML = '';
  cart.forEach(p => {
    const item = document.createElement('div');
    item.textContent = p.name + ' - $' + p.price;
    cartDiv.appendChild(item);
  });
}

function checkout() {
  document.getElementById('addressForm').style.display = 'block';
}

async function submitOrder() {
  const address = document.getElementById('address').value;
  const res = await fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, items: cart })
  });
  const data = await res.json();
  if (data.success) alert('Order placed!');
}

loadProducts();
