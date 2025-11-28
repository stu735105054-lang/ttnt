// // main.js - Main JavaScript file for Cloud Storage System

// // Initialize the application
// document.addEventListener('DOMContentLoaded', function() {
//     initializeApp();
// });

// function initializeApp() {
//     // Check if user is logged in
//     const currentUser = localStorage.getItem('currentUser');
//     if (!currentUser) {
//         // Redirect to login if not logged in
//         if (!window.location.href.includes('login.html') && !window.location.href.includes('singUp.html')) {
//             window.location.href = 'html/login.html';
//         }
//     } else {
//         // Update UI with current user
//         updateUserUI();
//     }
    
//     // Initialize event listeners
//     initializeEventListeners();
    
//     // Initialize specific page functionality
//     initializePageSpecificFunctionality();
// }

// function initializeEventListeners() {
//     // Login functionality
//     const loginForm = document.querySelector('.container .btn'); // Login button
//     if (loginForm && window.location.href.includes('login.html')) {
//         loginForm.addEventListener('click', handleLogin);
//     }
    
//     // Signup functionality
//     const signupForm = document.querySelector('.form_R .btn_Account'); // Signup button
//     if (signupForm && window.location.href.includes('singUp.html')) {
//         signupForm.addEventListener('click', handleSignup);
//     }
    
//     // Logout functionality
//     const logoutBtn = document.querySelector('.user-section .user-name');
//     if (logoutBtn) {
//         logoutBtn.addEventListener('click', handleLogout);
//     }
    
//     // Initialize dropdowns
//     initializeDropdowns();
    
//     // Initialize search functionality
//     initializeSearch();
// }

// function initializeDropdowns() {
//     document.querySelectorAll('.dropdown-label').forEach(label => {
//         label.addEventListener('click', () => {
//             const parent = label.parentElement;
//             parent.classList.toggle('open');
//         });
//     });
// }

// function initializeSearch() {
//     const mainSearch = document.getElementById('mainSearch');
//     if (mainSearch) {
//         mainSearch.addEventListener('input', function(e) {
//             const query = e.target.value.toLowerCase();
//             const files = document.querySelectorAll('#allFiles .file-item');
//             files.forEach(file => {
//                 const name = file.textContent.toLowerCase();
//                 file.style.display = name.includes(query) ? 'flex' : 'none';
//             });
//         });
//     }
// }

// function handleLogin(event) {
//     event.preventDefault();
    
//     const inputs = document.querySelectorAll('.form-group input');
//     const username = inputs[0].value.trim();
//     const password = inputs[1].value.trim();
    
//     if (!username || !password) {
//         alert('Please enter both username and password');
//         return;
//     }
    
//     // Get users from localStorage
//     const users = JSON.parse(localStorage.getItem('users')) || [];
//     const user = users.find(u => u.username === username && u.password === password);
    
//     if (user) {
//         localStorage.setItem('currentUser', JSON.stringify(user));
//         updateUserUI();
//         window.location.href = 'html/trangchinh.html';
//     } else {
//         alert('Invalid username or password');
//     }
// }

// function handleSignup(event) {
//     event.preventDefault();
    
//     const inputs = document.querySelectorAll('.form_R input');
//     const firstName = inputs[0].value.trim();
//     const lastName = inputs[1].value.trim();
//     const email = inputs[2].value.trim();
//     const password = inputs[3].value.trim();
//     const confirmPassword = inputs[4].value.trim();
    
//     if (!firstName || !lastName || !email || !password || !confirmPassword) {
//         alert('Please fill in all fields');
//         return;
//     }
    
//     if (password !== confirmPassword) {
//         alert('Passwords do not match');
//         return;
//     }
    
//     // Get existing users
//     const users = JSON.parse(localStorage.getItem('users')) || [];
    
//     // Check if user already exists
//     const existingUser = users.find(u => u.email === email || u.username === email);
//     if (existingUser) {
//         alert('User already exists');
//         return;
//     }
    
//     // Create new user
//     const newUser = {
//         id: Date.now(),
//         username: email, // Using email as username
//         email: email,
//         password: password,
//         firstName: firstName,
//         lastName: lastName,
//         role: 'user', // Default role
//         createdAt: new Date().toISOString()
//     };
    
