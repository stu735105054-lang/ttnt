// File System module
const FileSystemModule = {
    fileStructure: [],
    
    init() {
        this.loadFileStructure();
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        // Add event listeners for file operations
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('folder-item') || e.target.parentElement.classList.contains('folder-item')) {
                const folderId = e.target.closest('.folder-item').dataset.id;
                this.openFolder(folderId);
            }
        });
    },
    
    loadFileStructure() {
        const savedStructure = localStorage.getItem('fileStructure');
        if (savedStructure) {
            this.fileStructure = JSON.parse(savedStructure);
        } else {
            // Initialize with default structure
            this.fileStructure = [
                {
                    id: 'root',
                    name: 'Root',
                    type: 'folder',
                    children: [],
                    parentId: null,
                    createdAt: new Date().toISOString(),
                    shared: false,
                    shareLink: null,
                    permissions: {}
                }
            ];
            this.saveFileStructure();
        }
    },
    
    saveFileStructure() {
        localStorage.setItem('fileStructure', JSON.stringify(this.fileStructure));
    },
    
    findItemById(id) {
        function findItem(items, targetId) {
            for (const item of items) {
                if (item.id === targetId) return item;
                if (item.children) {
                    const found = findItem(item.children, targetId);
                    if (found) return found;
                }
            }
            return null;
        }
        return findItem(this.fileStructure, id);
    },
    
    findParentFolder(itemId) {
        function findParent(items, targetId, parent = null) {
            for (const item of items) {
                if (item.id === targetId) return parent;
                if (item.children) {
                    const found = findParent(item.children, targetId, item);
                    if (found) return found;
                }
            }
            return null;
        }
        return findParent(this.fileStructure, itemId);
    },
    
    createItem(name, type, parentId = 'root', content = '') {
        const newItem = {
            id: `item_${Date.now()}`,
            name,
            type, // 'file' or 'folder'
            parentId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            content: type === 'file' ? content : '',
            shared: false,
            shareLink: null,
            permissions: {}
        };
        
        if (type === 'folder') {
            newItem.children = [];
        }
        
        if (parentId === 'root') {
            this.fileStructure.push(newItem);
        } else {
            const parent = this.findItemById(parentId);
            if (parent && parent.type === 'folder') {
                parent.children.push(newItem);
            }
        }
        
        this.saveFileStructure();
        this.logActivity('create', `${type}: ${name}`);
        return newItem;
    },
    
    deleteItem(id) {
        function removeItem(items, targetId) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === targetId) {
                    const item = items[i];
                    items.splice(i, 1);
                    return item;
                }
                if (items[i].children) {
                    const found = removeItem(items[i].children, targetId);
                    if (found) return found;
                }
            }
            return null;
        }
        
        const deletedItem = removeItem(this.fileStructure, id);
        if (deletedItem) {
            this.saveFileStructure();
            this.logActivity('delete', `${deletedItem.type}: ${deletedItem.name}`);
            return true;
        }
        return false;
    },
    
    renameItem(id, newName) {
        const item = this.findItemById(id);
        if (item) {
            const oldName = item.name;
            item.name = newName;
            item.updatedAt = new Date().toISOString();
            this.saveFileStructure();
            this.logActivity('rename', `${item.type}: ${oldName} -> ${newName}`);
            return true;
        }
        return false;
    },
    
    moveItem(itemId, newParentId) {
        const item = this.deleteItem(itemId);
        if (item) {
            // Temporarily store the item
            const itemToMove = { ...item, parentId: newParentId };
            this.createItem(itemToMove.name, itemToMove.type, newParentId, itemToMove.content);
            
            // Copy over children if it's a folder
            if (item.children) {
                // We need to restructure properly
                this.deleteItem(item.id);
                const newItem = this.createItem(item.name, item.type, newParentId, item.content);
                
                // Move all children to the new item
                const originalItem = this.findItemById(item.id);
                if (originalItem && originalItem.children) {
                    // Since we already deleted the original, we need to recreate the structure properly
                    this.deleteItem(newItem.id);
                    // Create new item with original children
                    const movedItem = {
                        id: newItem.id,
                        name: item.name,
                        type: item.type,
                        parentId: newParentId,
                        createdAt: item.createdAt,
                        updatedAt: new Date().toISOString(),
                        content: item.content,
                        shared: item.shared,
                        shareLink: item.shareLink,
                        permissions: item.permissions,
                        children: originalItem.children
                    };
                    
                    if (newParentId === 'root') {
                        this.fileStructure.push(movedItem);
                    } else {
                        const newParent = this.findItemById(newParentId);
                        if (newParent && newParent.type === 'folder') {
                            newParent.children.push(movedItem);
                        }
                    }
                }
                
                this.saveFileStructure();
                this.logActivity('move', `${item.type}: ${item.name} from ${item.parentId} to ${newParentId}`);
                return true;
            }
            return true;
        }
        return false;
    },
    
    openFolder(folderId) {
        // This would be implemented in the UI module
        console.log('Opening folder:', folderId);
    },
    
    logActivity(action, target) {
        let activities = JSON.parse(localStorage.getItem('activities')) || [];
        activities.push({
            id: Date.now(),
            action,
            target,
            timestamp: new Date().toISOString(),
            user: AuthModule.getCurrentUser()?.username || 'unknown'
        });
        
        // Keep only the last 100 activities
        if (activities.length > 100) {
            activities = activities.slice(-100);
        }
        
        localStorage.setItem('activities', JSON.stringify(activities));
    },
    
    getStatistics() {
        function countItems(items) {
            let files = 0;
            let folders = 0;
            
            for (const item of items) {
                if (item.type === 'file') {
                    files++;
                } else if (item.type === 'folder') {
                    folders++;
                    if (item.children) {
                        const childStats = countItems(item.children);
                        files += childStats.files;
                        folders += childStats.folders;
                    }
                }
            }
            
            return { files, folders };
        }
        
        const stats = countItems(this.fileStructure);
        return stats;
    }
};