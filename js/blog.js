function loadBlogData() {
    fetch("Dashboard/json/blog.json")
        .then(response => response.json())
        .then(data => {
            const section = document.getElementById("blog-section");
            if (!section) return;

            // Hero Section
            const heroTitle = section.querySelector(".hero-content h1");
            const heroSubtitle = section.querySelector(".hero-content .hero-subtitle");
            
            if (heroTitle) heroTitle.textContent = data.hero.title;
            if (heroSubtitle) heroSubtitle.textContent = data.hero.subtitle;

            // Blog Grid
            const blogGrid = section.querySelector(".blog-grid");
            if (blogGrid) {
                blogGrid.innerHTML = data.posts.map(post => `
                    <div class="blog-card">
                        <img src="${post.image}" alt="${post.title}">
                        <div class="blog-content">
                            <span class="blog-date">${post.date}</span>
                            <h3>${post.title}</h3>
                            <p>${post.excerpt}</p>
                            <a href="${post.link}" class="read-more">Read More →</a>
                        </div>
                    </div>
                `).join('');
            }
        })
        .catch(error => console.error("Error loading blog data:", error));
}

// Execute immediately when loaded
loadBlogData();