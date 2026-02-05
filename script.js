// script.js (für index.html)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBUH7HWWhA-cHllde7Yy0YNwnG34lawG6g",
  authDomain: "mcking-659b6.firebaseapp.com",
  databaseURL: "https://mcking-659b6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mcking-659b6",
  storageBucket: "mcking-659b6.firebasestorage.app",
  messagingSenderId: "1086112729985",
  appId: "1:1086112729985:web:7deed0bbf08412d150b680"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let cart = [];

// Produkte in Warenkorb hinzufügen
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const product = button.parentElement;
        const name = product.dataset.name;
        cart.push(name);
        updateCart();
    });
});

// Warenkorb aktualisieren
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${item} <button class="remove-btn" data-index="${index}">Entfernen</button>`;
        cartItems.appendChild(li);
    });

    // Entfernen-Buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', () => {
            const index = button.dataset.index;
            cart.splice(index, 1);
            updateCart();
        });
    });
}

// Bestellung aufgeben
document.getElementById('order-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Warenkorb ist leer!');
        return;
    }
    if (confirm('Bestellung bestätigen?')) {
        const orderNumber = Math.floor(Math.random() * 901) + 100; // 100-1000
        const orderRef = push(ref(db, 'orders'));
        set(orderRef, {
            number: orderNumber,
            items: cart,
            status: 'In Zubereitung'
        });
        // Bestellnummer anzeigen
        document.getElementById('order-number-display').textContent = orderNumber;
        document.getElementById('order-confirmation').style.display = 'block';
        cart = [];
        updateCart();
    }
});

// Kategorien filtern
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Aktive Klasse entfernen
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const category = button.dataset.category;
        const products = document.querySelectorAll('.product');

        products.forEach(product => {
            if (category === 'all' || product.classList.contains(category)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    });
});