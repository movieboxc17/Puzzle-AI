// DOM elements
const cameraBtn = document.getElementById('cameraBtn');
const uploadInput = document.getElementById('uploadInput');
const cameraPreview = document.getElementById('cameraPreview');
const imagePreview = document.getElementById('imagePreview');
const analyzeBtn = document.getElementById('analyzeBtn');
const processingStatus = document.getElementById('processingStatus');
const resultCanvas = document.getElementById('resultCanvas');
const resultsDetails = document.getElementById('resultsDetails');

// Global variables
let capturedImage = null;
let stream = null;

// Event listeners
cameraBtn.addEventListener('click', toggleCamera);
uploadInput.addEventListener('change', handleImageUpload);
analyzeBtn.addEventListener('click', analyzePuzzle);

// Functions for camera handling
function toggleCamera() {
    if (cameraPreview.style.display === 'none') {
        startCamera();
    } else {
        stopCamera();
    }
}

async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraPreview.srcObject = stream;
        cameraPreview.style.display = 'block';
        cameraBtn.textContent = 'Capture';
        cameraBtn.removeEventListener('click', toggleCamera);
        cameraBtn.addEventListener('click', captureImage);
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Could not access the camera. Please check permissions or try uploading an image instead.');
    }
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        cameraPreview.style.display = 'none';
        cameraBtn.textContent = 'Take Picture';
        cameraBtn.removeEventListener('click', captureImage);
        cameraBtn.addEventListener('click', toggleCamera);
    }
}

function captureImage() {
    const canvas = document.createElement('canvas');
    canvas.width = cameraPreview.videoWidth;
    canvas.height = cameraPreview.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(cameraPreview, 0, 0, canvas.width, canvas.height);
    
    imagePreview.src = canvas.toDataURL('image/png');
    imagePreview.style.display = 'block';
    capturedImage = imagePreview.src;
    
    stopCamera();
    analyzeBtn.disabled = false;
}

// Function for file upload handling
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            capturedImage = e.target.result;
            analyzeBtn.disabled = false;
        }
        reader.readAsDataURL(file);
    }
}

// Puzzle analysis function - this is where AI processing would happen
function analyzePuzzle() {
    if (!capturedImage) {
        alert('Please capture or upload an image first.');
        return;
    }

    // Show processing status
    processingStatus.style.display = 'block';
    analyzeBtn.disabled = true;

    // Simulating processing delay
    setTimeout(() => {
        processingStatus.style.display = 'none';
        displayResults();
    }, 2000);

    // In a real implementation, this is where you would:
    // 1. Send the image to a backend service or process it with a local AI model
    // 2. Process the image to detect puzzle pieces and their correct positions
    // 3. Return results for visualization
}

// Function to display results
function displayResults() {
    // Show the result canvas
    resultCanvas.style.display = 'block';
    
    // Draw the original image
    const ctx = resultCanvas.getContext('2d');
    const img = new Image();
    img.onload = function() {
        resultCanvas.width = img.width;
        resultCanvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Overlay with simulated puzzle solution markers
        // In a real implementation, these would be based on AI analysis results
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        
        // Draw some sample markers (these would come from AI in reality)
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * img.width;
            const y = Math.random() * img.height;
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, 2 * Math.PI);
            ctx.stroke();
        }
    };
    img.src = capturedImage;
    
    // Display explanatory text
    resultsDetails.innerHTML = `
        <h3>Puzzle Analysis Complete</h3>
        <p>The highlighted areas show where puzzle pieces should be placed.</p>
        <p><strong>Note:</strong> This is a demonstration. A real implementation would require:</p>
        <ul>
            <li>Integration with an AI/ML library like TensorFlow.js</li>
            <li>A trained model specific to puzzle solving</li>
            <li>More processing power than typical browsers provide for complex puzzles</li>
        </ul>
    `;
}
