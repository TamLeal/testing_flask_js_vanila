document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const preview = document.getElementById('preview');
    const dimensions = document.getElementById('dimensions');
    const imageTableBody = document.getElementById('imageTableBody');
    const uploadStatus = document.getElementById('uploadStatus');

    imageInput.addEventListener('change', handleImageUpload);

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
            };
            reader.readAsDataURL(file);

            uploadImage(file);
        }
    }

    function uploadImage(file) {
        const formData = new FormData();
        formData.append('image', file);
    
        const uploadStatus = document.getElementById('uploadStatus');
        uploadStatus.textContent = 'Uploading...';
        uploadStatus.className = 'upload-status';
        uploadStatus.style.display = 'block';
    
        fetch('https://backend-flask-js-vanila.vercel.app/api/upload_image', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            uploadStatus.textContent = 'Upload successful!';
            uploadStatus.className = 'upload-status success';
            addImageToTable(data);
        })
        .catch(error => {
            console.error('Upload error:', error);
            uploadStatus.textContent = 'Error uploading image: ' + error.message;
            uploadStatus.className = 'upload-status error';
        });
    }

    function addImageToTable(imageData) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="${imageData.url}" target="_blank"><img src="${imageData.url}" alt="${imageData.filename}"></a></td>
            <td>${imageData.filename}</td>
            <td>${imageData.width || 'N/A'}px x ${imageData.height || 'N/A'}px</td>
            <td><button onclick="removeImage('${imageData.filename}')">Remove</button></td>
        `;
        imageTableBody.appendChild(row);
    }

    window.removeImage = function(filename) {
        fetch('https://backend-flask-js-vanila.vercel.app/api/remove_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filename: filename }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const rows = imageTableBody.getElementsByTagName('tr');
                for (let row of rows) {
                    if (row.querySelector('button').getAttribute('onclick').includes(filename)) {
                        imageTableBody.removeChild(row);
                        break;
                    }
                }
            } else {
                console.error('Failed to remove image:', data.error);
            }
        })
        .catch(error => {
            console.error('Error removing image:', error);
        });
    }

    loadExistingImages();

    function loadExistingImages() {
        fetch('https://backend-flask-js-vanila.vercel.app/api/get_images')
        .then(response => response.json())
        .then(images => {
            imageTableBody.innerHTML = ''; // Clear existing rows
            images.forEach(addImageToTable);
        })
        .catch(error => {
            console.error('Error loading images:', error);
        });
    }
});