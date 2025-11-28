// UI module
const UIModule = {
    currentPath: [],
    currentFolderId: 'root',
    
    init() {
        this.renderFileStructure();
        this.setupEventListeners();
        this.updateUserInfo();
        this.updateStatistics();
    },
    
    setupEventListeners() {
        // Create new file/folder buttons
        const createFileBtn = document.getElementById('createFileBtn');
        const createFolderBtn = document.getElementById('createFolderBtn');
        
        if (createFileBtn) {
            createFileBtn.addEventListener('click', () => this.showCreateModal('file'));
        }
        
        if (createFolderBtn) {
            createFolderBtn.addEventListener('click', () => this.showCreateModal('folder'));
        }
        
        // Context menu
        document.addEventListener('contextmenu', (e) => this.handleContextMenu(e));
        document.addEventListener('click', () => {
            const contextMenu = document.getElementById('contextMenu');
            if (contextMenu) contextMenu.style.display = 'none';
        });
        
        // Drag and drop
        this.setupDragAndDrop();
        
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
        
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('change', (e) => this.toggleTheme(e.target.checked));
        }
    },
    
    renderFileStructure(folderId = 'root') {
        const container = document.getElementById('fileContainer');
        if (!container) return;
        
        const folder = FileSystemModule.findItemById(folderId);
        if (!folder) return;
        
        // Update path display
        this.updatePath(folderId);
        
        // Render items
        let html = '<div class="folder-contents">';
        
        if (folder.children && folder.children.length > 0) {
            folder.children.forEach(item => {
                html += this.renderItem(item);
            });
        } else {
            html += '<p class="no-items">Folder is empty</p>';
        }
        
        html += '</div>';
        container.innerHTML = html;
    },
    
    renderItem(item) {
        const icon = item.type === 'folder' ? '📁' : this.getFileIcon(item.name);
        const sharedIndicator = item.shared ? ' <span class="shared-indicator" title="Shared">🔗</span>' : '';
        
        return `
            <div class="item ${item.type}-item" 
                 data-id="${item.id}" 
                 draggable="true"
                 ondragstart="UIModule.handleDragStart(event, '${item.id}')"
                 ondragover="UIModule.handleDragOver(event)"
                 ondrop="UIModule.handleDrop(event, '${item.id}')">
                <span class="item-icon">${icon}</span>
                <span class="item-name">${item.name}</span>
                ${sharedIndicator}
                <div class="item-actions">
                    <button class="action-btn rename-btn" onclick="UIModule.showRenameModal('${item.id}', '${item.name}', '${item.type}')">✏️</button>
                    <button class="action-btn delete-btn" onclick="UIModule.showDeleteConfirm('${item.id}', '${item.name}', '${item.type}')">🗑️</button>
                    ${item.type === 'file' ? `<button class="action-btn share-btn" onclick="UIModule.showShareModal('${item.id}', '${item.name}')">🔗</button>` : ''}
                </div>
            </div>
        `;
    },
    
    getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const iconMap = {
            'txt': '📄',
            'doc': '📝',
            'docx': '📝',
            'pdf': '📋',
            'jpg': '🖼️',
            'jpeg': '🖼️',
            'png': '🖼️',
            'gif': '🖼️',
            'mp4': '🎬',
            'avi': '🎬',
            'mov': '🎬',
            'mp3': '🎵',
            'wav': '🎵',
            'xlsx': '📊',
            'xls': '📊',
            'html': '🌐',
            'css': '🎨',
            'js': '/javascript.png', // This would need to be an actual image
            'json': '📋'
        };
        
        // For simplicity, return a default file icon if extension not found
        return iconMap[ext] || '📄';
    },
    
    updatePath(folderId) {
        const pathElement = document.getElementById('currentPath');
        if (!pathElement) return;
        
        // For simplicity, just show the current folder name
        const folder = FileSystemModule.findItemById(folderId);
        if (folder) {
            pathElement.textContent = `Current folder: ${folder.name}`;
        }
    },
    
    showCreateModal(type) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'createModal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Create New ${type === 'file' ? 'File' : 'Folder'}</h3>
                <input type="text" id="itemNameInput" placeholder="Enter ${type} name" />
                ${type === 'file' ? '<textarea id="fileContentInput" placeholder="Enter file content (optional)"></textarea>' : ''}
                <div class="modal-actions">
                    <button onclick="UIModule.createItemFromModal('${type}')" class="btn-primary">Create</button>
                    <button onclick="UIModule.closeModal('createModal')" class="btn-secondary">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },
    
    createItemFromModal(type) {
        const name = document.getElementById('itemNameInput').value.trim();
        if (!name) {
            alert('Please enter a name');
            return;
        }
        
        const content = type === 'file' ? document.getElementById('fileContentInput')?.value || '' : '';
        
        FileSystemModule.createItem(name, type, this.currentFolderId, content);
        this.renderFileStructure(this.currentFolderId);
        this.closeModal('createModal');
        this.updateStatistics();
    },
    
    showRenameModal(id, currentName, type) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'renameModal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Rename ${type}</h3>
                <input type="text" id="renameInput" value="${currentName}" />
                <div class="modal-actions">
                    <button onclick="UIModule.renameItemFromModal('${id}')" class="btn-primary">Rename</button>
                    <button onclick="UIModule.closeModal('renameModal')" class="btn-secondary">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },
    
    renameItemFromModal(id) {
        const newName = document.getElementById('renameInput').value.trim();
        if (!newName) {
            alert('Please enter a name');
            return;
        }
        
        if (FileSystemModule.renameItem(id, newName)) {
            this.renderFileStructure(this.currentFolderId);
            this.closeModal('renameModal');
        }
    },
    
    showDeleteConfirm(id, name, type) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'deleteModal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Delete ${type}</h3>
                <p>Are you sure you want to delete "${name}"?</p>
                <p>This action cannot be undone.</p>
                <div class="modal-actions">
                    <button onclick="UIModule.deleteItemFromModal('${id}')" class="btn-danger">Delete</button>
                    <button onclick="UIModule.closeModal('deleteModal')" class="btn-secondary">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },
    
    deleteItemFromModal(id) {
        if (FileSystemModule.deleteItem(id)) {
            this.renderFileStructure(this.currentFolderId);
            this.closeModal('deleteModal');
            this.updateStatistics();
        }
    },
    
    showShareModal(id, name) {
        const item = FileSystemModule.findItemById(id);
        let html = `
            <div class="modal-content">
                <h3>Share: ${name}</h3>
        `;
        
        if (item.shared && item.shareLink) {
            html += `
                <p>Share link: <a href="${item.shareLink}" target="_blank">${item.shareLink}</a></p>
                <p>Permission: ${item.permissions.default || 'view'}</p>
                <button onclick="UIModule.revokeShare('${id}')" class="btn-danger">Revoke Share</button>
            `;
        } else {
            html += `
                <label>Permission:</label>
                <select id="permissionSelect">
                    <option value="view">View Only</option>
                    <option value="edit">Edit</option>
                </select>
                <div class="modal-actions">
                    <button onclick="UIModule.createShareLink('${id}')" class="btn-primary">Create Share Link</button>
                </div>
            `;
        }
        
        html += `<button onclick="UIModule.closeModal('shareModal')" class="btn-secondary">Close</button>`;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'shareModal';
        modal.innerHTML = html;
        document.body.appendChild(modal);
    },
    
    createShareLink(id) {
        const permission = document.getElementById('permissionSelect').value;
        const item = FileSystemModule.findItemById(id);
        
        if (item) {
            const shareLink = `https://example.com/shared/${id}`;
            item.shared = true;
            item.shareLink = shareLink;
            item.permissions.default = permission;
            
            FileSystemModule.saveFileStructure();
            this.closeModal('shareModal');
            this.renderFileStructure(this.currentFolderId);
        }
    },
    
    revokeShare(id) {
        const item = FileSystemModule.findItemById(id);
        
        if (item) {
            item.shared = false;
            item.shareLink = null;
            item.permissions = {};
            
            FileSystemModule.saveFileStructure();
            this.closeModal('shareModal');
            this.renderFileStructure(this.currentFolderId);
        }
    },
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.remove();
        }
    },
    
    handleContextMenu(e) {
        e.preventDefault();
        
        // Check if right-clicked on an item
        const itemElement = e.target.closest('.item');
        if (!itemElement) return;
        
        const itemId = itemElement.dataset.id;
        const item = FileSystemModule.findItemById(itemId);
        if (!item) return;
        
        // Create context menu
        let contextMenu = document.getElementById('contextMenu');
        if (!contextMenu) {
            contextMenu = document.createElement('div');
            contextMenu.id = 'contextMenu';
            contextMenu.className = 'context-menu';
            document.body.appendChild(contextMenu);
        }
        
        contextMenu.innerHTML = `
            <div class="context-menu-item" onclick="UIModule.showRenameModal('${item.id}', '${item.name}', '${item.type}')">Rename</div>
            <div class="context-menu-item" onclick="UIModule.showDeleteConfirm('${item.id}', '${item.name}', '${item.type}')">Delete</div>
            ${item.type === 'file' ? `<div class="context-menu-item" onclick="UIModule.showShareModal('${item.id}', '${item.name}')">Share</div>` : ''}
            <div class="context-menu-item" onclick="UIModule.copyItemPath('${item.id}')">Copy Path</div>
        `;
        
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;
    },
    
    copyItemPath(itemId) {
        const item = FileSystemModule.findItemById(itemId);
        if (item) {
            // In a real implementation, we would copy the path to clipboard
            // For now, just show an alert
            alert(`Path copied: /${item.name}`);
        }
    },
    
    setupDragAndDrop() {
        // This is handled via inline event handlers in renderItem
    },
    
    handleDragStart(e, itemId) {
        e.dataTransfer.setData('text/plain', itemId);
    },
    
    handleDragOver(e) {
        e.preventDefault(); // Necessary to allow drop
    },
    
    handleDrop(e, targetId) {
        e.preventDefault();
        const itemId = e.dataTransfer.getData('text/plain');
        const targetItem = FileSystemModule.findItemById(targetId);
        
        // Only allow dropping files/folders into folders
        if (targetItem && targetItem.type === 'folder') {
            FileSystemModule.moveItem(itemId, targetId);
            this.renderFileStructure(this.currentFolderId);
        }
    },
    
    handleSearch(query) {
        if (!query) {
            this.renderFileStructure(this.currentFolderId);
            return;
        }
        
        // Simple search implementation - in a real app this would search the entire structure
        const container = document.getElementById('fileContainer');
        if (!container) return;
        
        const folder = FileSystemModule.findItemById(this.currentFolderId);
        if (!folder) return;
        
        let html = '<div class="folder-contents">';
        let hasResults = false;
        
        if (folder.children) {
            folder.children.forEach(item => {
                if (item.name.toLowerCase().includes(query.toLowerCase())) {
                    html += this.renderItem(item);
                    hasResults = true;
                }
            });
        }
        
        if (!hasResults) {
            html += '<p class="no-items">No items match your search</p>';
        }
        
        html += '</div>';
        container.innerHTML = html;
    },
    
    toggleTheme(isDark) {
        if (isDark) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    },
    
    applySavedTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const isDark = savedTheme === 'dark';
        
        document.body.classList.add(isDark ? 'dark-theme' : 'light-theme');
        
        // Update theme toggle if it exists
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.checked = isDark;
        }
    },
    
    updateUserInfo() {
        const user = AuthModule.getCurrentUser();
        const userElement = document.getElementById('userInfo');
        if (userElement && user) {
            userElement.textContent = `User: ${user.username} (${user.role})`;
        }
    },
    
    updateStatistics() {
        const stats = FileSystemModule.getStatistics();
        const statsElement = document.getElementById('fileStats');
        if (statsElement) {
            statsElement.innerHTML = `
                <p>Total files: ${stats.files}</p>
                <p>Total folders: ${stats.folders}</p>
            `;
        }
    }
};