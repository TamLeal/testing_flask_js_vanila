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

      // Atualize o URL do backend para o endereço correto
      fetch('https://backend-flask-js-vanila-p7jimpqk1-tams-projects-28fbceea.vercel.app/api/upload_image', {
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
