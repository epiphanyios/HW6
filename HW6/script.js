window.addEventListener('DOMContentLoaded', () => {
    const dropzone = document.getElementById('dropzone');
    const filelist = document.getElementById('filelist');
  
    // Handle file drop event
    dropzone.addEventListener('drop', handleDrop, false);
  
    // Prevent default behavior when dragging files over the dropzone
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
  
    // Handle file drop
    function handleDrop(e) {
      e.preventDefault();
      e.stopPropagation();
  
      const files = e.dataTransfer.files;
      handleFiles(files);
    }
  
    // Handle selected files
    function handleFiles(files) {
      [...files].forEach((file) => {
        uploadFile(file)
          .then((response) => {
            displayUploadedFile(response);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    }
  
    // Simulate file upload using a Promise
    function uploadFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
  
        reader.onload = () => {
          setTimeout(() => {
            resolve({ filename: file.name, size: file.size });
          }, 2000); // Simulating delay with setTimeout
        };
  
        reader.onerror = () => {
          reject(new Error('Error reading file.'));
        };
  
        reader.readAsDataURL(file);
      });
    }
  
    // Display uploaded file information
    function displayUploadedFile(file) {
      const listItem = document.createElement('li');
      listItem.textContent = `${file.filename} (${formatFileSize(file.size)})`;
      filelist.appendChild(listItem);
    }
  
    // Format file size in a human-readable format
    function formatFileSize(size) {
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      let index = 0;
  
      while (size >= 1024 && index < units.length - 1) {
        size /= 1024;
        index++;
      }
  
      return `${size.toFixed(1)} ${units[index]}`;
    }
  });
  