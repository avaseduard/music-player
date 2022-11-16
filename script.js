const image = document.querySelector('img');
const track = document.getElementById('title');
const artist = document.getElementById('artist');
const audio = document.querySelector('audio');
const previous = document.getElementById('previous');
const play = document.getElementById('play');
const next = document.getElementById('next');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const totalDurationElement = document.querySelector('.total-duration');
const currentDurationElement = document.querySelector('.current-duration');
const tracks = [
  {
    fileName: 'armin-van-buuren',
    displayName: 'In and out of love',
    artist: 'Armin van Buuren',
  },
  {
    fileName: 'daft-punk',
    displayName: 'Get lucky',
    artist: 'Daft Punk',
  },
  {
    fileName: 'eric-prydz',
    displayName: 'Call on me',
    artist: 'Eric Prydz',
  },
  {
    fileName: 'kraftwerk',
    displayName: 'The model',
    artist: 'Kraftwerk',
  },
  {
    fileName: 'tiesto',
    displayName: 'Adagio for strings',
    artist: 'Tiesto',
  },
];

// Playing state
let isPlaying = false;

// Play function
const playTrack = function () {
  isPlaying = true;
  play.classList.replace('fa-play', 'fa-pause');
  play.setAttribute('title', 'Play');
  audio.play();
};

// Pause function
const pauseTrack = function () {
  isPlaying = false;
  play.classList.replace('fa-pause', 'fa-play');
  play.setAttribute('title', 'Pause');
  audio.pause();
};

// Play/ Pause event listener
play.addEventListener('click', () => (isPlaying ? pauseTrack() : playTrack()));

// Render DOM
const renderDom = function (song) {
  image.src = `img/${song.fileName}.jpeg`;
  track.textContent = song.displayName;
  artist.textContent = song.artist;
  audio.src = `music/${song.fileName}-${song.displayName
    .toLowerCase()
    .replaceAll(' ', '-')}.mp3`;
};

// Current track index
let trackIndex = 0;

// Previous track
const previousTrack = function () {
  trackIndex--;
  if (trackIndex < 0) {
    trackIndex = tracks.length - 1;
  }
  renderDom(tracks[trackIndex]);
  playTrack();
};

// Next track
const nextTrack = function () {
  trackIndex++;
  if (trackIndex > tracks.length - 1) {
    trackIndex = 0;
  }
  renderDom(tracks[trackIndex]);
  playTrack();
};

// Convert seconds to mm ss
const convertSeconds = function (timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  let seconds = Math.floor(timeInSeconds - minutes * 60);
  if (seconds < 10) seconds = `0${seconds}`;
  return `${minutes}:${seconds}`;
};

// Progress bar and durations
const updateProgress = function (e) {
  if (isPlaying) {
    // Getting our time elements from the event
    const { duration, currentTime } = e.srcElement;
    // Filling the bar progress
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    // Rendering the total duration
    if (duration) totalDurationElement.textContent = convertSeconds(duration); // avoiding NaN
    // Rendering the current duration
    currentDurationElement.textContent = convertSeconds(currentTime);
  }
};

// Set song progress by clicking the progress bar
const setProgress = function (e) {
  const barWidth = this.clientWidth;
  const offsetX = e.offsetX;
  audio.currentTime = (offsetX / barWidth) * audio.duration;
};

// Initialize
renderDom(tracks[trackIndex]);

// Previous/ next track event listener
previous.addEventListener('click', previousTrack);
next.addEventListener('click', nextTrack);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextTrack);
progressContainer.addEventListener('click', setProgress);
