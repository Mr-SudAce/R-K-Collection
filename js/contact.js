function loadContactData() {
    fetch("json/contact.json")
        .then(response => response.json())
        .then(data => {
            const section = document.getElementById("contact-section");
            if (!section) return;

            // Hero
            const heroTitle = section.querySelector(".contact-heading");
            if (heroTitle) {
                heroTitle.innerHTML = `<h1>${data.hero.title}</h1><p>${data.hero.subtitle}</p>`;
            }

            // Intro
            const contactInfo = section.querySelector(".contact-info");
            if (contactInfo) {
                const h2 = contactInfo.querySelector("h2");
                const p = contactInfo.querySelector(".contact-intro");
                if (h2) h2.textContent = data.intro.heading;
                if (p) p.textContent = data.intro.text;
            }

            // Info Cards
            const infoGrid = section.querySelector(".info-card-section");
            if (infoGrid) {
                infoGrid.innerHTML = data.info_cards.map(card => `
                    <a href="${card.link}">
                        <div class="info-card">
                            <span>${card.icon}</span>
                                <div>
                                    <h4>${card.title}</h4>
                                    ${card.content}
                                </div>
                        </div>
                    </a>
                    `).join('');
            }

            // Social Links
            const socialSection = section.querySelector(".social-links");
            if (socialSection) {
                const h3 = socialSection.querySelector("h3");
                const iconsDiv = socialSection.querySelector(".social-icons");
                if (h3) h3.textContent = data.social.heading;
                if (iconsDiv) {
                    iconsDiv.innerHTML = data.social.links.map(link => `<a href="${link.url}" class="social-link" style="font-size: 2rem; text-decoration: none;">${link.icon}</a>`).join('');
                }
            }
        })
        .catch(error => console.error("Error loading contact data:", error));
}

loadContactData();