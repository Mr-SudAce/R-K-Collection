function loadLookbooksData() {
    fetch("json/lookbooks.json")
        .then(response => response.json())
        .then(data => {
            const section = document.getElementById("lookbooks-section");
            if (!section) return;

            // Hero
            const heroTitle = section.querySelector(".hero-content h1");
            const heroSubtitle = section.querySelector(".hero-content p");
            if (heroTitle) heroTitle.textContent = data.hero.title;
            if (heroSubtitle) heroSubtitle.textContent = data.hero.subtitle;

            // Intro
            const introTitle = section.querySelector(".section-intro h2");
            const introText = section.querySelector(".section-intro p");
            if (introTitle) introTitle.textContent = data.intro.heading;
            if (introText) introText.textContent = data.intro.text;

            // Grid
            const grid = section.querySelector(".lookbooks-grid");
            if (grid) {
                grid.innerHTML = data.collections.map(item => `
                    <div class="lookbook-card">
                        <div class="lookbook-image-wrapper">
                            <img src="${item.image}" alt="${item.title}">
                            <div class="lookbook-overlay">
                                <a href="${item.link}" class="btn-view">View Lookbook</a>
                            </div>
                        </div>
                        <div class="lookbook-info">
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                        </div>
                    </div>
                `).join('');
            }
        })
        .catch(error => console.error("Error loading lookbooks data:", error));
}

loadLookbooksData();