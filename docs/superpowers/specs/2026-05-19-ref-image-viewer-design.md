# Reference Image Viewer — Design Spec

**Date:** 2026-05-19  
**Feature:** Catalog-style reference image gallery for facade system option cards  
**Scope:** `facadePlaybook.html` + `src/projectsData.js` + new `src/ref-images/` folder tree

---

## 1. Goal

When a user reaches the recommendation step of any system configurator modal (e.g. "Balustrade → Cable Railing Balustrade System"), they can click any option card to open a catalog-style image lightbox. After browsing images they can confirm their selection with "Choose this system", which records the final pick and closes the modal.

---

## 2. Data Layer

### 2a. `ref_images` field per option

Add a `ref_images` array to every option object in `FACADE_DB.facade_systems[*].options[]` in `src/projectsData.js`.

```json
{
  "label": "Cable Railing Balustrade System",
  "ref_images": [
    { "src": "src/ref-images/balustrade/cable-railing-balustrade-system/img-01.jpg", "caption": "" }
  ],
  "tags": { ... }
}
```

- Initially all `ref_images` arrays are empty `[]`.
- Each entry: `{ "src": "<relative-path>", "caption": "<optional text>" }`.
- Adding images later = drop files into the relevant folder and add entries here.

### 2b. Final selection state

Add `CFG.finalSelections = {}` to the CFG object initialisation.  
Key: system id string — this is `slugify(sys.name)` with underscores, e.g. `"balustrade"`, `"wall_cladding"`, `"curtain_wall"`. Value: chosen option label string.

```js
let CFG = { ..., finalSelections: {} };
```

---

## 3. Folder Structure

Create `src/ref-images/` with one subfolder per system group (kebab-cased) and one sub-subfolder per option (kebab-cased). Folders are empty placeholders; user drops images in later.

```
src/ref-images/
  balustrade/
    floor-mounted-metal-balustrade-system/
    cable-railing-balustrade-system/
    stainless-steel-vertical-balustrade-system/
    floor-mounted-glazed-balustrade-system/
    face-mounted-glazed-balustrade-system/
    face-mounted-metal-balustrade-system/
  wall-cladding/
    extruded-aluminium-profile-system/
    glass-fiber-reinforced-concrete-gfrc-system/
    glass-reinforced-acrylic-gra-system/
    exterior-insulation-finish-system-eifs/
  column-cladding/
    solid-metal-cladding/
    glass-fiber-reinforced-concrete-gfrc/
    glass-reinforced-acrylic-gra-system/
    exterior-insulation-finish-system-eifs/
  slab-edge-cladding/
    solid-aluminium-cladding-system/
    glass-fiber-reinforced-concrete-gfrc-system/
    glass-reinforced-acrylic-gra-system/
  soffit-cladding/
    solid-aluminium-cladding-system/
    cement-board-with-render-finish-system/
  curtain-wall/
    aluminium-stick-curtain-wall-capped-system/
    aluminium-stick-curtain-wall-toggle-system/
    steel-mullion-with-add-on-curtain-wall-system/
    glass-fin-curtain-wall-system/
    structural-silicone-glazed-ssg-stick-system/
    unitised-stick-hybrid-semi-unitised-system/
    unitised-curtain-wall-system/
    spider-glazing-system/
    routel-supported-glass-system/
    cable-net-system/
    slab-to-slab-window-wall-system/
    double-skin-facade-system/
    adaptive-dynamic-facade-system/
    blast-resistant-curtain-wall-system/
    fire-rated-curtain-wall-system/
  entrance-door/
    pivot-door-system/
    automatic-sliding-door-system/
    revolving-door-system/
  balcony-door/
    aluminium-swing-door-system/
    lift-and-slide-door-system/
  screen/
    mesh-screen/
    frosted-glass/
  mep-louver/
    vertical-mep-louver/
    horizontal-mep-louver/
  louver-fin/
    extruded-aluminium-louver/
    cladded-metal-louver/
```