//     users.push(newUser);
//     localStorage.setItem('users', JSON.stringify(users));
    
//     // Set current user
//     localStorage.setItem('currentUser', JSON.stringify(newUser));
//     updateUserUI();
//     window.location.href = 'html/trangchinh.html';
// }

// function handleLogout() {
//     localStorage.removeItem('currentUser');
//     window.location.href = 'html/login.html';
// }

// function updateUserUI() {
//     const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
//     if (currentUser) {
//         // Update user name in UI
//         const userNameElements = document.querySelectorAll('.user-name');
//         userNameElements.forEach(element => {
//             element.textContent = currentUser.firstName || currentUser.username;
//         });
//     }
// }

// function initializePageSpecificFunctionality() {
//     const currentPath = window.location.pathname;
    
//     if (currentPath.includes('trangchinh.html') || currentPath.includes('Workspace.html')) {
//         initializeFileManager();
//     }
    
//     if (currentPath.includes('Workspace.html')) {
//         initializeWorkspaceFunctionality();
//     }
// }

// // File Management System
// function initializeFileManager() {
//     // Initialize file structure in localStorage if not exists
//     if (!localStorage.getItem('fileStructure')) {
//         const defaultStructure = {
//             folders: [
//                 { id: 1, name: 'Documents', parentId: null, type: 'folder', createdAt: new Date().toISOString() },
//                 { id: 2, name: 'Photos', parentId: null, type: 'folder', createdAt: new Date().toISOString() },
//                 { id: 3, name: 'Videos', parentId: null, type: 'folder', createdAt: new Date().toISOString() }
//             ],
//             files: [],
//             history: [] // Track user actions
//         };
//         localStorage.setItem('fileStructure', JSON.stringify(defaultStructure));
//     }
    
//     // Render file structure
//     renderFileStructure();
    
//     // Add event listeners for file operations
//     addFileOperationListeners();
// }

// function renderFileStructure() {
//     const fileStructure = JSON.parse(localStorage.getItem('fileStructure'));
//     const container = document.getElementById('allFiles');
    
//     if (container) {
//         container.innerHTML = '';
        
//         // Render folders
//         fileStructure.folders.forEach(folder => {
//             if (folder.parentId === null) { // Only show root level folders
//                 const folderElement = document.createElement('div');
//                 folderElement.className = 'file-item';
//                 folderElement.dataset.type = 'folder';
//                 folderElement.dataset.id = folder.id;
//                 folderElement.innerHTML = `<i class="fas fa-folder"></i> ${folder.name}`;
                
//                 // Add click event to open folder
//                 folderElement.addEventListener('click', () => openFolder(folder.id));
                
//                 container.appendChild(folderElement);
//             }
//         });
        
//         // Render files
//         fileStructure.files.forEach(file => {
//             if (file.parentId === null) { // Only show root level files
//                 const fileElement = document.createElement('div');
//                 fileElement.className = 'file-item';
//                 fileElement.dataset.type = getFileTypeIcon(file.name);
//                 fileElement.dataset.id = file.id;
//                 fileElement.innerHTML = `<i class="far ${getFileTypeIcon(file.name)}"></i> ${file.name}`;
                
//                 container.appendChild(fileElement);
//             }
//         });
//     }
// }

// function getFileTypeIcon(filename) {
//     const ext = filename.split('.').pop().toLowerCase();
//     switch(ext) {
//         case 'pdf': return 'fa-file-pdf';
//         case 'doc':
//         case 'docx': return 'fa-file-word';
//         case 'xls':
//         case 'xlsx': return 'fa-file-excel';
//         case 'ppt':
//         case 'pptx': return 'fa-file-powerpoint';
//         case 'txt': return 'fa-file-text';
//         case 'jpg':
//         case 'jpeg':
//         case 'png':
//         case 'gif': return 'fa-file-image';
//         case 'mp3':
//         case 'wav': return 'fa-file-audio';
//         case 'mp4':
//         case 'avi': return 'fa-file-video';
//         case 'zip':
//         case 'rar': return 'fa-file-archive';
//         default: return 'fa-file';
//     }
// }

