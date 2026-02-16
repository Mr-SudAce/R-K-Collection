async function fetchKidsCollection() {
    try {
        const res = await fetch(kidcollection_api_URL);
        if (!res.ok) throw new Error("Network error");

        const allKidCollection = await res.json();

        const sections = document.querySelector(".children-page-content");
        const heroSection = sections.querySelector(".hero_container_div");
        const kid_sections = sections.querySelector(".kids-section");
        const featuresGrid = kid_sections.querySelector(".features-grid");

        allKidCollection.forEach(kidItem => {

            // HERO
            const heroTitle = heroSection.querySelector(".hero-content h1");
            const heroSubtitle = heroSection.querySelector(".hero-content p");

            if (heroTitle) heroTitle.textContent = kidItem.hero_title;
            if (heroSubtitle) heroSubtitle.textContent = kidItem.hero_subtitle || "..";

            // INTRO
            const introTitle = kid_sections.querySelector(".section-intro h2");
            const introText = kid_sections.querySelector(".section-intro p");

            if (introTitle) introTitle.textContent = kidItem.intro_heading;
            if (introText) introText.textContent = kidItem.intro_text;

            // FEATURES
            if (featuresGrid) {
                featuresGrid.innerHTML = ""; // clear once

                kidItem.features.forEach(feature => {
                    featuresGrid.insertAdjacentHTML("beforeend", `
                        <div class="feature-card">
                            <div class="feature-icon">
                                <img src="${feature.icon}" width="100" alt="${feature.title}">
                            </div>
                            <h3>${feature.title}</h3>
                            <p>${feature.description}</p>
                        </div>
                    `);
                });
            }

            // SHOWCASE
            const showcaseTitle = sections.querySelector(".kids-showcase h2");
            if (showcaseTitle) showcaseTitle.textContent = kidItem.showcase_heading;

            const kidsGrid = sections.querySelector(".kids-grid");
            if (kidsGrid) {
                kidsGrid.innerHTML = `
                    <div class="kids-item"><img src="${kidItem.showcase_image1}" alt="Showcase 1"></div>
                    <div class="kids-item"><img src="${kidItem.showcase_image2}" alt="Showcase 2"></div>
                    <div class="kids-item"><img src="${kidItem.showcase_image3}" alt="Showcase 3"></div>
                    <div class="kids-item"><img src="${kidItem.showcase_image4}" alt="Showcase 4"></div>
                `;
            }

        });

    } catch (err) {
        console.error("Fetch error:", err);
    }
}

fetchKidsCollection();
