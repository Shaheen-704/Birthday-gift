// --- 1. Scroll Reveal Animation ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// --- 2. Smooth Scrolling ---
function scrollToSection(id) {
    const el = document.getElementById(id);
    const offset = 80;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = el.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// --- 3. Slideshow Logic ---
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) { showSlides(slideIndex += n); }
function currentSlide(n) { showSlides(slideIndex = n); }

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";  
    dots[slideIndex-1].className += " active";
}

// --- 4. Music Player Logic ---
const audio = document.getElementById('audio');
const playIcon = document.getElementById('play-icon');
const albumArt = document.getElementById('album-art-img');
let isPlaying = false;

function playPause() {
    if (isPlaying) {
        audio.pause();
        playIcon.textContent = "▶";
        albumArt.style.transform = "scale(1)";
    } else {
        audio.play();
        playIcon.textContent = "⏸";
        albumArt.style.transform = "scale(1.05)";
        albumArt.style.transition = "transform 0.5s";
    }
    isPlaying = !isPlaying;
}

// --- 5. REAL PUZZLE LOGIC (Swap Style) ---
const board = document.getElementById('puzzle-board');
const imgPath = 'assets/puzzle.jpg'; 
let tiles = [];
let selectedTile = null; // Tracks the first clicked tile

function createPuzzle() {
    board.innerHTML = '';
    tiles = [];
    selectedTile = null;
    
    // We create an array of indices [0, 1, 2...8]
    let indices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    
    // Shuffle them so the pieces are scrambled
    indices.sort(() => Math.random() - 0.5);

    indices.forEach((index, position) => {
        let tile = document.createElement('div');
        tile.className = 'tile';
        tile.style.backgroundImage = `url('${imgPath}')`;
        
        // This math calculates which part of the image to show
        let x = (index % 3) * -100;
        let y = Math.floor(index / 3) * -100;
        
        tile.style.backgroundPosition = `${x}px ${y}px`;
        
        // Store the correct index to check for win later
        tile.dataset.correctIndex = index;
        tile.dataset.currentIndex = position;

        // Add Click Event for Swapping
        tile.onclick = () => selectTile(tile);
        
        board.appendChild(tile);
    });
}

function selectTile(tile) {
    if (selectedTile === null) {
        // First click: Select this tile
        selectedTile = tile;
        tile.style.border = "2px solid #fff";
        tile.style.transform = "scale(0.95)";
        tile.style.opacity = "0.7";
    } else {
        // Second click: Swap with the first tile
        if (tile === selectedTile) {
            // If clicked same tile again, deselect
            deselect();
            return;
        }

        // SWAP background positions
        let tempBg = selectedTile.style.backgroundPosition;
        selectedTile.style.backgroundPosition = tile.style.backgroundPosition;
        tile.style.backgroundPosition = tempBg;

        // SWAP the data-correct-index (to track winning)
        let tempIndex = selectedTile.dataset.correctIndex;
        selectedTile.dataset.correctIndex = tile.dataset.correctIndex;
        tile.dataset.correctIndex = tempIndex;

        // Reset styling
        deselect();
        
        // Optional: Check if solved (advanced)
        // checkWin(); 
    }
}

function deselect() {
    if(selectedTile) {
        selectedTile.style.border = "none";
        selectedTile.style.transform = "scale(1)";
        selectedTile.style.opacity = "1";
        selectedTile = null;
    }
}

function shufflePuzzle() {
    board.style.transition = "transform 0.5s";
    board.style.transform = "rotate(360deg)";
    setTimeout(() => {
        board.style.transform = "rotate(0deg)";
        createPuzzle();
    }, 500);
}

// Initialize
window.onload = () => {
    createPuzzle();
};