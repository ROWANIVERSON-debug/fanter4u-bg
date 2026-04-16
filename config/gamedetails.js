// ===== GAME DETAILS MODAL =====

let currentDetailGame = null;

function showGameDetails(gameName, gameUrl, gameImage, gameRating) {
  currentDetailGame = { name: gameName, url: gameUrl, image: gameImage };
  
  // Create modal
  let modal = document.getElementById('gamedetails-modal');
  if (modal) modal.remove();
  
  modal = document.createElement('div');
  modal.id = 'gamedetails-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(10px);
    z-index: 100000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  `;
  
  const userRating = typeof userVotes !== 'undefined' ? (userVotes[gameName] || 0) : 0;
  const avgRating = gameRating || { average: 0, count: 0 };
  
  modal.innerHTML = `
    <div class="gamedetails-container" style="
      background: rgba(15,20,40,0.98);
      border: 2px solid rgba(45,90,227,0.5);
      border-radius: 24px;
      max-width: 500px;
      width: 90%;
      max-height: 85vh;
      overflow-y: auto;
      transform: scale(0.9);
      transition: transform 0.3s ease;
    ">
      <div style="position: relative;">
        <button class="gamedetails-close" style="
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          font-size: 20px;
          cursor: pointer;
          color: white;
          z-index: 10;
        ">✕</button>
        <img src="${gameImage}" alt="${gameName}" style="
          width: 100%;
          border-radius: 24px 24px 0 0;
          max-height: 250px;
          object-fit: cover;
        ">
      </div>
      <div style="padding: 25px;">
        <h2 style="font-size: 24px; margin-bottom: 10px;">${gameName}</h2>
        
        <div style="display: flex; gap: 15px; margin-bottom: 20px;">
          <div style="background: rgba(45,90,227,0.2); padding: 5px 12px; border-radius: 20px;">
            <span>⭐ ${avgRating.average.toFixed(1)} (${avgRating.count})</span>
          </div>
          <div style="background: rgba(255,204,0,0.2); padding: 5px 12px; border-radius: 20px;">
            <span>your rating: ${userRating > 0 ? '★'.repeat(userRating) + '☆'.repeat(5-userRating) : 'not rated'}</span>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="display: flex; gap: 8px; margin-bottom: 15px;">
            ${[1,2,3,4,5].map(star => `
              <span class="detail-star" data-value="${star}" style="
                font-size: 32px;
                cursor: pointer;
                color: ${userRating >= star ? '#ffcc00' : 'rgba(255,255,255,0.2)'};
                transition: all 0.1s ease;
              ">★</span>
            `).join('')}
          </div>
        </div>
        
        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
          <button class="settings-btn" id="gamedetails-play" style="flex: 1;">🎮 play now</button>
          <button class="settings-btn" id="gamedetails-favorite" style="flex: 1;">${getFavourites().includes(gameName) ? '★ favorited' : '☆ favorite'}</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Aniate in
  setTimeout(() => {
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
    const container = modal.querySelector('.gamedetails-container');
    if (container) container.style.transform = 'scale(1)';
  }, 10);
  
  // Close button
  modal.querySelector('.gamedetails-close').onclick = () => closeGameDetails();
  modal.onclick = (e) => { if (e.target === modal) closeGameDetails(); };
  
  // Star rating
  modal.querySelectorAll('.detail-star').forEach(star => {
    star.onclick = () => {
      const value = parseInt(star.dataset.value);
      if (typeof submitRating === 'function') {
        submitRating(gameName, value);
      }
      // Update star colors
      modal.querySelectorAll('.detail-star').forEach((s, idx) => {
        s.style.color = idx < value ? '#ffcc00' : 'rgba(255,255,255,0.2)';
      });
      // Update user rating display
      const ratingDiv = modal.querySelector('.detail-star').parentElement.parentElement.nextSibling;
      if (ratingDiv) {
        ratingDiv.innerHTML = `<span>your rating: ${'★'.repeat(value)}${'☆'.repeat(5-value)}</span>`;
      }
    };
    star.onmouseenter = () => {
      const value = parseInt(star.dataset.value);
      modal.querySelectorAll('.detail-star').forEach((s, idx) => {
        s.style.color = idx < value ? '#ffcc66' : 'rgba(255,255,255,0.2)';
      });
    };
    star.onmouseleave = () => {
      const currentRating = typeof userVotes !== 'undefined' ? (userVotes[gameName] || 0) : 0;
      modal.querySelectorAll('.detail-star').forEach((s, idx) => {
        s.style.color = idx < currentRating ? '#ffcc00' : 'rgba(255,255,255,0.2)';
      });
    };
  });
  
  // Play button
  document.getElementById('gamedetails-play').onclick = () => {
    if (typeof trackPlayedGame === 'function') trackPlayedGame(gameName);
    window.location.href = gameUrl.startsWith('http') ? gameUrl : `play.html?gameurl=${gameUrl}/`;
  };
  
  // Favorite button
  document.getElementById('gamedetails-favorite').onclick = () => {
    if (typeof toggleFavourite === 'function') {
      toggleFavourite(gameName);
      const favBtn = document.getElementById('gamedetails-favorite');
      const isFavorited = getFavourites().includes(gameName);
      favBtn.textContent = isFavorited ? '★ favorited' : '☆ favorite';
    }
  };
}

function closeGameDetails() {
  const modal = document.getElementById('gamedetails-modal');
  if (modal) {
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    setTimeout(() => modal.remove(), 300);
  }
}

// Override game click to show details (optional)
function setupGameDetailsOnClick() {
  document.querySelectorAll('.game').forEach(gameCard => {
    if (gameCard.hasAttribute('data-details-setup')) return;
    
    const img = gameCard.querySelector('img');
    const gameName = gameCard.querySelector('p')?.textContent;
    const gameUrl = img?.onclick?.toString().match(/play\.html\?gameurl=([^']+)/)?.[1];
    
    if (img && gameName) {
      // Save original click
      const originalClick = img.onclick;
      
      // Create new click that shows details
      img.onclick = (e) => {
        e.stopPropagation();
        // Get rating
        let gameRating = { average: 0, count: 0 };
        if (typeof globalRatings !== 'undefined' && globalRatings[gameName]) {
          gameRating = globalRatings[gameName];
        }
        showGameDetails(gameName, gameUrl || '', img.src, gameRating);
      };
      
      gameCard.setAttribute('data-details-setup', 'true');
    }
  });
}

// Watch for new games
if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(() => {
    setupGameDetailsOnClick();
  });
  observer.observe(document.getElementById('gamesContainer'), { childList: true, subtree: true });
}

console.log('✅ Game Details Modal ready!');
