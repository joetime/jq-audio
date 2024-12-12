// Select DOM elements
const startButton = document.getElementById('start');
const lowSlider = document.getElementById('low');
const midSlider = document.getElementById('mid');
const highSlider = document.getElementById('high');

// Initialize Audio Context
let audioContext;
let microphone;
let lowEQ, midEQ, highEQ;
let gainNode;

// Function to initialize audio processing
async function initAudio() {
  try {
    // Create AudioContext
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Get microphone stream
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    microphone = audioContext.createMediaStreamSource(stream);

    // Create EQ filters
    lowEQ = audioContext.createBiquadFilter();
    lowEQ.type = 'lowshelf';
    lowEQ.frequency.value = 320; // Low frequency cutoff

    midEQ = audioContext.createBiquadFilter();
    midEQ.type = 'peaking';
    midEQ.frequency.value = 1000; // Mid frequency center
    midEQ.Q.value = 1;

    highEQ = audioContext.createBiquadFilter();
    highEQ.type = 'highshelf';
    highEQ.frequency.value = 3200; // High frequency cutoff

    // Create GainNode for overall volume control if needed
    gainNode = audioContext.createGain();
    gainNode.gain.value = 1;

    // Connect the nodes: Microphone -> LowEQ -> MidEQ -> HighEQ -> Gain -> Destination
    microphone
      .connect(lowEQ)
      .connect(midEQ)
      .connect(highEQ)
      .connect(gainNode)
      .connect(audioContext.destination);

    // Set initial EQ values
    updateEQ();

    // Add event listeners for sliders
    lowSlider.addEventListener('input', updateEQ);
    midSlider.addEventListener('input', updateEQ);
    highSlider.addEventListener('input', updateEQ);

    startButton.disabled = true;
    startButton.textContent = 'Audio Processing Started';
  } catch (err) {
    console.error('Error accessing microphone:', err);
    alert('Could not access the microphone. Please check permissions.');
  }
}

// Function to update EQ settings based on slider values
function updateEQ() {
  if (!lowEQ || !midEQ || !highEQ) return;

  const lowGain = parseFloat(lowSlider.value);
  const midGain = parseFloat(midSlider.value);
  const highGain = parseFloat(highSlider.value);

  lowEQ.gain.value = lowGain;
  midEQ.gain.value = midGain;
  highEQ.gain.value = highGain;
}

// Event listener for start button
startButton.addEventListener('click', initAudio);
