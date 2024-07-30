document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
  
    const imageInput = document.getElementById('imageInput');
    const preview = document.getElementById('preview');
    const dimensions = document.getElementById('dimensions');
    const imageUrl = document.getElementById('imageUrl'); // Novo elemento para URL
  
    imageInput.addEventListener('change', handleImageUpload);
  
    function handleImageUpload(event) {
        console.log('File input changed');
        const file = event.target.files[0];
        if (file) {
            console.log('File selected:', file.name);
  
            const reader = new FileReader();
            reader.onload = function (e) {
                console.log('File read successfully');
                preview.src = e.target.result;
                console.log('Preview updated');
            };
            reader.readAsDataURL(file);
  
            uploadImage(file);
        } else {
            console.log('No file selected');
        }
    }
  
    function uploadImage(file) {
        const formData = new FormData();
        formData.append('image', file);
        console.log('FormData created with file');
  
        console.log('Sending request to backend...');
        fetch('https://backend-flask-js-vanila.vercel.app/api/upload_image', {
            method: 'POST',
            body: formData,
        })
        .then((response) => {
            console.log('Response received:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log('Data received:', data);
            if (data.width && data.height) {
                dimensions.textContent = `Width: ${data.width}px, Height: ${data.height}px`;
                console.log('Dimensions updated');
            }
            if (data.url) {
                imageUrl.textContent = `Image URL: ${data.url}`;
                imageUrl.href = data.url;
                console.log('Image URL updated');
            }
        })
        .catch((error) => {
            console.error('Fetch error:', error);
            dimensions.textContent = 'Error processing image';
        });
    }
  
    // Check backend health
    console.log('Checking backend health...');
    fetch('https://backend-flask-js-vanila.vercel.app/api/health')
        .then(response => response.json())
        .then(data => console.log('Backend health check:', data))
        .catch(error => console.error('Backend health check failed:', error));
  });
  