# Unstill Life: Lavalandschaft

Seminararbeit im Kurs **3D-Rendering & Computational Art** von Shyue-Shyang Alexander Ho.

Eine vulkanische Lavalandschaft als interaktives Stillleben, das nie ganz stillsteht: Lava quillt aus dem Krater und fließt in Wellen den Vulkan hinab, Rauch und Asche steigen auf, eine rote Sonne zieht ihre Bahn. Alles verändert sich so langsam, dass man es fast übersieht.

Im Mittelpunkt steht die **Main-Scene**, eine eigenständige Three.js-Szene. Startseite, Detailszenen und Vue.js bilden nur den Rahmen, um sie zu zeigen und zu erklären.

## Die Main-Scene

Die Main-Scene liegt vollständig in `src/scenes/main-scene/` und kommt ohne Vue aus. Sie besteht aus folgenden Elementen:

- **Lava aus Metaballs**
  - Eine Simulation auf der CPU lässt Kugeln in Wellen aus dem Krater austreten; jede bekommt eine zufällige Stärke, Geschwindigkeit und Richtung innerhalb eines von sechs Sektoren.
  - Das Feld jeder Kugel ist `max(0, 4·s / r² − k)`. Durch das abgezogene `k` wirkt jede Kugel nur in ihrer Umgebung, die Lavaoberfläche liegt dort, wo die Summe den Schwellwert erreicht.
  - Das Feld wird in eine 3D-Textur geschrieben und im Fragment-Shader per Raymarching mit anschließender Bisektion abgetastet. Der Shader schreibt die Tiefe, damit die Lava korrekt mit Vulkan und Boden verdeckt.
  - Noise färbt die Oberfläche zwischen heißer und abgekühlter Lava, Bump-Mapping raut sie auf, Displacement-Mapping lässt die abgekühlte Kruste hervortreten.
- **Vulkan**: ein Rotationskörper aus einem Höhenprofil, dessen Oberfläche ein auf der CPU berechnetes Rissmuster aus Noise absenkt. In diesen Senken wird die darunterliegende Lava sichtbar.
- **Boden**: eine durch Noise verformte Ebene mit glühenden Rissen, die zum Rand hin seltener werden. Am Horizont geht der Boden in die Himmelsfarbe über, sodass die Landschaft unendlich wirkt.
- **Sonne und God Rays**: Eine Sonne umkreist die Landschaft und färbt Vulkan, Boden und Rauch. Ein eigener Nachbearbeitungsschritt verwischt ein Bild, in dem nur die Sonne hell ist, radial zu Lichtstrahlen; Vulkan und Boden verdecken sie.
- **Bloom**: lässt Lava, Risse und Glut nachleuchten.
- **Rauch und Asche**: bis zu 2000 Teilchen, deren Bahn vollständig im Shader aus der Zeit berechnet wird. Glutteilchen kühlen beim Aufsteigen ab, und in Eruptionspausen wird der Rauch dünner.
- **Interaktion**: Im Interaktionsmodus lässt sich die Lava berühren. Der Vulkan gibt an der Stelle nach, die berührte Kugel schrumpft, und Rauch steigt auf.
- **Kamera**: Im autonomen Modus wandert die Kamera nach einer Weile ohne Eingabe langsam von selbst um den Vulkan; sonst lässt sie sich frei drehen und zoomen.
- **Audio**: vollständig mit der Web Audio API erzeugt, ohne Audiodateien: Lavarauschen, Knistern, Vulkangrollen, ein dumpfer Schlag bei jeder neuen Kugel und ein Zischen beim Berühren. Die Lautstärke hängt vom Abstand der Kamera ab.
- **Startzustand**: Beim Laden wird die Lava zwei Stunden Szenenzeit vorgespult, damit die Szene nie leer beginnt. Ein fester Zufalls-Seed macht den Startzustand reproduzierbar.

## Der Rahmen: Startseite und Detailszenen

Der Rahmen ist mit Vue 3 und Vue Router gebaut und liegt außerhalb der Main-Scene:

