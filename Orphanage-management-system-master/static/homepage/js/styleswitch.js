// styleswitch.js
console.log("styleswitch.js loaded successfully!");

// Theme toggle logic
const toggleButton = document.getElementById('theme-toggle');
if (toggleButton) {
    toggleButton.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        // Save the preference in localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
}

// Check localStorage for saved theme preference
window.onload = function () {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
};
