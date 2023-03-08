// Log a message to the console when the script is loaded
console.log('Script loaded.');

// Define the `player` variable
let player;

// Function to initialize the YouTube video player
function onYouTubeIframeAPIReady() {
  // Create a new `YT.Player` object
  player = new YT.Player('player', {
    height: '500',
    width: '100%',
    videoId: '6NZQQyU48xI',
    playerVars: {
      'autoplay': 0,
      'controls': 1,
      'rel': 0,
      'showinfo': 0,
      'modestbranding': 1,
      'iv_load_policy': 3
    },
    events: {
      'onReady': onPlayerReady
    }
  });

  // Log a message to the console when the player is ready
  console.log('YouTube player is ready.');
}

// Function to handle the "onReady" event
function onPlayerReady(event) {
  // Do nothing for now
}

// Function to seek to a specific time in the video
function seekTo(time) {
  if (!player || typeof player.getPlayerState !== 'function' || typeof player.seekTo !== 'function' || typeof player.playVideo !== 'function') {
    return;
  }

  console.log('seekTo called with time = ' + time);

  if (player.getPlayerState() === 1) {
    // If the video is currently playing, seek to the new time
    player.seekTo(time);
  } else {
    // If the video is paused, seek to the new time and start playing
    player.seekTo(time);
    player.playVideo();
  }
}
