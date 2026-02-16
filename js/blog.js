let allBlog = [];
let blogsToShow = 6;

async function loadBlogData() {
    try {
        const res = await fetch(Blog_api_URL);

        if (!res.ok) {
            throw new Error("Failed to fetch blog data");
        }

        const data = await res.json();
        // Handle potential pagination or direct array
        const rawData = Array.isArray(data) ? data : (data.results || []);
        
        // Filter active blogs
        allBlog = rawData.filter(item => item.is_active);

        renderBlogs();
        attachModalEvents();

    } catch (err) {
        console.log("Error loading blog data:", err);
    }
}

function renderBlogs() {
    const blogGrid = document.querySelector("#blog-section .blog-grid");
    if (!blogGrid) return;

    blogGrid.innerHTML = ""; // clear before adding

    const visibleBlogs = allBlog.slice(0, blogsToShow);

    visibleBlogs.forEach(item => {
        const content = item.content || "";
        const excerpt = content.length > 100 ? content.substring(0, 100) + "..." : content;
        
        blogGrid.innerHTML += `
            <div class="blog-card">
                <img src="${item.image}" alt="${item.title}">
                <div class="blog-content">
                    <span class="blog-date">
                        ${new Date(item.created_at).toDateString()}
                    </span>
                    <h3>${item.title}</h3>
                    <p>${excerpt}</p>
                    <button class="read-more-btn btn"
                        data-title="${item.title}"
                        data-image="${item.image}"
                        data-date="${item.created_at}"
                        data-content="${item.content}">
                        Read More →
                    </button>
                </div>
            </div>
        `;
    });

    renderLoadMoreButton();
}

loadBlogData();


// ====== Render Load More Button ======
function renderLoadMoreButton() {
    let loadMoreContainer = document.querySelector(".load-more-container");

    if (!loadMoreContainer) {
        loadMoreContainer = document.createElement("div");
        loadMoreContainer.classList.add("load-more-container");
        document.querySelector("#blog-section .container").appendChild(loadMoreContainer);
    }

    loadMoreContainer.innerHTML = "";

    if (blogsToShow < allBlog.length) {
        const btn = document.createElement("button");
        btn.textContent = "Load More";
        btn.classList.add("load-more-btn");
        btn.addEventListener("click", () => {
            blogsToShow += 6;
            renderBlogs();
        });
        loadMoreContainer.appendChild(btn);
    }

    if (blogsToShow > 6) {
        const btn = document.createElement("button");
        btn.textContent = "Show Less";
        btn.classList.add("load-more-btn");
        btn.style.marginLeft = "10px";
        btn.addEventListener("click", () => {
            blogsToShow = 6;
            renderBlogs();
            document.querySelector("#blog-section").scrollIntoView({ behavior: "smooth" });
        });
        loadMoreContainer.appendChild(btn);
    }
}




function attachModalEvents() {
    const modal = document.getElementById("blogModal");
    const closeBtn = document.querySelector(".close-modal");

    const modalImage = document.getElementById("modalImage");
    const modalTitle = document.getElementById("modalTitle");
    const modalDate = document.getElementById("modalDate");
    const modalContent = document.getElementById("modalContent");

    // Use Event Delegation for dynamically added buttons
    const blogGrid = document.querySelector("#blog-section .blog-grid");
    if (blogGrid) {
        blogGrid.addEventListener("click", function (e) {
            if (e.target.classList.contains("read-more-btn")) {
                const btn = e.target;
                modalImage.src = btn.dataset.image;
                modalTitle.textContent = btn.dataset.title;
                modalDate.textContent = new Date(btn.dataset.date).toDateString();
                modalContent.textContent = btn.dataset.content;

                modal.style.display = "flex";
            }
        });
    }

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}
