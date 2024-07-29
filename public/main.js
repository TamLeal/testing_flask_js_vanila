document
  .getElementById('imageInput')
  .addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        // Display image preview
        document.getElementById('preview').src = e.target.result;
      };
      reader.readAsDataURL(file);

      // Send file to server
      const formData = new FormData();
      formData.append('image', file);

      fetch('https://backend-flask-image.vercel.app/api/upload_image', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          document.getElementById(
            'dimensions'
          ).textContent = `Width: ${data.width}px, Height: ${data.height}px`;
        })
        .catch((error) => console.error('Error:', error));
    }
  });