Each folder also gets a `.gitkeep` so the empty directories are committed to git.

---

## 4. Image Lightbox Modal (`#modal-refimg`)

### 4a. HTML structure

A new modal backdrop `#modal-refimg` placed after `#modal-system` in the HTML. It is a full-viewport overlay (z-index above `#modal-system`).

```
┌─────────────────────────────────────────┐
│  ← Back    Cable Railing Balustrade…    │  ← header
├─────────────────────────────────────────┤
│  ┌───────┐ ┌───────┐ ┌───────┐          │
│  │ img 1 │ │ img 2 │ │ img 3 │          │  ← thumbnail grid
│  └───────┘ └───────┘ └───────┘          │    (2–3 col, responsive)
│                                         │
│  ┌─────────────────────────────────────┐│
│  │         (enlarged image)            ││  ← large preview, hidden
│  └─────────────────────────────────────┘│    until thumbnail clicked
│                                         │
│  [No reference images yet — add…]       │  ← empty state (if no images)
├─────────────────────────────────────────┤
│              [Back]  [Choose this system]│  ← footer
└─────────────────────────────────────────┘
```

### 4b. CSS

- Reuses existing `--modal-backdrop`, `.modal`, `.modal-wide` styles.
- New classes: `.refimg-grid`, `.refimg-thumb`, `.refimg-thumb.active`, `.refimg-preview`, `.refimg-empty`.
- Thumbnail aspect ratio 4:3, `object-fit: cover`, hover border highlight.
- Preview image full-width, max-height ~50vh, hidden when no thumbnail is selected.

### 4c. JS — `openRefImages(systemId, optionLabel)`

**Pre-requisite:** `normalizeFacadeOption()` must be updated to pass through `ref_images`:
```js
return { label, tags, note, ref_images: opt.ref_images || [], systemId };
```
This means `SYSTEM_SUGGESTIONS[systemId]` entries will carry `ref_images`.

1. Look up the option object: `SYSTEM_SUGGESTIONS[systemId].find(o => o.label === optionLabel)`.
2. Populate `#modal-refimg`: set title to `optionLabel`, render thumbnails from `ref_images`.
3. If `ref_images` is empty, show empty-state message; hide grid + preview.
4. Store `{ systemId, optionLabel }` on the modal's dataset for use by "Choose this system".
5. Open the modal (`classList.add('open')`).

### 4d. JS — thumbnail click

Click a `.refimg-thumb` → set it as `.active`, show the full image in `.refimg-preview`.

### 4e. JS — "Choose this system" button (`confirmRefSelection()`)

1. Read `systemId` and `optionLabel` from modal dataset.
2. Set `CFG.finalSelections[systemId] = optionLabel`.
3. Close `#modal-refimg`.
4. Close `#modal-system`.
5. Call `buildConfigQuestions()` and `checkConfigComplete()` to refresh the main configurator page.

### 4f. JS — "Back" button

Closes `#modal-refimg` only; `#modal-system` stays open.

---

## 5. Trigger Points

### 5a. `sys-suggest-card` (inside `#modal-system`)

These are currently passive `<div>` elements rendered in `renderSystemQuestions()`. Change them to `<button>` or add `onclick="openRefImages('${id}', '${opt.label}')"` and `cursor: pointer`.

### 5b. `config-suggestion-card` (main configurator page)

Same cards rendered in `buildConfigQuestions()`. Add the same `onclick` handler.

### 5c. Visual feedback — chosen badge

On cards where `CFG.finalSelections[systemId] === opt.label`, add a small green "✓ Selected" chip in the card footer. Refresh whenever `buildConfigQuestions()` is called.

---

## 6. Out of Scope

- Uploading images from the browser UI (user drops files into the folder manually).
- Image captions editing UI.
- Lightbox zoom / pan.
- Any change to the question flow or scoring logic.
