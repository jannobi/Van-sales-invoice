// Desktop Renderer - Frontend Integration
const { ipcRenderer } = require('electron');

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  console.log('Desktop App Loaded');
  
  // Check if running in Electron
  if (window.electronAPI) {
    console.log('Electron API available');
    
    // Listen for monthly reset
    window.electronAPI.onMonthlyReset((event, data) => {
      console.log('Monthly Reset:', data);
      // Show notification
      showNotification('Monthly sales have been reset');
    });
  }
});

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4F46E5;
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 9999;
    animation: slideIn 0.5s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.5s ease';
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

// Add styles for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);
