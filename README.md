# 🐱 CatPark (花猫乐园)

> A modern, feature-rich Web GIS & Data Visualization dashboard based on Vue 3 ecosystem.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Vue](https://img.shields.io/badge/Vue-3.5+-4FC08D?logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-blue)

**CatPark** is a comprehensive tech demo and practice system designed to showcase advanced front-end capabilities, focusing on Geographic Information Systems (GIS), 3D visualization, and interactive dashboards.

## ✨ Features

- **🌐 Advanced GIS Integration**:
    - Built with **Leaflet** & **AMap (高德)** / **Tianditu (天地图)**.
    - Features: Path tracking, Migration effects, Heatmaps, Boundary clipping, and Geofencing.
- **🧊 3D Visualization**:
    - Integrated **TresJS** and **Three.js** for declarative 3D scenes.
    - Model loading (GLTF/GLB) and interactive controls.
- **📊 Data Dashboard**:
    - **ECharts 5** for complex data visualization.
    - Responsive grid layouts with Tailwind CSS.
- **🛠️ Modern Tech Stack**:
    - **Vue 3 (Script Setup)** + **TypeScript** for type-safe logic.
    - **Vite 6** for lightning-fast HMR and build.
    - **Pinia** for state management (with persistence).
    - **Element Plus** for elegant UI components.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 22
- pnpm >= 8.14

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/flyme.git

# Enter the directory
cd flyme

# Install dependencies
pnpm install
```

### Development
Start the local development server:

```bash
pnpm dev
```
> The app will run at `http://localhost:8848` (configurable in `.env`).

### Build
Build for production:

```bash
pnpm build
```

## 🛠️ Technology Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Core** | [Vue 3](https://v3.vuejs.org/) | Progressive JavaScript Framework |
| **Build Tool** | [Vite](https://vitejs.dev/) | Next Generation Frontend Tooling |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | JavaScript with syntax for types |
| **UI Framework** | [Element Plus](https://element-plus.org/) | Vue 3 UI Library |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| **State Management** | [Pinia](https://pinia.vuejs.org/) | Intuitive store for Vue |
| **Maps / GIS** | [Leaflet](https://leafletjs.com/) | Open-source JavaScript library for mobile-friendly interactive maps |
| **3D Engine** | [TresJS](https://tresjs.org/) | Declarative ThreeJS for Vue |
| **Visualization** | [ECharts](https://echarts.apache.org/) | Powerful charting and visualization library |
| **Utilities** | [VueUse](https://vueuse.org/) | Collection of essential Vue Composition Utilities |

## 📂 Project Structure

```text
src/
├── assets/         # Static assets (images, fonts)
├── components/     # Global reusable components
├── directives/     # Custom Vue directives
├── layout/         # App layout (Header, Sidebar, Main)
├── router/         # Vue Router configuration
├── store/          # Pinia stores
├── theme/          # Custom styles & variables
├── utils/          # Helper functions
├── views/          # Page views
│   ├── dashboard/  # Analytics dashboard
│   ├── gis/        # GIS map application
│   └── tresjs/     # 3D demos
└── App.vue         # Root component
```

## 🧠 Activity

![GitHub Activity Graph](https://github-readme-activity-graph.vercel.app/graph?username=Bing-b&theme=github-compact)

## 📄 License

MIT © [Bing-b](https://github.com/Bing-b)
