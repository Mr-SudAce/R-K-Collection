async function FetchContactDetail() {
    try {
        const response = await fetch(Other_detail_api_URL);

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        allContactDetail = data;

        const latestData = Array.isArray(data) ? data.slice(-1)[0] : data;
        const section = document.getElementById("contact-section");
        if (!section || !latestData) return;

        // ---------------- HERO ----------------
        const heroTitle = section.querySelector(".hero-title");
        const heroSubtitle = section.querySelector(".hero-subtitle");

        if (heroTitle) heroTitle.textContent = "Contact Us";
        if (heroSubtitle)
            heroSubtitle.textContent =
                "We'd love to hear from you. Get in touch with us!";

        // ---------------- CONTACT CARDS ----------------
        const infoGrid = section.querySelector(".info-card-section");
        if (infoGrid) {
            infoGrid.innerHTML = "";

            const cards = [
                {
                    icon: "fa-solid fa-envelope",
                    heading: "Email Us",
                    text: latestData.email,
                    link: latestData.email ? `mailto:${latestData.email}` : "#",
                },
                {
                    icon: "fa-solid fa-phone",
                    heading: "Call Us",
                    text: latestData.contact1
                        ? `${latestData.contact1}${latestData.contact2 ? " - " + latestData.contact2 : ""
                        }`
                        : "",
                    link: latestData.contact1 ? `tel:${latestData.contact1}` : "#",
                },
                {
                    icon: "fa-brands fa-whatsapp",
                    heading: "WhatsApp Us",
                    text: latestData.whatsapp || "",
                    link: latestData.whatsapp
                        ? `https://wa.me/${latestData.whatsapp}`
                        : "#",
                },
                {
                    icon: "fa-solid fa-location-dot",
                    heading: "Our Location",
                    text: latestData.location ? "View Location" : "",
                    link: latestData.location
                        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            latestData.location
                        )}`
                        : "#",
                },
            ];

            // Use fragment for better performance
            const fragment = document.createDocumentFragment();

            cards.forEach((card) => {
                if (!card.text) return;

                const cardDiv = document.createElement("div");
                cardDiv.classList.add("info-card");

                const icon = document.createElement("i");
                icon.className = card.icon;

                const contentDiv = document.createElement("div");

                const heading = document.createElement("h4");
                heading.textContent = card.heading;

                const textLink = document.createElement("a");
                textLink.href = card.link;
                textLink.target = "_blank";
                textLink.textContent = card.text;
                textLink.classList.add("contact-link");

                contentDiv.appendChild(heading);
                contentDiv.appendChild(textLink);

                cardDiv.appendChild(icon);
                cardDiv.appendChild(contentDiv);

                fragment.appendChild(cardDiv);
            });

            infoGrid.appendChild(fragment);
        }

        // ---------------- SOCIAL ICONS ----------------
        const iconsDiv = section.querySelector(".social-icons");
        if (iconsDiv) {
            iconsDiv.innerHTML = "";

            const socialPlatforms = [
                { key: "facebook", icon: "fa-brands fa-facebook" },
                { key: "instagram", icon: "fa-brands fa-instagram" },
                { key: "tiktok", icon: "fa-brands fa-tiktok" },
                // { key: "youtube", icon: "fa-brands fa-youtube" },
                // { key: "viber", icon: "fa-brands fa-viber" },
            ];

            const fragment = document.createDocumentFragment();

            socialPlatforms.forEach((platform) => {
                const link = latestData[platform.key];
                if (!link) return;

                const a = document.createElement("a");
                a.href = link;
                a.target = "_blank";
                a.classList.add("social-link");

                const icon = document.createElement("i");
                icon.className = platform.icon;

                a.appendChild(icon);
                fragment.appendChild(a);
            });

            iconsDiv.appendChild(fragment);
        }
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

FetchContactDetail();
