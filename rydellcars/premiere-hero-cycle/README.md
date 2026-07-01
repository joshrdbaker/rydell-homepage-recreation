# Hero Video Cycle — Premiere Package

Media and a pre-cut sequence for the `hero-old-cars.html` background cycle.

## Contents

| File | Description |
|------|-------------|
| `media/1950.mp4` | Archive truck clip (1950s) |
| `media/1960.mp4` | Archive truck clip (1960s) |
| `media/1990.mp4` | Urban / Camaro-era clip |
| `media/bgVideo.mp4` | Original Rydell homepage hero video |
| `hero-video-cycle.xml` | Premiere import file with the web sequence already assembled |

## Open in Premiere Pro

1. Open **Adobe Premiere Pro**.
2. **File → New → Project…** (or open an existing project).
3. **File → Import…**
4. Select **`hero-video-cycle.xml`** in this folder.
5. Premiere creates a bin/sequence named **Hero Video Cycle (Web)** with all four sources and a 12.5s timeline:

   | Order | Clip | Duration |
   |-------|------|----------|
   | 1 | 1950 | 2.5s |
   | 2 | bgVideo — Silverado A (starts at 2s) | 2s |
   | 3 | 1960 | 2s |
   | 4 | bgVideo — Silverado B (starts at 8s) | 2s |
   | 5 | 1990 | 2s |
   | 6 | bgVideo — Equinox trio (starts at 14s) | 2s |

If Premiere asks to relink media, point it at the **`media/`** folder in this package.

## Regenerate the import file

If you move this folder or replace media, run:

```bash
python3 build-premiere-import.py
```

That rewrites `hero-video-cycle.xml` with updated file paths.

## Web reference

The live cycle logic lives in `../js/hero-video-cycle.js`.
