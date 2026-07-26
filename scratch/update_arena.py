import re

with open("arena.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add CSS
css_to_add = """
    /* Tiles View Styles */
    .category-tiles {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-top: 40px;
    }
    .category-tile {
      background: linear-gradient(145deg, #1A0D0D 0%, #0A0505 100%);
      border: 1px solid rgba(212, 161, 76, 0.2);
      border-radius: 16px;
      padding: 40px 24px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    .category-tile:hover {
      transform: translateY(-8px);
      border-color: var(--gold);
      box-shadow: 0 12px 32px rgba(212, 161, 76, 0.15);
    }
    .category-tile .tile-icon {
      font-size: 3.5rem;
      margin-bottom: 16px;
    }
    .category-tile h3 {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 2.2rem;
      color: var(--cream);
      letter-spacing: 0.1em;
      margin-bottom: 8px;
    }
    .category-tile p {
      font-family: 'Barlow', sans-serif;
      color: rgba(242, 230, 217, 0.7);
      font-size: 1.1rem;
    }
    #eventsView {
      display: none;
      animation: fadeIn 0.4s ease;
    }
    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      border: 1px solid rgba(212, 161, 76, 0.4);
      color: var(--gold);
      padding: 8px 16px;
      border-radius: 8px;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 1.2rem;
      letter-spacing: 0.1em;
      cursor: pointer;
      margin-bottom: 32px;
      transition: all 0.2s ease;
    }
    .back-btn:hover {
      background: rgba(212, 161, 76, 0.1);
      border-color: var(--gold);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
"""
content = content.replace("/* Premium Modal Styles */", css_to_add + "\n    /* Premium Modal Styles */")

# 2. Add Tiles HTML
tiles_html = """
      <div id="categoriesView" class="category-tiles">
        <div class="category-tile" data-target="pvp-section">
          <div class="tile-icon">⚔️</div>
          <h3>PvP Arena</h3>
          <p>Intense combat zones</p>
        </div>
        <div class="category-tile" data-target="racing-section">
          <div class="tile-icon">🏎️</div>
          <h3>Racing Arena</h3>
          <p>High speed circuits</p>
        </div>
        <div class="category-tile" data-target="events-section">
          <div class="tile-icon">🔥</div>
          <h3>Special Events</h3>
          <p>Server-wide chaos</p>
        </div>
      </div>
      
      <div id="eventsView">
        <button class="back-btn" id="backToCategories">← Back to Categories</button>
"""

content = content.replace("<!-- PVP ARENA -->", tiles_html + "\n      <!-- PVP ARENA -->")

# 3. Add IDs to rules-sections
content = content.replace('<div class="rules-section">\n        <h2 class="rules-section-title">PvP Arena</h2>', '<div class="rules-section" id="pvp-section">\n        <h2 class="rules-section-title">PvP Arena</h2>')
content = content.replace('<div class="rules-section">\n        <h2 class="rules-section-title">Racing Arena</h2>', '<div class="rules-section" id="racing-section">\n        <h2 class="rules-section-title">Racing Arena</h2>')
content = content.replace('<div class="rules-section">\n        <h2 class="rules-section-title">Special Events</h2>', '<div class="rules-section" id="events-section">\n        <h2 class="rules-section-title">Special Events</h2>')

content = content.replace('      </div>\n\n    </div>\n  </main>', '      </div>\n      </div>\n\n    </div>\n  </main>')

# 4. Add JavaScript
js_to_add = """
      // Tiles logic
      const categoriesView = document.getElementById('categoriesView');
      const eventsView = document.getElementById('eventsView');
      const backBtn = document.getElementById('backToCategories');
      const categoryTiles = document.querySelectorAll('.category-tile');
      const ruleSections = document.querySelectorAll('#eventsView .rules-section');

      categoryTiles.forEach(tile => {
        tile.addEventListener('click', () => {
          const targetId = tile.getAttribute('data-target');
          categoriesView.style.display = 'none';
          eventsView.style.display = 'block';
          
          ruleSections.forEach(section => {
            if(section.id === targetId) {
              section.style.display = 'block';
            } else {
              section.style.display = 'none';
            }
          });
        });
      });

      backBtn.addEventListener('click', () => {
        eventsView.style.display = 'none';
        categoriesView.style.display = 'grid';
      });
"""
content = content.replace('// Add click event to all arena items', js_to_add + '\n      // Add click event to all arena items')

with open("arena.html", "w", encoding="utf-8") as f:
    f.write(content)

print("HTML structure updated")
