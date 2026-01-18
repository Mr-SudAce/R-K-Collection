function loadChildrenData() {
    fetch("json/children.json")
        .then(response => response.json())
        .then(data => {
            const section = document.getElementById("children-section");
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

            // Features
            const featuresGrid = section.querySelector(".features-grid");
            if (featuresGrid) {
                featuresGrid.innerHTML = data.features.map(feature => `
                    <div class="feature-card">
                        <div class="feature-icon">${feature.icon}</div>
                        <h3>${feature.title}</h3>
                        <p>${feature.description}</p>
                    </div>
                `).join('');
            }

            // Showcase
            const showcaseTitle = section.querySelector(".kids-showcase h2");
            if (showcaseTitle) showcaseTitle.textContent = data.showcase.heading;

            const kidsGrid = section.querySelector(".kids-grid");
            if (kidsGrid) {
                kidsGrid.innerHTML = data.showcase.images.map(img => `
                    <div class="kids-item">
                        <img src="${img.src}" alt="${img.alt}">
                    </div>
                `).join('');
            }
        })
        .catch(error => console.error("Error loading children data:", error));
}

// Execute immediately when loaded
loadChildrenData();