// function openFolder(folderId) {
//     const fileStructure = JSON.parse(localStorage.getItem('fileStructure'));
//     const folder = fileStructure.folders.find(f => f.id === folderId);
    
//     if (folder) {
//         // This would navigate to the folder view
//         // For now, we'll just show an alert
//         alert(`Opening folder: ${folder.name}`);
        
//         // In a real implementation, you would show the contents of the folder
//         // and update the UI to show the folder's contents
//     }
// }

// function addFileOperationListeners() {
//     // Add context menu functionality (right-click)
//     document.addEventListener('contextmenu', function(e) {
//         // Check if we're clicking on a file item
//         const fileItem = e.target.closest('.file-item');
//         if (fileItem) {
//             e.preventDefault();
            
//             // Create context menu
//             createContextMenu(e.clientX, e.clientY, fileItem);
//         }
//     });
    
//     // Add drag and drop functionality
//     initializeDragAndDrop();
// }

// function createContextMenu(x, y, fileItem) {
//     // Remove any existing context menu
//     const existingMenu = document.querySelector('.context-menu');
//     if (existingMenu) {
//         existingMenu.remove();
//     }
    
//     const contextMenu = document.createElement('div');
//     contextMenu.className = 'context-menu';
//     contextMenu.style.position = 'absolute';
//     contextMenu.style.left = `${x}px`;
//     contextMenu.style.top = `${y}px`;
//     contextMenu.style.backgroundColor = 'white';
//     contextMenu.style.border = '1px solid #ccc';
//     contextMenu.style.borderRadius = '4px';
//     contextMenu.style.padding = '8px 0';
//     contextMenu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
//     contextMenu.style.zIndex = '1000';
//     contextMenu.style.minWidth = '150px';
    
//     const options = ['Rename', 'Delete', 'Share'];
//     const icons = ['fa-edit', 'fa-trash', 'fa-share'];
    
//     options.forEach((option, index) => {
//         const menuItem = document.createElement('div');
//         menuItem.className = 'context-menu-item';
//         menuItem.style.padding = '8px 16px';
//         menuItem.style.cursor = 'pointer';
//         menuItem.style.display = 'flex';
//         menuItem.style.align-items = 'center';
//         menuItem.style.gap = '8px';
        
//         menuItem.innerHTML = `<i class="fas ${icons[index]}"></i> ${option}`;
        
//         menuItem.addEventListener('click', () => {
//             handleContextMenuItemClick(option, fileItem);
//             contextMenu.remove();
//         });
        
//         menuItem.addEventListener('mouseover', () => {
//             menuItem.style.backgroundColor = '#f0f0f0';
//         });
        
//         menuItem.addEventListener('mouseout', () => {
//             menuItem.style.backgroundColor = 'transparent';
//         });
        
//         contextMenu.appendChild(menuItem);
//     });
    
//     document.body.appendChild(contextMenu);
    
//     // Close context menu when clicking elsewhere
//     document.addEventListener('click', function closeMenu(e) {
//         if (!contextMenu.contains(e.target)) {
//             contextMenu.remove();
//             document.removeEventListener('click', closeMenu);
//         }
//     });
// }

// function handleContextMenuItemClick(option, fileItem) {
//     switch(option) {
//         case 'Rename':
//             renameItem(fileItem);
//             break;
//         case 'Delete':
//             deleteItem(fileItem);
//             break;
//         case 'Share':
//             shareItem(fileItem);
//             break;
//     }
// }

// function renameItem(fileItem) {
//     const newName = prompt('Enter new name:', fileItem.textContent.trim());
//     if (newName) {
//         const fileStructure = JSON.parse(localStorage.getItem('fileStructure'));
//         const itemId = parseInt(fileItem.dataset.id);
//         const isFolder = fileItem.dataset.type === 'folder';
        
//         if (isFolder) {
//             const folder = fileStructure.folders.find(f => f.id === itemId);
//             if (folder) {
//                 // Add to history
//                 fileStructure.history.push({
//                     action: 'rename',
//                     type: 'folder',
//                     name: folder.name,
//                     newName: newName,
//                     timestamp: new Date().toISOString()
//                 });
                
