// ===== LIGHTWEIGHT CATEGORIES =====

let currentCategory = 'all';
let currentSort = 'name-asc';
let gamesList = [];

// Category data
const CATEGORIES = {
  'all': { icon: '🎮', name: 'All Games' },
  'action': { icon: '⚔️', name: 'Action' },
  'puzzle': { icon: '🧩', name: 'Puzzle' },
  'racing': { icon: '🏎️', name: 'Racing' },
  'sports': { icon: '⚽', name: 'Sports' },
  'adventure': { icon: '🗺️', name: 'Adventure' },
  'platformer': { icon: '🏃', name: 'Platformer' },
  'strategy': { icon: '♟️', name: 'Strategy' },
  'multiplayer': { icon: '👥', name: 'Multiplayer' },
  'arcade': { icon: '🕹️', name: 'Arcade' },
  'horror': { icon: '👻', name: 'Horror' },
  'simulation': { icon: '🏭', name: 'Simulation' },
  'sandbox': { icon: '🎨', name: 'Sandbox' },
  'other': { icon: '🎮', name: 'Other' }
};

// Get color for category
function getCatColor(cat) {
  const colors = {
    'action': '#ff4444', 'puzzle': '#44ff44', 'racing': '#ff8844',
    'sports': '#44ff88', 'adventure': '#44aaff', 'platformer': '#ff44ff',
    'strategy': '#88ff44', 'multiplayer': '#ffaa44', 'arcade': '#ff44aa',
    'horror': '#aa44ff', 'simulation': '#44ffcc', 'sandbox': '#ff8844',
    'other': '#aaaaaa', 'all': '#ffffff'
  };
  return colors[cat] || '#aaaaaa';
}

// Add category tags to game cards (fast)
function addCategoryTags() {
  const games = document.querySelectorAll('.game');
  games.forEach(game => {
    if (game.getAttribute('data-tagged')) return;
    const name = game.querySelector('p')?.textContent;
    if (name && window.gamesData) {
      const gameData = window.gamesData.find(g => g.name === name);
      const cat = gameData?.category || 'other';
      const catInfo = CATEGORIES[cat] || CATEGORIES.other;
      const tag = document.createElement('div');
      tag.className = 'game-category';
      tag.style.cssText = `font-size:10px;padding:2px 8px;border-radius:20px;background:${getCatColor(cat)}20;color:${getCatColor(cat)};margin-top:5px;display:inline-block;`;
      tag.textContent = `${catInfo.icon} ${catInfo.name}`;
      game.appendChild(tag);
      game.setAttribute('data-category', cat);
      game.setAttribute('data-tagged', 'true');
    }
  });
}

// Filter and sort games (fast)
function updateGames() {
  const container = document.getElementById('gamesContainer');
  if (!container) return;
  
  const games = Array.from(container.children);
  let visible = [];
  let hidden = [];
  
  games.forEach(game => {
    const cat = game.getAttribute('data-category');
    if (currentCategory === 'all' || cat === currentCategory) {
      game.style.display = '';
      visible.push(game);
    } else {
      game.style.display = 'none';
      hidden.push(game);
    }
  });
  
  // Sort visible games
  if (currentSort !== 'default') {
    visible.sort((a, b) => {
      const aName = a.querySelector('p')?.textContent || '';
      const bName = b.querySelector('p')?.textContent || '';
      if (currentSort === 'name-asc') return aName.localeCompare(bName);
      if (currentSort === 'name-desc') return bName.localeCompare(aName);
      
      const aRating = parseFloat(a.querySelector('.rating-average')?.textContent?.match(/★ ([\d.]+)/)?.[1] || 0);
      const bRating = parseFloat(b.querySelector('.rating-average')?.textContent?.match(/★ ([\d.]+)/)?.[1] || 0);
      return currentSort === 'rating-desc' ? bRating - aRating : aRating - bRating;
    });
  }
  
  // Reorder
  visible.forEach(game => container.appendChild(game));
  hidden.forEach(game => container.appendChild(game));
  
  // Update count
  let countEl = document.getElementById('games-count');
  if (!countEl) {
    countEl = document.createElement('div');
    countEl.id = 'games-count';
    countEl.style.cssText = 'text-align:center;font-size:12px;color:#aaa;margin:10px auto;';
    container.parentNode.insertBefore(countEl, container.nextSibling);
  }
  countEl.textContent = `${visible.length} of ${games.length} games`;
}

