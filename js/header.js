let allOtherDetail = [];

async function fetchOtherdetails() {
    try {
        const res = await fetch(Other_detail_api_URL);

        if (!res.ok) {
            throw new Error("Failed to fetch other details");
        }

        allOtherDetail = await res.json();
        updateSiteDetails();

    } catch (err) {
        console.error("Fetch error:", err);
    }
}

function updateSiteDetails() {

    if (!Array.isArray(allOtherDetail) || allOtherDetail.length === 0) return;

    // Title + favicon
    allOtherDetail.forEach(item => {
        if (item.site_name) {
            document.title = item.site_name;
        }

        const favicon = document.querySelector("link[rel='icon']");
        if (favicon && item.site_logo) {
            favicon.href = item.site_logo;
        }
    });

    // Header (use last item safely)
    const lastItem = allOtherDetail[allOtherDetail.length - 1];
    if (!lastItem) return;

    const headerLogo = document.querySelector(".logo-img");
    const header_title = document.querySelector(".brand-name");
    const header_tagline = document.querySelector(".brand-tagline");

    if (headerLogo) {
        headerLogo.src = lastItem.site_logo || "";
        headerLogo.alt = lastItem.site_name || "";
    }

    if (header_title) {
        header_title.innerText = lastItem.site_name || "";
    }

    if (header_tagline) {
        header_tagline.innerText = lastItem.site_tag || "";
    }
}

// Call only ONCE
fetchOtherdetails();
