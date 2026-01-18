// document.addEventListener("DOMContentLoaded", loadContactData);

// async function loadContactData() {
//     try {
//         const response = await fetch("json/contact.json");
//         if (!response.ok) throw new Error("JSON not found");

//         const contactData = await response.json();
//         renderContactData(contactData);
//     } catch (err) {
//         console.error("Contact page error:", err);
//     }
// }
fetch("json/contact.json")
    .then(r => r.json())
    .then(data => {
        renderContactData(data)
    })
    .catch(err => {
        console.log("Error Loading:", err)
    })

function renderContactData(data) {

    console.log("contact data is displayed here:", data.hero_section.title)

    /* ---------- HERO ---------- */
    const heroBox = document.querySelector(".contact-heading");
    if (heroBox) {
        heroBox.innerHTML = `
            <h1>${data.hero_section.title}</h1>
            <p>${data.hero_section.subtitle}</p>
        `;
    }

    /* ---------- CONTACT TEXT ---------- */
    const heading = document.querySelector(".contact-info h2");
    const intro = document.querySelector(".contact-intro");

    if (heading) heading.textContent = data.contact_section.main_heading;
    if (intro) intro.textContent = data.contact_section.intro_text;

    /* ---------- CONTACT CARDS ---------- */
    const container = document.querySelector(".info-card-section");
    if (!container) return;

    container.innerHTML = "";

    data.contact_section.contact_info.forEach(info => {
        let html = "";

        if (info.type === "address") {
            html = `
                <div class="info-card">
                    <span>${info.icon}</span>
                    <div>
                        <h4>${info.title}</h4>
                        <p>${info.details}<br>${info.details_line2}</p>
                    </div>
                </div>
            `;
        }

        if (info.type === "phone" || info.type === "email") {
            html = `
                <div class="info-card">
                    <span>${info.icon}</span>
                    <div>
                        <h4>${info.title}</h4>
                        <a href="${info.link}">${info.value}</a>
                    </div>
                </div>
            `;
        }

        if (info.type === "hours") {
            html = `
                <div class="info-card">
                    <span>${info.icon}</span>
                    <div>
                        <h4>${info.title}</h4>
                        <p>${info.hours.join("<br>")}</p>
                    </div>
                </div>
            `;
        }

        container.insertAdjacentHTML("beforeend", html);
    });

    /* ---------- SOCIAL ---------- */
    const socialTitle = document.querySelector(".social-links h3");
    const socialBox = document.querySelector(".social-icons");

    if (socialTitle) socialTitle.textContent = data.social_section.heading;
    if (!socialBox) return;

    socialBox.innerHTML = "";

    data.social_section.social_links.forEach(link => {
        socialBox.insertAdjacentHTML(
            "beforeend",
            `<a href="${link.url}" class="social-link">${link.name}</a>`
        );
    });
}
