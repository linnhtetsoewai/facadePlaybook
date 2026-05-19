# Reference Image Viewer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a catalog-style image lightbox to facade system option cards so users can browse reference photos and confirm a final system selection.

**Architecture:** Six sequential tasks: (1) create empty image folders, (2) add `ref_images` field to data, (3) update the normalization + state layer, (4) add the lightbox modal HTML + CSS, (5) add lightbox JS, (6) wire the suggestion cards as triggers and show the selected badge. All changes are confined to `src/projectsData.js` and `facadePlaybook.html` plus new empty image folders.

**Tech Stack:** Vanilla JS / HTML / CSS single-file app; Node.js used only as a one-off data-migration script; no build tool or test framework.

---

### Task 1: Create image folder tree

**Files:**
- Create: `src/ref-images/<group>/<option>/.gitkeep` — 45 option folders across 11 system groups

- [ ] **Step 1: Run folder-creation script**

From the project root (`c:/Users/linnh/Documents/AAA/FacadePlaybook`), run this in PowerShell:

```powershell
$folders = @(
  "src/ref-images/balustrade/floor-mounted-metal-balustrade-system",
  "src/ref-images/balustrade/cable-railing-balustrade-system",
  "src/ref-images/balustrade/stainless-steel-vertical-balustrade-system",
  "src/ref-images/balustrade/floor-mounted-glazed-balustrade-system",
  "src/ref-images/balustrade/face-mounted-glazed-balustrade-system",
  "src/ref-images/balustrade/face-mounted-metal-balustrade-system",
  "src/ref-images/wall-cladding/extruded-aluminium-profile-system",
  "src/ref-images/wall-cladding/glass-fiber-reinforced-concrete-gfrc-system",
  "src/ref-images/wall-cladding/glass-reinforced-acrylic-gra-system",
  "src/ref-images/wall-cladding/exterior-insulation-finish-system-eifs",
  "src/ref-images/column-cladding/solid-metal-cladding",
  "src/ref-images/column-cladding/glass-fiber-reinforced-concrete-gfrc",
  "src/ref-images/column-cladding/glass-reinforced-acrylic-gra-system",
  "src/ref-images/column-cladding/exterior-insulation-finish-system-eifs",
  "src/ref-images/slab-edge-cladding/solid-aluminium-cladding-system",
  "src/ref-images/slab-edge-cladding/glass-fiber-reinforced-concrete-gfrc-system",
  "src/ref-images/slab-edge-cladding/glass-reinforced-acrylic-gra-system",
  "src/ref-images/soffit-cladding/solid-aluminium-cladding-system",
  "src/ref-images/soffit-cladding/cement-board-with-render-finish-system",
  "src/ref-images/curtain-wall/aluminium-stick-curtain-wall-capped-system",
  "src/ref-images/curtain-wall/aluminium-stick-curtain-wall-toggle-system",
  "src/ref-images/curtain-wall/steel-mullion-with-add-on-curtain-wall-system",
  "src/ref-images/curtain-wall/glass-fin-curtain-wall-system",
  "src/ref-images/curtain-wall/structural-silicone-glazed-ssg-stick-system",
  "src/ref-images/curtain-wall/unitised-stick-hybrid-semi-unitised-system",
  "src/ref-images/curtain-wall/unitised-curtain-wall-system",
  "src/ref-images/curtain-wall/spider-glazing-system",
  "src/ref-images/curtain-wall/routel-supported-glass-system",
  "src/ref-images/curtain-wall/cable-net-system",
  "src/ref-images/curtain-wall/slab-to-slab-window-wall-system",
  "src/ref-images/curtain-wall/double-skin-facade-system",
  "src/ref-images/curtain-wall/adaptive-dynamic-facade-system",
  "src/ref-images/curtain-wall/blast-resistant-curtain-wall-system",
  "src/ref-images/curtain-wall/fire-rated-curtain-wall-system",
  "src/ref-images/entrance-door/pivot-door-system",
  "src/ref-images/entrance-door/automatic-sliding-door-system",
  "src/ref-images/entrance-door/revolving-door-system",
  "src/ref-images/balcony-door/aluminium-swing-door-system",
  "src/ref-images/balcony-door/lift-and-slide-door-system",
  "src/ref-images/screen/mesh-screen",
  "src/ref-images/screen/frosted-glass",
  "src/ref-images/mep-louver/vertical-mep-louver",
  "src/ref-images/mep-louver/horizontal-mep-louver",
  "src/ref-images/louver-fin/extruded-aluminium-louver",
  "src/ref-images/louver-fin/cladded-metal-louver"
)
foreach ($f in $folders) {
  New-Item -ItemType Directory -Force -Path $f | Out-Null
  New-Item -ItemType File -Force -Path "$f/.gitkeep" | Out-Null
}
Write-Host "Created $($folders.Count) folders"
```

