// Log a message to the console when the script is loaded
console.log('Script loaded.');

// Define the `player` variable
let player;

// Define the `currentItemId` variable
let currentItemId = null;

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
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });

  // Log a message to the console when the player is ready
  console.log('YouTube player is ready.');
}

// Function to handle the "onReady" event
function onPlayerReady(event) {
  // Do nothing for now
}

// Function to handle the "onStateChange" event
function onPlayerStateChange(event) {
  const items = document.querySelectorAll('#player-list li');
  let currentItemFound = false;

  switch (event.data) {
    case YT.PlayerState.PLAYING:
      // Continuously update the list items while the video is playing
      const intervalId = setInterval(() => {
        const currentTime = player.getCurrentTime();
        let newCurrentItemFound = false;

        for (let i = 0; i < items.length; i++) {
          const button = items[i].querySelector('button');
          const timestamp = parseInt(button.getAttribute('data-time'));
          const passed = currentTime >= timestamp;

          items[i].setAttribute('data-timestamp-passed', passed ? 'true' : 'false');

          if (passed && !newCurrentItemFound) {
            items[i].classList.remove('hidden');
            currentItemId = items[i].id;
            newCurrentItemFound = true;
          } else {
            items[i].classList.add('hidden');
          }
        }

        if (newCurrentItemFound) {
          currentItemFound = true;
        }

        if (!currentItemFound) {
          // If no current item was found, show the first item
          items[0].classList.remove('hidden');
          currentItemId = items[0].id;
          currentItemFound = true;
        }
      }, 500);

      // Stop the interval when the video is paused or ended
      player.addEventListener('onStateChange', (event) => {
        if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
          clearInterval(intervalId);
        }
      });

      break;

    case YT.PlayerState.PAUSED:
      // Show the last item passed when the video is paused
      for (let i = items.length - 1; i >= 0; i--) {
        const passed = items[i].getAttribute('data-timestamp-passed') === 'true';
        if (passed) {
          items[i].classList.remove('hidden');
          currentItemId = items[i].id;
          break;
        }
      }
      break;

    case YT.PlayerState.ENDED:
      // Show the last item passed when the video has ended
      for (let i = items.length - 1; i >= 0; i--) {
        const passed = items[i].getAttribute('data-timestamp-passed') === 'true';
        if (passed) {
          items[i].classList.remove('hidden');
          currentItemId = items[i].id;
          break;
        }
      }
      break;

    default:
      // Hide all items when the video is stopped or buffering
      for (let i = 0; i < items.length; i++) {
        items[i].classList.add('hidden');
      }
      break;
  }
}

function seekTo(time) {
  if (!player || typeof player.getPlayerState !== 'function' || typeof player.seekTo !== 'function' || typeof player.playVideo !== 'function') {
    return;
  }

  console.log('seekTo called with time = ' + time);

  // Scroll to the item that matches the timestamp
  const items = document.querySelectorAll('#player-list li');
  for (let i = 0; i < items.length; i++) {
    const button = items[i].querySelector('button');
    const timestamp = parseInt(button.getAttribute('data-time'));
    if (timestamp === time) {
      // Scroll to the item
      const container = document.querySelector('.container');
      const itemTop = items[i].offsetTop - container.offsetTop;
      container.scrollTo({
        top: itemTop,
        behavior: 'smooth'
      });
      break;
    }
  }

  // Update the list items based on the new time
  const currentTime = player.getCurrentTime();
  for (let i = 0; i < items.length; i++) {
    const button = items[i].querySelector('button');
    const timestamp = parseInt(button.getAttribute('data-time'));
    if (currentTime >= timestamp) {
      // Mark the item as passed
      items[i].setAttribute('data-timestamp-passed', 'true');
    } else {
      // Mark the item as not passed
      items[i].setAttribute('data-timestamp-passed', 'false');
    }
  }

  // Hide items that have passed their timestamp and show the current item
  let currentItemFound = false;
  for (let i = 0; i < items.length; i++) {
    const passed = items[i].getAttribute('data-timestamp-passed') === 'true';
    if (!passed) {
      if (!currentItemFound) {
        items[i].classList.remove('hidden');
        currentItemId = items[i].id;
        currentItemFound = true;
      } else {
        items[i].classList.add('hidden');
      }
    } else {
      items[i].classList.add('hidden');
    }
  }

  // Seek to the new time in the video
  player.seekTo(time);
}