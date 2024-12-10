
// Get the canvas and its context for drawing
const canvas = document.getElementById('nameCanvas');
const ctx = canvas.getContext('2d');

// Control button and prize selection elements
const playScrollButton = document.getElementById('playScrollButton');
const winnerPrizeElement = document.getElementById("winner_prize");

// Canvas and scroll settings
const nameHeight = 40;
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;
let names = [];
let yPos = 0;
let scrollSpeed = 7;
let isScrolling = false;

// Constants for middle name range (for highlighting)
const LOWER_LIMIT = 80;
const UPPER_LIMIT = 120;

// Fetch names from the server
fetch('fetch_names.php')
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        names = data;
        animate(); // Start the animation once data is fetched
    })
    .catch(err => {
        console.error('Error fetching names:', err);
        alert("There was an issue loading the names. Please try again.");
    });

// Function to draw an arrow on the canvas at the left center
function drawArrow(yPos) {
    const arrowWidth = 30;
    const arrowHeight = 20;
    const arrowBase = 10;

    const arrowCenterY = canvasHeight / 2; // Vertical center
    const arrowX = 25; // X position of the arrow's base

    // Draw the left-facing arrow
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowCenterY); // Start at the base
    ctx.lineTo(arrowX - arrowWidth, arrowCenterY + arrowBase); // Left top corner
    ctx.lineTo(arrowX - arrowWidth, arrowCenterY - arrowBase); // Left bottom corner
    ctx.closePath();

    // Style and fill the arrow
    ctx.lineJoin = 'round';
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'white'; // Border color
    ctx.stroke();
    ctx.fillStyle = 'red'; // Arrow color
    ctx.fill();
}

// Function to draw names on the canvas
function drawNames() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Clear the canvas
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';

    // Only draw names within the visible canvas area
    const startIndex = Math.max(0, Math.floor(-yPos / nameHeight));
    const endIndex = Math.min(names.length, Math.ceil((canvasHeight - yPos) / nameHeight));

    // Draw each name
    for (let i = startIndex; i < endIndex; i++) {
        const name = names[i];
        const y = yPos + i * nameHeight;

        // Ensure the name is visible within the canvas
        if (y + nameHeight >= 0 && y <= canvasHeight) {
            const textY = y + (nameHeight / 2) + 10;
            const middleY = canvasHeight / 2;

            // Highlight the name in the center
            if (y + nameHeight / 2 >= middleY - nameHeight / 2 && y + nameHeight / 2 <= middleY + nameHeight / 2) {
                ctx.fillStyle = 'red';
                ctx.font = '24px Arial';
            } else {
                ctx.fillStyle = 'black';
                ctx.font = '20px Arial';
            }

            // Center the text horizontally
            const textWidth = ctx.measureText(name).width;
            const x = (canvasWidth - textWidth) / 2;

            // Draw the name and a background highlight if it's the center name
            ctx.fillText(name, x, textY);
            if (y + nameHeight / 2 >= middleY - nameHeight / 2 && y + nameHeight / 2 <= middleY + nameHeight / 2) {
                ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // Semi-transparent red background
                ctx.fillRect(0, y, canvasWidth, nameHeight); // Background box
            } else {
                ctx.fillStyle = 'rgba(255, 0, 0, 0)'; // Transparent background
                ctx.fillRect(0, y, canvasWidth, nameHeight);
            }

            ctx.strokeStyle = 'lightgray';
            ctx.lineWidth = 1;
            ctx.strokeRect(0, y, canvasWidth, nameHeight);
        }
    }

    // Draw the arrow when a name is centered
    drawArrow(yPos);

    // Scroll the names upward if the drawing is active
    if (isScrolling) {
        yPos -= scrollSpeed;
    }

    // Reset scroll position once all names are off the canvas
    if (yPos + names.length * nameHeight < 0) {
        yPos = canvasHeight;
    }
}

// Function to start the animation loop
function animate() {
    drawNames();
    requestAnimationFrame(animate);
}

// Debounced function to get the middle name and log the draw
let debounceTimeout;
function getMiddleName() {
    clearTimeout(debounceTimeout); // Clear any pending requests

    debounceTimeout = setTimeout(() => {
        for (let i = 0; i < names.length; i++) {
            const y = yPos + i * nameHeight;
            const nameMiddle = y + nameHeight / 2;
            if (nameMiddle >= LOWER_LIMIT && nameMiddle <= UPPER_LIMIT) {
                document.getElementById("winner_name").value = `${names[i]}`;
                
                break;
            }
        }
    }, 500); // Debounce for 500ms before sending AJAX request
}

// Event listener for drawing button
playScrollButton.addEventListener('click', () => {
    const varPrizeCheck = winnerPrizeElement.value;
    if (varPrizeCheck) {
        playScrollButton.disabled = true;
        playScrollButton.innerHTML = 'Drawing...';

        isScrolling = !isScrolling; // Toggle scrolling state

        // If not scrolling, finalize the winner selection
        if (!isScrolling) {
            getMiddleName();
        } else {
            handleScrollSpeedChange(); // Adjust scroll speed progressively
        }
    }
});

// Function to change scroll speed progressively
async function handleScrollSpeedChange() {
    const speeds = [7, 6, 5, 4, 3, 2];
    for (let i = 0; i < speeds.length; i++) {
        scrollSpeed = speeds[i];
        console.log(speeds[i]);  // Log the current speed

        await delay(3000);  // Wait before changing speed
    }

    // Once the final speed is reached, stop the scrolling and finalize the draw
    getMiddleName();
    isScrolling = false;
    playScrollButton.textContent = "Refresh to Draw Again"; // Update button text
}

// Helper function to create a delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// FPS calculation function to optimize animation performance
let lastTime = 0;
let frameCount = 0;
let fps = 0;

function calculateFPS(timestamp) {
    if (lastTime) {
        const delta = (timestamp - lastTime) / 1000;
        frameCount++;
        if (delta >= 1) {
            fps = frameCount / delta;
            document.getElementById('fps').textContent = `FPS: ${Math.round(fps)}`;
            frameCount = 0;
            lastTime = timestamp;
        }
    } else {
        lastTime = timestamp;
    }
    requestAnimationFrame(calculateFPS); // Continue FPS calculation
}

requestAnimationFrame(calculateFPS); // Start FPS calculation

