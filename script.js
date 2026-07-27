/* ==========================
   Número de WhatsApp de la tienda
========================== */
const WHATSAPP_NUMBER = "50255999504";

/* ==========================
   1. Generar tarjetas de producto
========================== */
const gallery = document.getElementById("gallery");

for (let i = 1; i <= 42; i++) {

    const num = i.toString().padStart(2, "0");

    const card = document.createElement("div");

    card.className = "product-card";
    card.dataset.id = num;

    card.innerHTML = `
        <div class="img-wrap" style="background-image:url('img/p${num}.jpeg')">
            <img src="img/p${num}.jpeg" alt="Producto ${num}" class="product-img">
        </div>
        <div class="info">
            <span>Disponible</span>
            <button class="add-btn" data-id="${num}">Agregar al carrito</button>
        </div>
    `;

    gallery.appendChild(card);
}

/* ==========================
   2. Animación al hacer scroll
========================== */
const cards = document.querySelectorAll(".product-card");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, {
    threshold: 0.15
});

cards.forEach((card) => {
    observer.observe(card);
});

/* ==========================
   3. Lightbox (zoom de imagen)
========================== */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");

document.querySelectorAll(".product-img").forEach((img) => {
    img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightbox.classList.add("active");
    });
});

lightboxClose.addEventListener("click", () => {
    lightbox.classList.remove("active");
});

lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove("active");
    }
});

/* ==========================
   4. Carrito de compras
========================== */
let cart = [];

const cartToggle = document.getElementById("cart-toggle");
const cartPanel = document.getElementById("cart-panel");
const cartClose = document.getElementById("cart-close");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsEl = document.getElementById("cart-items");
const cartCountEl = document.getElementById("cart-count");
const cartSendBtn = document.getElementById("cart-send");

function openCart() {
    cartPanel.classList.add("active");
    cartOverlay.classList.add("active");
}

function closeCart() {
    cartPanel.classList.remove("active");
    cartOverlay.classList.remove("active");
}

cartToggle.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

function addToCart(id) {
    const existing = cart.find((item) => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id, qty: 1 });
    }
    renderCart();
    openCart();
}

function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    renderCart();
}

function changeQty(id, delta) {
    const item = cart.find((item) => item.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(id);
    } else {
        renderCart();
    }
}

function renderCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountEl.textContent = totalItems;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `<p class="cart-empty">Tu carrito está vacío</p>`;
        return;
    }

    cartItemsEl.innerHTML = cart.map((item) => `
        <div class="cart-item">
            <img src="img/p${item.id}.jpeg" alt="Producto ${item.id}">
            <div class="cart-item-info">
                <span>Producto ${item.id}</span>
                <div class="qty-controls">
                    <button class="qty-btn" data-action="minus" data-id="${item.id}">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-btn" data-id="${item.id}">🗑️</button>
        </div>
    `).join("");
}

// Delegación de eventos: botones "Agregar al carrito"
gallery.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-btn")) {
        addToCart(e.target.dataset.id);
    }
});

// Delegación de eventos dentro del carrito (sumar, restar, eliminar)
cartItemsEl.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains("remove-btn")) {
        removeFromCart(id);
    } else if (e.target.dataset.action === "plus") {
        changeQty(id, 1);
    } else if (e.target.dataset.action === "minus") {
        changeQty(id, -1);
    }
});

/* ==========================
   5. Enviar pedido por WhatsApp
========================== */
cartSendBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de enviar el pedido.");
        return;
    }

    let mensaje = "¡Hola Kathy Boutique! 🌷 Quiero pedir lo siguiente:\n\n";

    cart.forEach((item) => {
        mensaje += `• Producto ${item.id} — Cantidad: ${item.qty}\n`;
    });

    mensaje += "\n¿Me confirmas disponibilidad y precio? ¡Gracias!";

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
});
