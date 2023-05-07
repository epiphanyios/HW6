// Access the user's camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(function(stream) {
    const video = document.getElementById('video');
    video.srcObject = stream;
    video.onloadedmetadata = function(e) {
      video.play();
    };
  })
  .catch(function(err) {
    console.error(err);
  });

// Initialize the FaceDetector
const faceDetector = new FaceDetector();

// Process the video frames and detect faces
function detectFaces() {
  const video = document.getElementById('video');
  const overlay = document.getElementById('overlay');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // Set canvas dimensions
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw video frame on canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Detect faces
  faceDetector.detect(canvas)
    .then(function(faces) {
      // Clear previous detections
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Apply blur filter to the canvas
      const blurAmount = 20; // Adjust the blur amount as desired
      context.filter = `blur(${blurAmount}px)`;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Reset the filter
      context.filter = 'none';

      // Draw rectangle around each face
      faces.forEach(function(face) {
        const { x, y, width, height } = face.boundingBox;
        context.strokeStyle = 'red';
        context.lineWidth = 2;
        context.strokeRect(x, y, width, height);
      });

      // Set the resulting image as the background
      overlay.style.backgroundImage = `url(${canvas.toDataURL()})`;

      // Schedule next detection
      requestAnimationFrame(detectFaces);
    })
    .catch(function(err) {
      console.error(err);
    });
}

// Start face detection
detectFaces();