// Create simple button bar (no dropdowns)
function addCategoryBar() {
  if (document.getElementById('cat-bar')) return;
  
  const searchDiv = document.querySelector('.center');
  if (!searchDiv) return;
  
  const bar = document.createElement('div');
  bar.id = 'cat-bar';
  bar.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:15px auto;max-width:800px;';
  
  // Category button
  const catBtn = document.createElement('button');
  catBtn.textContent = '🐈 egories';
  catBtn.style.cssText = 'background:#2d5ae3;border:none;border-radius:30px;padding:8px 20px;color:white;font-size:14px;cursor:pointer;';
  catBtn.onclick = () => {
    const menu = document.getElementById('cat-menu');
    if (menu.style.display === 'none') {
      menu.style.display = 'flex';
      catBtn.style.background = '#ffcc00';
      catBtn.style.color = '#1a1a2e';
    } else {
      menu.style.display = 'none';
      catBtn.style.background = '#2d5ae3';
      catBtn.style.color = 'white';
    }
  };
  
  // Category menu (hidden by default)
  const menu = document.createElement('div');
  menu.id = 'cat-menu';
  menu.style.cssText = 'display:none;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:10px;';
  
  // Add category options
  const cats = ['all', 'action', 'puzzle', 'racing', 'sports', 'adventure', 'platformer', 'strategy', 'multiplayer', 'arcade', 'horror', 'simulation', 'sandbox'];
  cats.forEach(cat => {
    const info = CATEGORIES[cat];
    const btn = document.createElement('button');
    btn.textContent = `${info.icon} ${info.name}`;
    btn.style.cssText = `background:rgba(20,30,50,0.8);border:1px solid ${getCatColor(cat)};border-radius:30px;padding:6px 14px;color:white;font-size:12px;cursor:pointer;transition:0.1s;`;
    btn.onmouseenter = () => { btn.style.background = `${getCatColor(cat)}40`; };
    btn.onmouseleave = () => { btn.style.background = 'rgba(20,30,50,0.8)'; };
    btn.onclick = () => {
      currentCategory = cat;
      updateGames();
      catBtn.style.background = '#2d5ae3';
      catBtn.style.color = 'white';
      menu.style.display = 'none';
      // Highlight active category button
      document.querySelectorAll('.cat-option').forEach(b => b.style.background = 'rgba(20,30,50,0.8)');
      btn.style.background = `${getCatColor(cat)}40`;
    };
    btn.classList.add('cat-option');
    menu.appendChild(btn);
  });
  
  // Sort buttons
  const sortDiv = document.createElement('div');
  sortDiv.style.cssText = 'display:flex;gap:8px;margin-left:auto;';
  
  const sorts = [
    { value: 'name-asc', label: 'A-Z', icon: '📝' },
    { value: 'name-desc', label: 'Z-A', icon: '📝' },
    { value: 'rating-desc', label: '⭐ High', icon: '⭐' },
    { value: 'rating-asc', label: '⭐ Low', icon: '⭐' }
  ];
  
  sorts.forEach(s => {
    const btn = document.createElement('button');
    btn.textContent = `${s.icon} ${s.label}`;
    btn.style.cssText = 'background:rgba(20,30,50,0.8);border:1px solid rgba(45,90,227,0.4);border-radius:30px;padding:6px 14px;color:white;font-size:12px;cursor:pointer;';
    btn.onclick = () => {
      currentSort = s.value;
      updateGames();
      sorts.forEach(ss => {
        document.querySelectorAll('.sort-option').forEach(b => {
          b.style.background = 'rgba(20,30,50,0.8)';
          b.style.borderColor = 'rgba(45,90,227,0.4)';
        });
      });
      btn.style.background = '#2d5ae3';
      btn.style.borderColor = '#ffcc00';
    };
    btn.classList.add('sort-option');
    sortDiv.appendChild(btn);
  });
  
  bar.appendChild(catBtn);
  bar.appendChild(sortDiv);
  searchDiv.parentNode.insertBefore(bar, searchDiv.nextSibling);
  searchDiv.parentNode.insertBefore(menu, bar.nextSibling);
}

// Initialize
function init() {
  addCategoryBar();
  addCategoryTags();
  setTimeout(() => {
    storeOriginalOrder();
    updateGames();
  }, 200);
}

// Store original order
let originalOrder = [];
function storeOriginalOrder() {
  const container = document.getElementById('gamesContainer');
  if (container && originalOrder.length === 0) {
    originalOrder = Array.from(container.children);
  }
}

// Wait for games to load
if (window.gamesData) {
  init();
} else {
  const checkInterval = setInterval(() => {
    if (window.gamesData && window.gamesData.length > 0) {
      clearInterval(checkInterval);
      init();
    }
  }, 100);
}

console.log('✅ Categories ready - click "🐈 egories" to filter');
