# Unstill Life: Lavalandschaft

Seminararbeit im Kurs **3D-Rendering & Computational Art** von Shyue-Shyang Alexander Ho.

## Projektidee

Ziel ist die computergrafische Simulation einer vulkanischen Lavalandschaft als interaktives Stillleben, das sich langsam und subtil verändert. Die Szene besteht aus einem fließenden Lavafluss auf prozeduralem Terrain, einer roten Sonne sowie einer optionalen Aschewolke — und verbindet technische Simulation mit einer meditativen, minimalistischen Ästhetik.

### Kernelemente

- **Lavafluss** — Modellierung via Metaballs, Polygonisierung mit Marching Cubes, animiert durch zeitabhängige Metaball-Parameter und Perlin-Noise; PBR-Materialien für die glühende Oberfläche
- **Terrain** — prozedural via Noise generiert, Normal- und Displacement-Mapping, PBR-Texturierung
- **Sonne** — Point Light mit Fresnel-Effekt, beeinflusst Beleuchtung und Reflexionen dynamisch
- **Aschewolke** *(optional)* — prozedurale Generierung, variable Dichte und Bewegung; optional Screen-Space-Post-Processing für Ruß- und Schmutzeffekte

### Kamera & Interaktion

Die Kamera läuft wahlweise autonom (wechselnde Perspektiven) oder unter manueller Steuerung. Szenenparameter wie Lichtintensität der Lava, Raumhelligkeit, Sonnenfarbe und Aschewolkendichte sind konfigurierbar.

### Audio

Atmosphärische Umgebungsgeräusche (Lavarauschen, Vulkangrollen) unterstützen die meditative Stimmung der Szene.

## Projekt-Setup

### Voraussetzungen

- [Node.js](https://nodejs.org/) (v18 oder neuer)

### Installation

```bash
npm install
```

### Entwicklungsserver starten

```bash
npm run dev
```

Öffne anschließend [http://localhost:5173](http://localhost:5173) im Browser.

### Produktions-Build

```bash
npm run build
npm run preview
```

## Technologien

| Paket | Zweck |
|-------|-------|
| [Three.js](https://threejs.org/) | 3D-Rendering |
| [Vue.js](https://vuejs.org/) + [Vue Router](https://router.vuejs.org/) | Landing Page & Routing |
| [Vite](https://vitejs.dev/) | Build-Tool & Dev-Server |

## Coding Guidelines

Gilt für den gesamten `src/`-Code inkl. Tests (`__tests__/`, `e2e/`):

- **Variablen**: `snake_case` (z.B. `metaball_y_offset`, `ground_parameters`).
- **Konstanten** (Werte, die nie neu zugewiesen werden): `UPPER_SNAKE_CASE` (z.B. `MAX_BALLS`, `LIGHT_WORLD_POSITION`). Ein `const`-Binding auf ein mutierbares State-Objekt (z.B. `settings`) ist keine Konstante in diesem Sinne und bleibt lowercase.
- **Funktionen/Methoden**: `camelCase` (z.B. `createMetaballs`, `setupGui`), unabhängig davon ob per `function`-Deklaration oder als Arrow-Function einer `const` zugewiesen.
- **Keine Abkürzungen.** Namen voll ausschreiben (`callback` statt `cb`, `parameters` statt `params`, `position` statt `pos`, `value` statt `v`). Ausnahme: feststehende Fachbegriffe/Standardakronyme (`hex`, `JSON`, `URL`, `DOM`, Bibliotheksnamen wie `THREE`/`GUI`), klassische Schleifenzähler (`i`, `j`) und Koordinatenbuchstaben (`x`, `y`, `z`, `r`, `g`, `b`).
- **Sprache**: Code (Bezeichner, Kommentare) wird auf Englisch geschrieben. Ausnahme: sichtbare GUI-Texte (z.B. dat.gui-Labels in `ui/gui.js`) bleiben deutsch, da sie die Bedienoberfläche für deutschsprachige Nutzer darstellen.

---

# Unstill Life: Lava Landscape

Seminar project for the course **3D-Rendering & Computational Art** by Shyue-Shyang Alexander Ho.

## Project Idea

The goal is to computationally simulate a volcanic lava landscape as an interactive still life that changes slowly and subtly over time. The scene combines a flowing lava stream on procedural terrain, a red sun, and an optional ash cloud — merging technical simulation with a meditative, minimalist aesthetic.

### Core Elements

- **Lava flow** — modelled with Metaballs, polygonised via Marching Cubes, animated through time-dependent Metaball parameters and Perlin Noise; PBR materials for the glowing surface
- **Terrain** — procedurally generated via Noise, Normal and Displacement Mapping, PBR texturing
- **Sun** — Point Light with Fresnel effect, dynamically influencing lighting and reflections
- **Ash cloud** *(optional)* — procedural generation, variable density and motion; optional Screen-Space Post-Processing for soot and grime effects

### Camera & Interaction

The camera operates either autonomously (cycling through different perspectives) or under manual user control. Scene parameters such as lava light intensity, ambient brightness, sun colour, and ash cloud density are configurable.

### Audio

Atmospheric ambient sounds (lava rushing, volcanic rumbling) reinforce the meditative mood of the scene.

## Project Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)

### Installation

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## Technologies

| Package | Purpose |
|---------|---------|
| [Three.js](https://threejs.org/) | 3D rendering |
| [Vue.js](https://vuejs.org/) + [Vue Router](https://router.vuejs.org/) | Landing page & routing |
| [Vite](https://vitejs.dev/) | Build tool & dev server |

## Coding Guidelines

Applies to all `src/` code, including tests (`__tests__/`, `e2e/`):

- **Variables**: `snake_case` (e.g. `metaball_y_offset`, `ground_parameters`).
- **Constants** (values that are never reassigned): `UPPER_SNAKE_CASE` (e.g. `MAX_BALLS`, `LIGHT_WORLD_POSITION`). A `const` binding to a mutable state object (e.g. `settings`) is not a constant in this sense and stays lowercase.
- **Functions/methods**: `camelCase` (e.g. `createMetaballs`, `setupGui`), regardless of whether declared via `function` or assigned to a `const` as an arrow function.
- **No abbreviations.** Spell names out in full (`callback` instead of `cb`, `parameters` instead of `params`, `position` instead of `pos`, `value` instead of `v`). Exception: established technical terms/standard acronyms (`hex`, `JSON`, `URL`, `DOM`, library names like `THREE`/`GUI`), classic loop counters (`i`, `j`), and coordinate letters (`x`, `y`, `z`, `r`, `g`, `b`).
- **Language**: code (identifiers, comments) is written in English. Exception: user-facing GUI text (e.g. dat.gui labels in `ui/gui.js`) stays German, since that is the visible interface for German-speaking users.
