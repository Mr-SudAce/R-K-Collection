function loadAboutData() {
    fetch("json/about.json")
        .then(response => response.json())
        .then(data => {
            // Hero Section
            const heroTitle = document.querySelector("#about-section .hero-content h1");
            const heroSubtitle = document.querySelector("#about-section .hero-content .hero-subtitle");
            
            if (heroTitle) heroTitle.textContent = data.hero.title;
            if (heroSubtitle) heroSubtitle.textContent = data.hero.subtitle;

            // Story Section
            const storyContent = document.querySelector(".story-content");
            if (storyContent) {
                let storyHTML = `<h2>${data.story.heading}</h2>`;
                data.story.paragraphs.forEach(para => {
                    storyHTML += `<p>${para}</p>`;
                });
                storyContent.innerHTML = storyHTML;
            }

            const storyStats = document.querySelector(".story-stats");
            if (storyStats) {
                storyStats.innerHTML = data.story.stats.map(stat => `
                    <div class="stat-card">
                        <h3>${stat.value}</h3>
                        <p>${stat.label}</p>
                    </div>
                `).join('');
            }

            // Mission & Vision
            const missionGrid = document.querySelector(".mission-grid");
            if (missionGrid) {
                missionGrid.innerHTML = data.mission_vision.map(item => `
                    <div class="mission-card">
                        <div class="card-icon">${item.icon}</div>
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                `).join('');
            }

            // Values
            const valuesSection = document.querySelector(".values-section .container");
            if (valuesSection) {
                const valuesTitle = valuesSection.querySelector(".section-title");
                if (valuesTitle) valuesTitle.textContent = data.values.heading;

                const valuesGrid = valuesSection.querySelector(".values-grid");
                if (valuesGrid) {
                    valuesGrid.innerHTML = data.values.items.map(item => `
                        <div class="value-card">
                            <div class="value-icon">${item.icon}</div>
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                        </div>
                    `).join('');
                }
            }

            // Team
            const teamSection = document.querySelector(".team-section .container");
            if (teamSection) {
                const teamTitle = teamSection.querySelector(".section-title");
                if (teamTitle) teamTitle.textContent = data.team.heading;
                
                const teamSubtitle = teamSection.querySelector(".section-subtitle");
                if (teamSubtitle) teamSubtitle.textContent = data.team.subtitle;

                const teamGrid = teamSection.querySelector(".team-grid");
                if (teamGrid) {
                    teamGrid.innerHTML = data.team.members.map(member => `
                        <div class="team-card">
                            <div class="team-icon">${member.icon}</div>
                            <h3>${member.title}</h3>
                            <p>${member.description}</p>
                        </div>
                    `).join('');
                }
            }
        })
        .catch(error => console.error("Error loading about data:", error));
}

// Execute immediately when loaded
loadAboutData();