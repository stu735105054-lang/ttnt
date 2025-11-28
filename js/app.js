// Main application module
const AppModule = {
    init() {
        // Apply saved theme first
        UIModule.applySavedTheme();
        
        // Initialize all modules
        AuthModule.init();
        
        // Check authentication status before initializing other modules
        if (AuthModule.isAuthenticated()) {
            FileSystemModule.init();
            UIModule.init();
            
            // Initialize statistics page if we're on that page
            if (window.location.pathname.includes('statistics.html')) {
                StatisticsModule.init();
            }
            
            // Update UI elements that depend on auth state
            this.updateAuthDependentUI();
        } else {
            // If not authenticated and not on login page, redirect to login
            if (!window.location.pathname.includes('login.html')) {
                window.location.href = 'login.html';
            }
        }
        
        // Initialize shared functionality
        this.initSharedFeatures();
    },
    
    updateAuthDependentUI() {
        // Update logout button visibility
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn && AuthModule.isAuthenticated()) {
            logoutBtn.style.display = 'inline-block';
        }
        
        // Update user info display
        UIModule.updateUserInfo();
    },
    
    initSharedFeatures() {
        // Initialize search functionality if search elements exist
        this.initSearch();
        
        // Initialize theme toggle
        this.initThemeToggle();
    },
    
    initSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            // Search functionality is handled by UIModule
        }
    },
    
    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const isDark = localStorage.getItem('theme') === 'dark';
            themeToggle.checked = isDark;
        }
    }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    AppModule.init();
});

// Handle page-specific initialization
if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) {
    // Authentication pages are handled by AuthModule
} else if (window.location.pathname.includes('statistics.html')) {
    // Statistics page is handled by StatisticsModule
} else if (window.location.pathname.includes('index.html')) {
    // Main file manager page is handled by UIModule
}