Expected output: `Created 45 folders`

- [ ] **Step 2: Verify spot-check**

```powershell
Test-Path "src/ref-images/balustrade/cable-railing-balustrade-system/.gitkeep"
Test-Path "src/ref-images/curtain-wall/fire-rated-curtain-wall-system/.gitkeep"
```

Expected: both print `True`

- [ ] **Step 3: Commit**

```bash
git add src/ref-images/
git commit -m "feat: add image folder tree for all 45 facade system options"
```

---

### Task 2: Add `ref_images` field to all options in `src/projectsData.js`

**Files:**
- Modify: `src/projectsData.js` — add `ref_images: []` to every option object (45 options)

- [ ] **Step 1: Run the data migration script**

From the project root, run:

```bash
node -e "
const fs = require('fs');
let src = fs.readFileSync('src/projectsData.js', 'utf8');
src = src.replace('window.FACADE_DB =', 'global.FACADE_DB =');
eval(src);
const db = global.FACADE_DB;
db.facade_systems.forEach(sys => {
  (sys.options || []).forEach(opt => {
    if (!Array.isArray(opt.ref_images)) opt.ref_images = [];
  });
});
const out = 'window.FACADE_DB = ' + JSON.stringify(db, null, 2) + ';\n';
fs.writeFileSync('src/projectsData.js', out);
console.log('Done. Options updated:', db.facade_systems.reduce((n,s)=>n+(s.options||[]).length,0));
"
```

Expected output: `Done. Options updated: 45`

Note: `JSON.stringify` will reformat the file. The data is unchanged — only whitespace is affected.

- [ ] **Step 2: Verify the field was added**

```bash
node -e "
const fs = require('fs');
let src = fs.readFileSync('src/projectsData.js','utf8').replace('window.FACADE_DB =','global.FACADE_DB =');
eval(src);
const opts = global.FACADE_DB.facade_systems.flatMap(s => s.options || []);
const missing = opts.filter(o => !Array.isArray(o.ref_images));
console.log('Total options:', opts.length, '| Missing ref_images:', missing.length);
"
```

Expected output: `Total options: 45 | Missing ref_images: 0`

- [ ] **Step 3: Commit**

```bash
git add src/projectsData.js
git commit -m "feat: add empty ref_images array to all 45 facade system options"
```

---

### Task 3: Update `normalizeFacadeOption` + `CFG` init

**Files:**
- Modify: `facadePlaybook.html:2093-2103` — `normalizeFacadeOption` function
- Modify: `facadePlaybook.html:1953` — `CFG` object initialisation

- [ ] **Step 1: Update `normalizeFacadeOption` to pass through `ref_images`**

Find this block at line 2093 in `facadePlaybook.html`:

```js
function normalizeFacadeOption(opt, systemId) {
  if(typeof opt === 'string') {
    return { label: opt, tags: {}, note: '', systemId };
  }
  return {
    label: opt.label || opt.name || opt.title || '',
    tags: opt.tags || opt.when || {},
    note: opt.note || '',
    systemId
  };
}
```

Replace with:

```js
function normalizeFacadeOption(opt, systemId) {
  if(typeof opt === 'string') {
    return { label: opt, tags: {}, note: '', ref_images: [], systemId };
  }
  return {
    label: opt.label || opt.name || opt.title || '',
    tags: opt.tags || opt.when || {},
    note: opt.note || '',
    ref_images: opt.ref_images || [],
    systemId
  };
}
```

- [ ] **Step 2: Add `finalSelections` to CFG init**

Find line 1953:

```js
let CFG = { step:0, type:null, budget:null, zones:[], systems:[], access:[], configs:{}, activeSystem:null, massing:null };
```

Replace with:

```js
let CFG = { step:0, type:null, budget:null, zones:[], systems:[], access:[], configs:{}, activeSystem:null, massing:null, finalSelections:{} };
```

- [ ] **Step 3: Open `facadePlaybook.html` in a browser and open the configurator**

Verify the page loads without JS errors in the browser console (F12 → Console). No functional change yet.

- [ ] **Step 4: Commit**

```bash
git add facadePlaybook.html
git commit -m "feat: pass ref_images through normalizeFacadeOption, add finalSelections to CFG"
```