//                 folder.name = newName;
//                 fileItem.innerHTML = `<i class="fas fa-folder"></i> ${newName}`;
//             }
//         } else {
//             const file = fileStructure.files.find(f => f.id === itemId);
//             if (file) {
//                 // Add to history
//                 fileStructure.history.push({
//                     action: 'rename',
//                     type: 'file',
//                     name: file.name,
//                     newName: newName,
//                     timestamp: new Date().toISOString()
//                 });
                
//                 file.name = newName;
//                 fileItem.innerHTML = `<i class="far ${getFileTypeIcon(newName)}"></i> ${newName}`;
//             }
//         }
        
//         localStorage.setItem('fileStructure', JSON.stringify(fileStructure));
//     }
// }

// function deleteItem(fileItem) {
//     if (confirm('Are you sure you want to delete this item?')) {
//         const fileStructure = JSON.parse(localStorage.getItem('fileStructure'));
//         const itemId = parseInt(fileItem.dataset.id);
//         const isFolder = fileItem.dataset.type === 'folder';
//         const itemName = fileItem.textContent.trim();
        
//         if (isFolder) {
//             // Remove folder and its contents
//             fileStructure.folders = fileStructure.folders.filter(f => {
//                 // Also remove child folders and files
//                 if (f.id === itemId) {
//                     return false;
//                 }
//                 // For now, just remove the specific folder
//                 // In a complete implementation, we'd remove all nested items
//                 return true;
//             });
            
//             // Add to history
//             fileStructure.history.push({
//                 action: 'delete',
//                 type: 'folder',
//                 name: itemName,
//                 timestamp: new Date().toISOString()
//             });
//         } else {
//             fileStructure.files = fileStructure.files.filter(f => f.id !== itemId);
            
//             // Add to history
//             fileStructure.history.push({
//                 action: 'delete',
//                 type: 'file',
//                 name: itemName,
//                 timestamp: new Date().toISOString()
//             });
//         }
        
//         fileItem.remove();
//         localStorage.setItem('fileStructure', JSON.stringify(fileStructure));
//     }
// }

// function shareItem(fileItem) {
//     const fileStructure = JSON.parse(localStorage.getItem('fileStructure'));
//     const itemId = parseInt(fileItem.dataset.id);
//     const itemName = fileItem.textContent.trim();
    
//     // Generate a share link
//     const shareLink = `https://cloudstorage.example.com/share/${itemId}`;
    
//     // Create share options
//     const permission = prompt(`Share link for "${itemName}":\n${shareLink}\n\nEnter permission (view/edit):`, 'view');
    
//     if (permission) {
//         // Add to history
//         fileStructure.history.push({
//             action: 'share',
//             type: fileItem.dataset.type,
//             name: itemName,
//             permission: permission,
//             link: shareLink,
//             timestamp: new Date().toISOString()
//         });
        
//         localStorage.setItem('fileStructure', JSON.stringify(fileStructure));
        
//         // Copy link to clipboard
//         navigator.clipboard.writeText(shareLink).then(() => {
//             alert(`Share link copied to clipboard!\nLink: ${shareLink}\nPermission: ${permission}`);
//         }).catch(err => {
//             console.error('Failed to copy link: ', err);
//             alert(`Share link: ${shareLink}\nPermission: ${permission}`);
//         });
//     }
// }

// function initializeDragAndDrop() {
//     // This is a basic implementation - a full implementation would be more complex
//     const fileItems = document.querySelectorAll('.file-item');
    
//     fileItems.forEach(item => {
//         item.draggable = true;
        
//         item.addEventListener('dragstart', function(e) {
//             e.dataTransfer.setData('text/plain', item.dataset.id);
//             item.classList.add('dragging');
//         });
        
//         item.addEventListener('dragend', function() {
//             item.classList.remove('dragging');
//         });
//     });
    
//     // Add drop zones (folders) if they exist
//     const folderItems = document.querySelectorAll('.file-item[data-type="folder"]');
    
//     folderItems.forEach(folder => {
//         folder.addEventListener('dragover', function(e) {
//             e.preventDefault();
//             folder.classList.add('drop-target');
//         });
        
//         folder.addEventListener('dragleave', function() {
//             folder.classList.remove('drop-target');
//         });
        
