# Momin Affan // Senior Graphic Designer & Prepress Specialist Portfolio

A premium, highly interactive digital portfolio demonstrating elite expertise in professional commercial packaging dielines, large-scale flex billboards, vector-cut layouts, and brand identity designs.

---

## 🛠️ Technology Stack
* **Frontend**: React 19, TypeScript, Vite
* **Animations**: Framer Motion (Liquid Springs, Scroll Transforms, Compositor Layers)
* **Styling**: Tailwind CSS v4
* **Icons**: Lucide Icons
* **Design Systems**: Custom light/dark themes with fluid paper typography and glassmorphism.

---

## 🎨 Core Visual & Interactive Features

### 1. Interactive Prepress Studio
* Spawns dynamic CMYK/RGB ink droplets with click-to-ring coordinate tracking.
* Ink sweep squeegee sweep animations transitioning between color profiles to represent physical press curing.

### 2. Packaging Fold Simulator
* Interactive 3D folding carton box simulation allowing structural designers to fold/unfold layout cards dynamically.

### 3. Real Design Print Archives
* Showcase of 79 high-fidelity production-ready templates (Packaging, Banners, Posters, Pamphlets, Logos).
* Multiple layout routers:
  * **Dynamic Grid View** with early activation intersection scroll limits.
  * **Interactive 3D Carousel** with spring physics.
  * **Infinite Scrolling Marquees** for alternating rows.
  * **Single Image Inspector** with full zoom scaling toggles and quick prev/next navigation.
* Integrated backdrop click-to-close with image-anchored close button overlay trackers.

### 4. Custom Vector Calibrations
* Dashed alignment lines, corner crosses, and status stamps (`STATUS: PRESS READY // ARCHIVED OK`) draw themselves dynamically on viewport scroll to represent technical CorelDRAW prepress environments.
* Typography magnetism: Interactive mouse-displacement letter offset springs on headers.

---

## ⚡ Scrolling & Performance Optimization
* **Composited Layers**: Ambient background gradient blurs run via hardware-accelerated 3D transforms (`translate3d`), moving scroll frames from CPU to GPU without triggering layout reflows.
* **Liquid Blur Bounds**: Backdrop filters are isolated strictly to primary overlays, with touch devices running fast translucent layers (paint speeds optimized over 10x).
* **Asset Compression**: Raw high-resolution Megapixel TIFF/JPEG assets compressed to optimized web specifications, reducing build weight from **447 MB down to 16.4 MB** (96.3% size reduction).

---

## 🚀 Run Locally

### Prerequisites
* Node.js (v18+)
* npm

### Steps
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the local development server**:
   ```bash
   npm run dev
   ```

3. **Build the production package**:
   ```bash
   npm run build
   ```
