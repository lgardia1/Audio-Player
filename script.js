// Selección de elementos del DOM
const audio = document.querySelector('audio');
const songLength = document.getElementById('SongLength');
const currentTime = document.getElementById('CurrentSongTime');
const progress = document.querySelector('.progress');
const progressBar = document.querySelector('.progress-bar');

// Controles de audio
const playPause = document.getElementById('Play');
const backward = document.getElementById('Backward');
const forward = document.getElementById('Forward');

// Funciones
function padWithZero(num, length) {
    return String(num).padStart(length, '0');
}

function calculateTime(segs) {
    const minutes = Math.floor(segs / 60);
    const seconds = Math.floor(segs % 60);
    return padWithZero(minutes, 2) + ':' + padWithZero(seconds, 2);
}

function loadMetaDataAudio() {
    songLength.innerHTML = calculateTime(audio.duration);
    currentTime.innerHTML = calculateTime(audio.currentTime);
}

function setProgress() {
    const percentage = (audio.currentTime / audio.duration) * 100;
    progress.style.width = percentage + '%';
}

function playController() {
    if (audio.paused) {
        playPause.classList.remove('fa-play');
        playPause.classList.add('fa-pause');
        audio.play();
    } else {
        playPause.classList.remove('fa-pause');
        playPause.classList.add('fa-play');
        audio.pause();
    }
}

function updateProgress(event) {
    const rect = progressBar.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, offsetX / progressBar.clientWidth)); // Asegurarse de que esté entre 0 y 1
    audio.currentTime = percentage * audio.duration;
}

function loadProgress(event) {
    document.removeEventListener('mousemove', updateProgress);
    document.removeEventListener('mouseup', loadProgress);
    playPause.classList.remove('fa-play');
    playPause.classList.add('fa-pause');
    audio.play();
    updateProgress(event);
}

// Eventos de audio
if (audio.readyState > 0) {
    loadMetaDataAudio();
} else {
    audio.addEventListener('loadedmetadata', listenerMetaData);
}

function listenerMetaData() {
    loadMetaDataAudio();
    audio.removeEventListener('loadedmetadata', listenerMetaAudio);
}

// Actualizar el tiempo actual en la UI
audio.ontimeupdate = function () {
    currentTime.innerHTML = calculateTime(audio.currentTime);
    setProgress();
    if (audio.currentTime >= audio.duration) {
        audio.currentTime = 0;
    }
};

// Eventos de control de audio
playPause.addEventListener('click', playController);
backward.addEventListener('click', () => {
    audio.currentTime -= 10;
});
forward.addEventListener('click', () => {
    audio.currentTime += 10;
});

// Eventos de la barra de progreso
progressBar.addEventListener('mousedown', (event) => {
    if (event.button === 0) {
        isDragging = true;
        playPause.classList.remove('fa-pause');
        playPause.classList.add('fa-play');
        audio.pause();
        document.addEventListener('mousemove', updateProgress);
        document.addEventListener('mouseup', loadProgress);
    }
});



