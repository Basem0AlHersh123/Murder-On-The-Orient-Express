// 📁 src/theme.js
function setupTheme() {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle.querySelector("i");

  // Check if user has a theme preference saved
  const savedTheme = localStorage.getItem("theme") || "light";

  // Apply saved theme
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeIcon.className = "bi bi-sun"; // Change to sun icon
  }

  // Toggle theme when button clicked
  themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    // Change icon
    if (document.body.classList.contains("dark-mode")) {
      themeIcon.className = "bi bi-sun";
      localStorage.setItem("theme", "dark");
    } else {
      themeIcon.className = "bi bi-moon";
      localStorage.setItem("theme", "light");
    }
  });
}

// Call when page loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupTheme);
} else {
  setupTheme();
}
export { setupTheme };