- **Startseite**: Vorschau der Main-Scene, Projektbeschreibung und Sprachwahl (Englisch/Deutsch). Ein Klick auf eine Vorschau zoomt in die Szene hinein, beim Zurückkehren schrumpft ein aktuelles Bild der Szene zurück in die Vorschau.
- **Detailszenen**: zehn nummerierte Szenen, die die Main-Scene Schritt für Schritt erklären, jede mit eigener Bedienoberfläche und Beschreibung:

  | Nr. | Szene | Thema |
  |---|---|---|
  | 1 | Metaballs | schwebende Kugeln, die miteinander verschmelzen |
  | 2 | Noise | Färbung der Lava durch Noise |
  | 3 | Oberflächenunebenheiten | Bump- und Displacement-Mapping |
  | 4 | Lava mit Bloom-Effekt auf dem Boden | Lava auf einer Bodenplatte, Bloom |
  | 5 | Vulkan als Lathe, Lavafluss auf einer Geraden | vereinfachter Vulkan, Lava auf einer Geraden |
  | 6 | Vom einzelnen Metaball zum Lavafluss | Lava in alle Richtungen, Abbremsen, Sektoren |
  | 7 | Vulkan mit Oberflächenunebenheiten | Vulkan und Lava der Main-Scene |
  | 8 | Rauch und Asche | Rauch- und Glutteilchen |
  | 9 | Lavalandschaft | rissiger Boden und Nebel |
  | 10 | Sonne und God Rays | Sonne und Lichtstrahlen |

  Die Szenen 7–10 verwenden direkt die Objekte der Main-Scene. Szenen, die auf derselben Szene aufbauen, teilen sich eine Engine: 1–4, 5–6 und 7–10. Ein Wechsel innerhalb einer Gruppe baut nichts neu auf, und jede Szene behält dabei ihre eigenen Einstellungen.

Damit die Seite flüssig bleibt, werden Szenen nur vorbereitet, wenn der Mauszeiger auf ihrer Vorschau liegt und gerade nicht gescrollt wird, und die Main-Scene wird dabei in kleinen Schritten aufgebaut. Eine Szene rendert nur, solange sie sichtbar ist.

## Projektstruktur

```
src/
├── scenes/
│   ├── main-scene/        Kern: die Lavalandschaft (Three.js, ohne Vue)
│   │   ├── animation/     Lava-, Rauch-, Kamera- und Interaktionsanimation
│   │   ├── geometry/      Vulkan, Boden, Metaball-Box, Noise auf der CPU
│   │   ├── objects/       Szenenobjekte (Vulkan, Boden, Lava, Rauch, Sonne …)
│   │   ├── rendering/     Materialien, 3D-Feldtextur, God Rays, Bloom
│   │   ├── shaders/       GLSL-Shader
│   │   ├── audio/         erzeugte Klänge
│   │   ├── ui/            Bedienoberfläche (dat.gui)
│   │   └── config.js, default_settings.json
│   └── detail-scenes/     Rahmen: die zehn Detailszenen
│       ├── shared/        gemeinsame Engine, Szenengruppen, GUI-Helfer
│       ├── metaballs/     Szenen 1–4 und die Beschreibung von Szene 1
│       ├── volcano/       Szenen 5–6
│       └── landscape/     Szenen 7–10
├── components/, views/    Vue-Komponenten und Seiten
├── ui/                    Texte (Englisch/Deutsch) und Sprachwahl
└── router.js, main.js
e2e/                       End-to-End-Tests (Playwright)
```

## Projekt-Setup

