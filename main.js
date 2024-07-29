document
  .getElementById('imageInput')
  .addEventListener('change', function (event) {
    console.log('File input changed');
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name);

      const reader = new FileReader();
      reader.onload = function (e) {
        console.log('File read successfully');
        // Display image preview
        document.getElementById('preview').src = e.target.result;
        console.log('Preview updated');
      };
      reader.readAsDataURL(file);

      // Send file to server
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
            document.getElementById('dimensions').textContent = `Width: ${data.width}px, Height: ${data.height}px`;
            console.log('Dimensions updated');
          } else {
            console.error('Unexpected data format:', data);
          }
        })
        .catch((error) => {
          console.error('Fetch error:', error);
          document.getElementById('dimensions').textContent = 'Error processing image';
        });
    } else {
      console.log('No file selected');
    }
  });

// Adicione este código para verificar a conectividade com o backend
console.log('Checking backend health...');
fetch('https://backend-flask-js-vanila.vercel.app/api/health')
  .then(response => response.json())
  .then(data => console.log('Backend health check:', data))
  .catch(error => console.error('Backend health check failed:', error));