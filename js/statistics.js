// Statistics module
const StatisticsModule = {
    init() {
        this.renderStatistics();
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        // Refresh button if available
        const refreshBtn = document.getElementById('refreshStatsBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.renderStatistics());
        }
    },
    
    renderStatistics() {
        this.renderFileCounts();
        this.renderActivityHistory();
        this.renderStorageUsage();
    },
    
    renderFileCounts() {
        const stats = FileSystemModule.getStatistics();
        const container = document.getElementById('fileCountsContainer');
        
        if (container) {
            container.innerHTML = `
                <div class="stats-card">
                    <h3>File & Folder Counts</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-number">${stats.files}</div>
                            <div class="stat-label">Total Files</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${stats.folders}</div>
                            <div class="stat-label">Total Folders</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${stats.files + stats.folders}</div>
                            <div class="stat-label">Total Items</div>
                        </div>
                    </div>
                </div>
            `;
        }
    },
    
    renderActivityHistory() {
        const activities = JSON.parse(localStorage.getItem('activities')) || [];
        const container = document.getElementById('activityHistoryContainer');
        
        if (container) {
            // Sort activities by timestamp (newest first)
            const sortedActivities = activities.sort((a, b) => b.timestamp - a.timestamp);
            
            let html = '<div class="stats-card"><h3>Recent Activity</h3><div class="activity-list">';
            
            if (sortedActivities.length > 0) {
                // Show only the last 20 activities
                const recentActivities = sortedActivities.slice(0, 20);
                
                recentActivities.forEach(activity => {
                    const date = new Date(activity.timestamp).toLocaleString();
                    html += `
                        <div class="activity-item">
                            <div class="activity-action">${this.getActionIcon(activity.action)} ${activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}</div>
                            <div class="activity-target">${activity.target}</div>
                            <div class="activity-user">${activity.user}</div>
                            <div class="activity-time">${date}</div>
                        </div>
                    `;
                });
            } else {
                html += '<p class="no-activities">No activity yet</p>';
            }
            
            html += '</div></div>';
            container.innerHTML = html;
        }
    },
    
    getActionIcon(action) {
        const iconMap = {
            'create': '➕',
            'delete': '🗑️',
            'rename': '✏️',
            'move': '➡️',
            'share': '🔗'
        };
        return iconMap[action] || 'ℹ️';
    },
    
    renderStorageUsage() {
        // Calculate approximate storage usage based on localStorage
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length;
            }
        }
        
        // Convert to KB
        const sizeInKB = (totalSize / 1024).toFixed(2);
        
        const container = document.getElementById('storageUsageContainer');
        if (container) {
            container.innerHTML = `
                <div class="stats-card">
                    <h3>Storage Usage</h3>
                    <div class="storage-info">
                        <div class="storage-bar">
                            <div class="storage-fill" style="width: ${Math.min(100, sizeInKB)}%"></div>
                        </div>
                        <div class="storage-text">${sizeInKB} KB used</div>
                    </div>
                    <p class="storage-note">Note: Actual localStorage limit is typically 5-10MB per domain</p>
                </div>
            `;
        }
    },
    
    renderUserStats() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const currentUser = AuthModule.getCurrentUser();
        
        const container = document.getElementById('userStatsContainer');
        if (container && currentUser && currentUser.role === 'admin') {
            container.innerHTML = `
                <div class="stats-card">
                    <h3>User Management</h3>
                    <div class="user-list">
                        <h4>Total Users: ${users.length}</h4>
                        <ul>
                            ${users.map(user => `
                                <li class="user-item">
                                    <span class="username">${user.username}</span>
                                    <span class="user-role">(${user.role})</span>
                                    <span class="user-date">${new Date(user.createdAt).toLocaleDateString()}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }
    }
};