//         folder.addEventListener('drop', function(e) {
//             e.preventDefault();
//             folder.classList.remove('drop-target');
            
//             const draggedItemId = e.dataTransfer.getData('text/plain');
//             moveItemToFolder(draggedItemId, folder.dataset.id);
//         });
//     });
// }

// function moveItemToFolder(itemId, folderId) {
//     const fileStructure = JSON.parse(localStorage.getItem('fileStructure'));
//     const item = [...fileStructure.folders, ...fileStructure.files].find(i => i.id == itemId);
    
//     if (item) {
//         item.parentId = parseInt(folderId);
        
//         // Add to history
//         fileStructure.history.push({
//             action: 'move',
//             type: item.type,
//             name: item.name,
//             from: 'root',
//             to: folderId,
//             timestamp: new Date().toISOString()
//         });
        
//         localStorage.setItem('fileStructure', JSON.stringify(fileStructure));
//         renderFileStructure(); // Refresh the view
//     }
// }

// function initializeWorkspaceFunctionality() {
//     // Add functionality specific to the workspace page
//     const uploadBtn = document.querySelector('.upload-btn');
//     if (uploadBtn) {
//         uploadBtn.addEventListener('click', function() {
//             alert('Upload functionality would be implemented here');
//         });
//     }
// }

// // Statistics functions
// function getStatistics() {
//     const fileStructure = JSON.parse(localStorage.getItem('fileStructure'));
    
//     const stats = {
//         totalFolders: fileStructure.folders.length,
//         totalFiles: fileStructure.files.length,
//         totalItems: fileStructure.folders.length + fileStructure.files.length,
//         history: fileStructure.history
//     };
    
//     return stats;
// }

// // Dark/Light mode toggle
// function toggleDarkMode() {
//     const body = document.body;
//     body.classList.toggle('dark-mode');
    
//     // Save preference to localStorage
//     const isDarkMode = body.classList.contains('dark-mode');
//     localStorage.setItem('darkMode', isDarkMode);
// }

// // Check for saved theme preference
// function initializeTheme() {
//     const isDarkMode = localStorage.getItem('darkMode') === 'true';
//     if (isDarkMode) {
//         document.body.classList.add('dark-mode');
//     }
// }

// // Add dark mode styles to the document
// function addDarkModeStyles() {
//     const style = document.createElement('style');
//     style.id = 'dark-mode-styles';
//     style.textContent = `
//         .dark-mode {
//             background-color: #1a1a1a;
//             color: #ffffff;
//         }
        
//         .dark-mode .Tong {
//             background-color: #1e1e1e;
//             color: #ffffff;
//         }
        
//         .dark-mode .container {
//             color: #ffffff;
//         }
        
//         .dark-mode .file-card {
//             background: #2d2d2d;
//             color: #ffffff;
//         }
        
//         .dark-mode .folder_con .file-item {
//             background: #2d2d2d;
//             color: #ffffff;
//         }
        
//         .dark-mode .folder_con .file-item:hover {
//             background: #3a3a3a;
//         }
        
//         .dark-mode .search-bar input {
//             background: #2d2d2d;
//             color: #ffffff;
//             border-color: #444;
//         }
        
//         .dark-mode .workspace-card {
//             background: #2d2d2d;
//             border-color: #444;
//             color: #ffffff;
//         }
        
//         .dark-mode .right-panel {
//             background: #2a2a2a;
//             border-color: #444;
//         }
        
//         .dark-mode .user-section {
//             background: #2d2d2d;
//         }
        
//         .dark-mode .quick-link {
//             background: #2d2d2d;
//             color: #cccccc;
//         }
        
//         .dark-mode .category-card {
//             background: #2d2d2d;
//             border-color: #444;
//         }
//     `;
//     document.head.appendChild(style);
// }

// // Initialize dark mode when the app loads
// document.addEventListener('DOMContentLoaded', function() {
//     addDarkModeStyles();
//     initializeTheme();
    
//     // Add dark mode toggle button if it doesn't exist
//     const existingToggle = document.querySelector('.dark-mode-toggle');
//     if (!existingToggle) {
//         // Create a dark mode toggle button dynamically
//         // This would typically be added to the UI in a real implementation
//     }
// });