Voraussetzung ist [Node.js](https://nodejs.org/) ab Version 18.

```bash
npm install          # Abhängigkeiten installieren
npm run dev          # Entwicklungsserver, danach http://localhost:5173 öffnen
npm run build        # Produktions-Build
npm run preview      # Produktions-Build lokal ansehen
npm test             # Unit-Tests (Vitest)
npm run test:e2e     # End-to-End-Tests (Playwright)
```

## Technologien

| Paket | Zweck |
|-------|-------|
| [Three.js](https://threejs.org/) | 3D-Rendering der Szenen |
| [dat.gui](https://github.com/dataarts/dat.gui) | Bedienoberfläche der Szenen |
| [Vue.js](https://vuejs.org/) + [Vue Router](https://router.vuejs.org/) | Rahmen: Startseite, Detailszenen, Übergänge |
| [Vite](https://vitejs.dev/) | Build-Tool und Entwicklungsserver |
| [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) | Unit- und End-to-End-Tests |

## Coding Guidelines

Gilt für den gesamten `src/`-Code inkl. Tests (`__tests__/`, `e2e/`):

- **Variablen**: `snake_case` (z. B. `metaball_y_offset`, `ground_parameters`).
- **Konstanten** (Werte, die nie neu zugewiesen werden): `UPPER_SNAKE_CASE` (z. B. `MAX_BALLS`, `LIGHT_WORLD_POSITION`). Ein `const`-Binding auf ein veränderliches Zustandsobjekt (z. B. `settings`) ist keine Konstante in diesem Sinne und bleibt kleingeschrieben.
- **Funktionen/Methoden**: `camelCase` (z. B. `createMetaballs`, `setupGui`), unabhängig davon, ob per `function`-Deklaration oder als Arrow-Function einer `const` zugewiesen.
- **Keine Abkürzungen.** Namen voll ausschreiben (`callback` statt `cb`, `parameters` statt `params`, `position` statt `pos`, `value` statt `v`). Ausnahme: feststehende Fachbegriffe und Standardakronyme (`hex`, `JSON`, `URL`, `DOM`, Bibliotheksnamen wie `THREE`/`GUI`), klassische Schleifenzähler (`i`, `j`) und Koordinatenbuchstaben (`x`, `y`, `z`, `r`, `g`, `b`).
- **Sprache**: Code (Bezeichner, Kommentare) ist englisch. Sichtbare Texte (Startseite, dat.gui-Beschriftungen) stehen nicht im Code, sondern in `ui/messages.js` auf Englisch und Deutsch; Englisch ist die Standardsprache.

---

# Unstill Life: Lava Landscape

Seminar project for the course **3D-Rendering & Computational Art** by Shyue-Shyang Alexander Ho.

A volcanic lava landscape as an interactive still life that never quite stands still: lava wells up from the crater and flows down the volcano in waves, smoke and ash rise, a red sun moves along its orbit. Everything changes so slowly that you almost miss it.

At the heart of the project is the **main scene**, a self-contained Three.js scene. The landing page, the detail scenes and Vue.js are only the frame that presents and explains it.

## The Main Scene

The main scene lives entirely in `src/scenes/main-scene/` and does not depend on Vue. It is made of the following elements:

- **Lava made of metaballs**
  - A CPU simulation releases balls from the crater in waves; each gets a random strength, speed and direction within one of six sectors.
  - Each ball's field is `max(0, 4·s / r² − k)`. Subtracting `k` limits every ball to its surroundings; the lava surface lies where the sum reaches the threshold.
  - The field is written into a 3D texture and sampled in the fragment shader by raymarching followed by bisection. The shader writes depth, so the lava is correctly hidden by the volcano and the ground.
  - Noise colours the surface between hot and cooled lava, bump mapping roughens it and displacement mapping makes the cooled crust stand out.
- **Volcano**: a solid of revolution built from a height profile, whose surface is lowered by a crack pattern computed from noise on the CPU. The lava underneath shows through these hollows.
- **Ground**: a plane deformed by noise with glowing cracks that grow rarer towards the edge. At the horizon the ground blends into the sky colour, so the landscape seems endless.
- **Sun and god rays**: a sun circles the landscape and tints the volcano, the ground and the smoke. A custom post-processing pass blurs an image in which only the sun is bright radially into rays of light, blocked by the volcano and the ground.
- **Bloom**: makes lava, cracks and embers glow.
- **Smoke and ash**: up to 2000 particles whose paths are computed entirely in the shader from time. Embers cool down as they rise, and the smoke thins out during eruption pauses.
- **Interaction**: in interaction mode the lava can be touched. The volcano gives way at that point, the touched ball shrinks and smoke rises.
- **Camera**: in autonomous mode the camera slowly drifts around the volcano by itself after a while without input; otherwise it can be rotated and zoomed freely.
- **Audio**: generated entirely with the Web Audio API, without audio files: lava rushing, crackling, volcanic rumbling, a dull thump for every new ball and a hiss while touching. The volume depends on the camera's distance.
- **Initial state**: on load the lava is fast-forwarded by two hours of scene time, so the scene never starts empty. A fixed random seed makes the initial state reproducible.

## The Frame: Landing Page and Detail Scenes

The frame is built with Vue 3 and Vue Router and lives outside the main scene:

- **Landing page**: a preview of the main scene, the project description and a language switch (English/German). Clicking a preview zooms into the scene; on return, a current image of the scene shrinks back into the preview.
- **Detail scenes**: ten numbered scenes that explain the main scene step by step, each with its own controls and description:

  | No. | Scene | Topic |
  |---|---|---|
  | 1 | Metaballs | floating balls melting into each other |
  | 2 | Noise | colouring the lava with noise |
  | 3 | Surface irregularities | bump and displacement mapping |
  | 4 | Lava with bloom on the ground | lava on a ground plate, bloom |
  | 5 | Volcano as a lathe, lava flow along a straight line | simplified volcano, lava along a straight line |
  | 6 | From single metaballs to a lava flow | lava in all directions, slowing down, sectors |
  | 7 | Volcano with surface irregularities | the main scene's volcano and lava |
  | 8 | Smoke and ash | smoke and ember particles |
  | 9 | Lava landscape | cracked ground and fog |
  | 10 | Sun and god rays | sun and rays of light |

  Scenes 7–10 use the main scene's objects directly. Scenes built on the same setting share one engine: 1–4, 5–6 and 7–10. Switching within a group rebuilds nothing, and every scene keeps its own settings.

To keep the page smooth, scenes are only prepared while the pointer rests on their preview and the page is not being scrolled, and the main scene is built in small steps. A scene only renders while it is visible.

## Project Structure

```
src/
├── scenes/
│   ├── main-scene/        core: the lava landscape (Three.js, no Vue)
│   │   ├── animation/     lava, smoke, camera and interaction animation
│   │   ├── geometry/      volcano, ground, metaball box, noise on the CPU
│   │   ├── objects/       scene objects (volcano, ground, lava, smoke, sun …)
│   │   ├── rendering/     materials, 3D field texture, god rays, bloom
│   │   ├── shaders/       GLSL shaders
│   │   ├── audio/         generated sound
│   │   ├── ui/            controls (dat.gui)
│   │   └── config.js, default_settings.json
│   └── detail-scenes/     frame: the ten detail scenes
│       ├── shared/        shared engine, scene groups, GUI helpers
│       ├── metaballs/     scenes 1–4 and the description of scene 1
│       ├── volcano/       scenes 5–6
│       └── landscape/     scenes 7–10
├── components/, views/    Vue components and pages
├── ui/                    texts (English/German) and language switch
└── router.js, main.js
e2e/                       end-to-end tests (Playwright)
```

## Project Setup

Requires [Node.js](https://nodejs.org/) version 18 or newer.

```bash
npm install          # install dependencies
npm run dev          # development server, then open http://localhost:5173
npm run build        # production build
npm run preview      # view the production build locally
npm test             # unit tests (Vitest)
npm run test:e2e     # end-to-end tests (Playwright)
```

## Technologies

| Package | Purpose |
|---------|---------|
| [Three.js](https://threejs.org/) | 3D rendering of the scenes |
| [dat.gui](https://github.com/dataarts/dat.gui) | scene controls |
| [Vue.js](https://vuejs.org/) + [Vue Router](https://router.vuejs.org/) | frame: landing page, detail scenes, transitions |
| [Vite](https://vitejs.dev/) | build tool and development server |
| [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) | unit and end-to-end tests |

## Coding Guidelines

Applies to all `src/` code, including tests (`__tests__/`, `e2e/`):

- **Variables**: `snake_case` (e.g. `metaball_y_offset`, `ground_parameters`).
- **Constants** (values that are never reassigned): `UPPER_SNAKE_CASE` (e.g. `MAX_BALLS`, `LIGHT_WORLD_POSITION`). A `const` binding to a mutable state object (e.g. `settings`) is not a constant in this sense and stays lowercase.
- **Functions/methods**: `camelCase` (e.g. `createMetaballs`, `setupGui`), regardless of whether declared via `function` or assigned to a `const` as an arrow function.
- **No abbreviations.** Spell names out in full (`callback` instead of `cb`, `parameters` instead of `params`, `position` instead of `pos`, `value` instead of `v`). Exception: established technical terms and standard acronyms (`hex`, `JSON`, `URL`, `DOM`, library names like `THREE`/`GUI`), classic loop counters (`i`, `j`), and coordinate letters (`x`, `y`, `z`, `r`, `g`, `b`).
- **Language**: code (identifiers, comments) is written in English. User-facing text (landing page, dat.gui labels) is not hardcoded but lives in `ui/messages.js` in English and German; English is the default language.
