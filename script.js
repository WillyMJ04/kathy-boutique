const gallery = document.getElementById("gallery");

for (let i = 1; i <= 42; i++) {

    const num = i.toString().padStart(2, "0");

    const card = document.createElement("div");

    card.className = "product-card";

    card.innerHTML = `
        img/p${num}.jpeg
        <div class="info">
            <span>Disponible</span>
        </div>
    `;

    gallery.appendChild(card);
}

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
