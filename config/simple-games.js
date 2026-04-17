// ===== SIMPLE GAMES LOADER - NO COMPLEX STUFF =====

// Make gamesData global
window.gamesData = [];

// Load games when page is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log("Simple games loader started");
  
  // Load games from JSON
  fetch("./config/games.json")
    .then(function(response) { return response.json(); })
    .then(function(data) {
      window.gamesData = data;
      console.log("✅ Loaded " + window.gamesData.length + " games");
      displayAllGames();
    })
    .catch(function(error) { console.error("Error:", error); });
  
  function displayAllGames() {
    const container = document.getElementById("gamesContainer");
    if (!container) {
      console.error("No gamesContainer found");
      return;
    }
    container.innerHTML = "";
    
    for (var i = 0; i < window.gamesData.length; i++) {
      var game = window.gamesData[i];
      
      var gameDiv = document.createElement("div");
      gameDiv.className = "game";
      
      var img = document.createElement("img");
      if (game.image && game.image.indexOf('http') === 0) {
        img.src = game.image;
      } else {
        img.src = 'https://via.placeholder.com/200x200?text=No+Image';
      }
      img.alt = game.name;
      img.style.width = "100%";
      img.style.cursor = "pointer";
      
      // DIRECT CLICK HANDLER - NO CLOSURES, NO COMPLEXITY
      var gameUrl = game.url;
      var gameName = game.name;
      
      img.onclick = function(url, name) {
        return function() {
          var playUrl = 'play.html?gameurl=' + encodeURIComponent(url) + '&game=' + encodeURIComponent(name);
          console.log("Opening:", playUrl);
          window.open(playUrl, '_blank');
        };
      }(gameUrl, gameName);
      
      var title = document.createElement("p");
      title.textContent = game.name;
      
      gameDiv.appendChild(img);
      gameDiv.appendChild(title);
      container.appendChild(gameDiv);
    }
    
    console.log("✅ Displayed " + window.gamesData.length + " games");
  }
});