---

### Task 4: Add lightbox modal HTML + CSS

**Files:**
- Modify: `facadePlaybook.html:1515` — add CSS (before the `/* ── NOTIFICATION ──` comment)
- Modify: `facadePlaybook.html:1939` — add HTML (after the closing `</div>` of `#modal-system`)

- [ ] **Step 1: Add CSS for the image lightbox**

Find this line in `facadePlaybook.html` (around line 1516):

```css
/* ── NOTIFICATION ── */
```

Insert the following block immediately before it:

```css
/* ── REF IMAGE LIGHTBOX ── */
.refimg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; margin-bottom: 12px; }
.refimg-thumb { aspect-ratio: 4/3; overflow: hidden; border-radius: var(--radius); border: 2px solid transparent; cursor: pointer; background: var(--surface2); }
.refimg-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity 0.15s; }
.refimg-thumb:hover { border-color: var(--accent-mid); }
.refimg-thumb.active { border-color: var(--accent); }
.refimg-preview { margin-bottom: 16px; border-radius: var(--radius); overflow: hidden; background: var(--surface2); }
.refimg-preview img { width: 100%; max-height: 50vh; object-fit: contain; display: block; }
.refimg-empty { text-align: center; padding: 40px 24px; color: var(--text-2); }
.refimg-empty .empty-icon { font-size: 32px; margin-bottom: 12px; opacity: 0.4; }
.refimg-empty .empty-title { font-family: var(--serif); font-size: 18px; color: var(--text); margin-bottom: 6px; font-weight: 700; letter-spacing: -0.03em; }
.refimg-empty .empty-path { font-size: 12px; color: var(--text-3); font-family: monospace; margin-top: 4px; }
#modal-refimg { z-index: 201; }
```

- [ ] **Step 2: Add lightbox modal HTML**

Find this block at line 1939 in `facadePlaybook.html`:

```html
<div class="notif" id="notif"></div>
```

Insert the following immediately before that line:

```html
<div class="modal-backdrop" id="modal-refimg">
  <div class="modal modal-wide">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
      <button class="btn" onclick="closeRefImages()" style="padding:6px 12px;flex-shrink:0;">&#8592; Back</button>
      <div class="modal-title" id="refimg-title" style="margin-bottom:0;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></div>
    </div>
    <div id="refimg-grid" class="refimg-grid"></div>
    <div id="refimg-preview" class="refimg-preview" style="display:none;">
      <img id="refimg-preview-img" src="" alt="">
    </div>
    <div id="refimg-empty" class="refimg-empty" style="display:none;">
      <div class="empty-icon">&#128444;</div>
      <div class="empty-title">No reference images yet</div>
      <div class="empty-path" id="refimg-empty-path"></div>
    </div>
    <div class="modal-footer">
      <button class="btn" onclick="closeRefImages()">Back</button>
      <button class="btn btn-primary" onclick="confirmRefSelection()">Choose this system</button>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Verify modal renders**

Open `facadePlaybook.html` in a browser. In the browser console (F12), run:

```js
document.getElementById('modal-refimg').classList.add('open')
```

Expected: an empty modal appears with a "← Back" button, blank title, and "Choose this system" button. Close it with:

```js
document.getElementById('modal-refimg').classList.remove('open')
```

- [ ] **Step 4: Commit**

```bash
git add facadePlaybook.html
git commit -m "feat: add ref image lightbox modal HTML and CSS"
```

---

### Task 5: Add lightbox JS functions

**Files:**
- Modify: `facadePlaybook.html:3215` — add four functions before the closing `</script>` tag

- [ ] **Step 1: Add `openRefImages`, `selectRefThumb`, `closeRefImages`, `confirmRefSelection`**

Find this block near the end of the `<script>` (around line 3217):

```js
// close modals on backdrop click
document.querySelectorAll('.modal-backdrop').forEach(bd=>{
```

Insert the following immediately before that line:

```js
function openRefImages(systemId, optionLabel) {
  const suggestions = SYSTEM_SUGGESTIONS[systemId] || [];
  const opt = suggestions.find(o => o.label === optionLabel) || {};
  const images = opt.ref_images || [];

  document.getElementById('refimg-title').textContent = optionLabel;

  const modal = document.getElementById('modal-refimg');
  modal.dataset.systemId = systemId;
  modal.dataset.optionLabel = optionLabel;

  const grid = document.getElementById('refimg-grid');
  const preview = document.getElementById('refimg-preview');
  const empty = document.getElementById('refimg-empty');

  if (images.length === 0) {
    grid.innerHTML = '';
    preview.style.display = 'none';
    empty.style.display = 'block';
    const groupSlug = systemId.replace(/_/g, '-');
    const optSlug = optionLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    document.getElementById('refimg-empty-path').textContent = `src/ref-images/${groupSlug}/${optSlug}/`;
  } else {
    empty.style.display = 'none';
    preview.style.display = 'none';
    document.getElementById('refimg-preview-img').src = '';
    grid.innerHTML = images.map((img, i) =>
      `<div class="refimg-thumb" onclick="selectRefThumb(${i}, '${img.src.replace(/\\/g,'\\\\').replace(/'/g,"\\'")}')">
        <img src="${img.src}" alt="${img.caption || optionLabel}" loading="lazy">
      </div>`
    ).join('');
  }

  modal.classList.add('open');
}

function selectRefThumb(index, src) {
  document.querySelectorAll('#refimg-grid .refimg-thumb').forEach((el, i) =>
    el.classList.toggle('active', i === index)
  );
  const preview = document.getElementById('refimg-preview');
  document.getElementById('refimg-preview-img').src = src;
  preview.style.display = 'block';
}

function closeRefImages() {
  document.getElementById('modal-refimg').classList.remove('open');
}

function confirmRefSelection() {
  const modal = document.getElementById('modal-refimg');
  const systemId = modal.dataset.systemId;
  const optionLabel = modal.dataset.optionLabel;
  if (!systemId || !optionLabel) return;
  CFG.finalSelections[systemId] = optionLabel;
  modal.classList.remove('open');
  closeModal('modal-system');
  buildConfigQuestions();
  checkConfigComplete();
}

```

- [ ] **Step 2: Verify functions exist in console**

Open `facadePlaybook.html` in browser, open console (F12), run:

```js
typeof openRefImages   // expected: "function"
typeof confirmRefSelection  // expected: "function"
```

- [ ] **Step 3: Test `openRefImages` manually with no images**

In the console, run (after navigating to the Configurator page and completing at least one system step so `SYSTEM_SUGGESTIONS` is populated):

```js
// Get the first systemId that exists
const firstId = Object.keys(SYSTEM_SUGGESTIONS)[0];
const firstLabel = SYSTEM_SUGGESTIONS[firstId][0]?.label;
openRefImages(firstId, firstLabel);
```

Expected: lightbox opens showing the empty-state message and the folder path hint. "Back" button closes it.

- [ ] **Step 4: Commit**

```bash
git add facadePlaybook.html
git commit -m "feat: add openRefImages, selectRefThumb, closeRefImages, confirmRefSelection"
```

---

### Task 6: Wire suggestion cards as triggers + show selected badge

**Files:**
- Modify: `facadePlaybook.html:2650-2657` — `sys-suggest-card` inside `renderSystemQuestions`
- Modify: `facadePlaybook.html:2723-2730` — `config-suggestion-card` inside `buildConfigQuestions`
- Modify: `facadePlaybook.html:2688-2698` — `bindSystemModalEvents` (add delegated listener for suggest cards)

- [ ] **Step 1: Make `sys-suggest-card` clickable in `renderSystemQuestions`**

Find this block (around line 2650):

```js
          ${suggestions.slice(0, 4).map(opt => {
            const chips = (opt.matched || []).map(k => `<span class="sys-chip">${k}</span>`).join('');
            return `<div class="sys-suggest-card">
              <div class="sys-suggest-name">${opt.label}</div>
              <div class="sys-suggest-sub">${opt.note || 'Matches your current answers'}</div>
              ${chips ? `<div class="sys-chip-row">${chips}</div>` : ''}
            </div>`;
          }).join('')}
```

Replace with:

```js
          ${suggestions.slice(0, 4).map(opt => {
            const chips = (opt.matched || []).map(k => `<span class="sys-chip">${k}</span>`).join('');
            const chosen = CFG.finalSelections[id] === opt.label;
            return `<div class="sys-suggest-card" style="cursor:pointer" data-sysid="${id}" data-optlabel="${opt.label.replace(/"/g,'&quot;')}" role="button" tabindex="0">
              <div class="sys-suggest-name">${opt.label}</div>
              <div class="sys-suggest-sub">${opt.note || 'Matches your current answers'}</div>
              ${chips ? `<div class="sys-chip-row">${chips}</div>` : ''}
              ${chosen ? `<div style="margin-top:6px"><span class="sys-chip" style="background:var(--green-light);border-color:var(--green-mid);color:var(--green)">&#10003; Selected</span></div>` : ''}
            </div>`;
          }).join('')}
```

- [ ] **Step 2: Add delegated click listener for `sys-suggest-card` in `bindSystemModalEvents`**

Find this block (line 2688):

```js
function bindSystemModalEvents() {
  const body = document.getElementById('system-modal-body');
  if(!body || body.dataset.bound === '1') return;
  body.dataset.bound = '1';
  body.addEventListener('click', e => {
    const btn = e.target.closest('.sys-option-card');
    if(!btn) return;
    e.preventDefault();
    setSystemAnswer(btn.dataset.system, btn.dataset.question, btn.dataset.value);
  });
}
```

Replace with:

```js
function bindSystemModalEvents() {
  const body = document.getElementById('system-modal-body');
  if(!body || body.dataset.bound === '1') return;
  body.dataset.bound = '1';
  body.addEventListener('click', e => {
    const card = e.target.closest('.sys-suggest-card');
    if(card && card.dataset.sysid) {
      openRefImages(card.dataset.sysid, card.dataset.optlabel);
      return;
    }
    const btn = e.target.closest('.sys-option-card');
    if(!btn) return;
    e.preventDefault();
    setSystemAnswer(btn.dataset.system, btn.dataset.question, btn.dataset.value);
  });
}
```

- [ ] **Step 3: Make `config-suggestion-card` clickable in `buildConfigQuestions`**

Find this block (around line 2723):

```js
            ${suggestions.slice(0, 4).map(opt => {
              const chips = (opt.matched || []).map(k => `<span class="sys-chip">${k}</span>`).join('');
              return `<div class="config-suggestion-card">
                <div class="config-suggestion-name">${opt.label}</div>
                <div class="config-suggestion-sub">${opt.note || 'Matches your current answers'}</div>
                ${chips ? `<div class="sys-chip-row">${chips}</div>` : ''}
              </div>`;
            }).join('')}
```

Replace with:

```js
            ${suggestions.slice(0, 4).map(opt => {
              const chips = (opt.matched || []).map(k => `<span class="sys-chip">${k}</span>`).join('');
              const chosen = CFG.finalSelections[sid] === opt.label;
              return `<div class="config-suggestion-card" style="cursor:pointer" onclick="openRefImages('${sid}','${opt.label.replace(/'/g,"\\'")}')" role="button" tabindex="0">
                <div class="config-suggestion-name">${opt.label}</div>
                <div class="config-suggestion-sub">${opt.note || 'Matches your current answers'}</div>
                ${chips ? `<div class="sys-chip-row">${chips}</div>` : ''}
                ${chosen ? `<div style="margin-top:6px"><span class="sys-chip" style="background:var(--green-light);border-color:var(--green-mid);color:var(--green)">&#10003; Selected</span></div>` : ''}
              </div>`;
            }).join('')}
```

- [ ] **Step 4: Verify end-to-end in browser**

Open `facadePlaybook.html`, navigate to **Configurator**, and run through a full flow:

1. Select project type, budget, zone, and at least one system (e.g. Balustrade).
2. Open the system modal. Answer all questions until recommendations appear.
3. Click a recommendation card. Expected: the image lightbox opens with the empty-state message and a folder path hint like `src/ref-images/balustrade/cable-railing-balustrade-system/`.
4. Click "Choose this system". Expected: both modals close, the configurator refreshes, and the chosen card now shows a green "✓ Selected" badge.
5. Reopen the system modal. Expected: the chosen card still shows the badge.
6. Click "Back" instead of "Choose this system". Expected: lightbox closes, system modal stays open.
7. Check the main configurator page (Step 5 — system questions). Expected: `config-suggestion-card` items are also clickable and show the same badge for the chosen option.

- [ ] **Step 5: Commit**

```bash
git add facadePlaybook.html
git commit -m "feat: wire suggestion cards to ref image lightbox, add selected badge"
```

---

## Notes for Adding Real Images Later

1. Drop image files (jpg/png/webp) into the relevant folder, e.g.:
   `src/ref-images/balustrade/cable-railing-balustrade-system/img-01.jpg`

2. Add an entry to that option's `ref_images` array in `src/projectsData.js`:
   ```json
   "ref_images": [
     { "src": "src/ref-images/balustrade/cable-railing-balustrade-system/img-01.jpg", "caption": "Typical installation detail" }
   ]
   ```

3. Reload the page — no build step required.
