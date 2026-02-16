// const date  = new Date();
// const year = date.getFullYear();

// const yearElement = document.querySelector("#yearElement");
// yearElement.innerHTML = `&copy; ${year} R & K Collection. All rights reserved.`;


document.addEventListener("DOMContentLoaded", () => {
    const yearElement = document.querySelector("#yearElement");

    if (!yearElement) return;

    const currentYear = new Date().getFullYear();

    yearElement.innerHTML = `&copy; ${currentYear} R & K Collection. All rights reserved.`;
});