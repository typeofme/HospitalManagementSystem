// Error page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Back button handler
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            history.back();
        });
    }
});
