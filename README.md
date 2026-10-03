# 🎮 ANAPSE VIDEO GAMES — Portal Central de Videojuegos

**ANAPSE VIDEO GAMES** es la plataforma web central y portal oficial de videojuegos desarrollados por **ANAPSE**.

Es un ecosistema integral que combina:
- 🕹️ **Catálogo interactivo de juegos gratuitos** listos para jugar en la web o celular.
- 🦊 **Juego embebido y minijuegos nativos** (ej. *FOX THIEF*, *Crazy Monkey Balloons*, *Fantastic Runner*).
- 💡 **Sistema de propuestas comunitarias** ("Propón un juego") con votación en tiempo real.
- 🗳️ **Encuestas dinámicas** ("¿Qué juego hacemos después?").
- 🏆 **Rankings y récords mundiales** por puntaje, tiempo y nivel.
- ❤️ **Sistema de apoyo y donaciones** comunitarias (S/ 3, S/ 5, S/ 10 o monto libre con mensajes públicos).
- 🤖 **Motor de mascota / sprite animado** configurable con nube flotante y globos de diálogo gamer.
- 🛡️ **Dashboard administrativo centralizado** de 14 módulos.
- 🔗 **ANAPSE GAME SPEC v1**: Manifiesto estándar `anapse-game.json` y sincronizador con GitHub y Firebase.

---

## 🚀 Inicio Rápido (Desarrollo Local)

### Requisitos
- Node.js 18+ o superior
- npm o bun

### Instalación
```bash
# 1. Clonar el repositorio
git clone https://github.com/anapse/anapse-video-games.git
cd anapse-video-games

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación se ejecutará en `http://localhost:3000`.

---

## 📦 Construcción para Producción

```bash
# Compilar TypeScript y empaquetar con Vite
npm run build

# Previsualizar el build de producción
npm run preview
```

Los archivos finales optimizados se generarán en la carpeta `dist/`.

---

## 📁 Estructura de Carpetas & Assets

```text
/
├── public/
│   └── assets/
│       ├── images/            # Imágenes generales del portal
│       ├── banners/           # Banners panorámicos (Héroes y mundos de videojuegos neón.png)
│       ├── logos/             # Logos gamer (Anapse Video Games_ Logo Gamer.png)
│       ├── games/             # Recursos organizados por gameId
│       │   ├── fox-thief/
│       │   │   ├── cover.png
│       │   │   ├── banner.png
│       │   │   └── screenshot-01.png
│       │   └── crazy-monkey-balloons/
│       ├── sprites/           # Spritesheets y animaciones
│       │   ├── mascot/        # Sprites de la mascota
│       │   ├── ui/            # Iconos y decoraciones UI
│       │   └── games/         # Sprites de minijuegos
│       ├── backgrounds/       # Fondos cyberpunk / gamer
│       └── animations/        # Efectos y frames
├── src/
│   ├── components/
│   │   ├── admin/             # Dashboard, Spec Sync, Editor de juegos
│   │   ├── games/             # Motores de juego 2D (FoxThiefMiniGame)
│   │   ├── Catalog.tsx        # Catálogo con filtros de estado y categorías
│   │   ├── GameCard.tsx       # Tarjetas Roblox-style
│   │   ├── GameDetailView.tsx # Ficha individual (/juegos/:slug)
│   │   ├── Header.tsx         # Navbar público con buscador
│   │   ├── MascotPet.tsx      # Motor configurable de mascota
│   │   ├── RobloxHomeView.tsx # Portada estructurada con filas de juegos
│   │   └── SupportView.tsx    # Portal de donaciones y muro público
│   ├── context/
│   │   ├── AuthContext.tsx    # Firebase Auth y control de 6 roles
│   │   └── GameDataContext.tsx# Estado central de juegos y sincronización
│   ├── lib/
│   │   ├── firebase.ts        # Inicialización de Firestore y Auth
│   │   └── initialData.ts     # Catálogo inicial de juegos y categorías
│   ├── services/
│   │   └── specValidator.ts   # Validador de anapse-game.json
│   └── types/
│       ├── anapseGameSpec.ts  # Contrato ANAPSE SPEC v1
│       └── index.ts           # Modelos de datos
├── firebase-applet-config.json
├── firebase-blueprint.json
├── firestore.rules
└── vite.config.ts
```

---

## 🛡️ Roles del Sistema

1. **ADMINISTRADOR:** Control total del portal (`elherreroanapse@gmail.com`).
2. **MAYORDOMO:** Operaciones de gestión según permisos asignados.
3. **EDITOR:** Registro y edición de juegos, categorías y contenidos.
4. **MODERADOR:** Moderación de comentarios, propuestas y comunidad.
5. **USUARIO:** Jugador registrado (likes, comentarios, votaciones y donaciones).
6. **VISITANTE:** Navegación y juego directo sin necesidad de registro.

---

## 📜 Estándar ANAPSE GAME SPEC v1

Cada juego desarrollado por ANAPSE puede incluir en su repositorio un archivo `anapse-game.json`:

```json
{
  "gameId": "fox-thief",
  "name": "FOX THIEF",
  "version": "1.2.4",
  "category": "Animales",
  "status": "published",
  "web": {
    "url": "https://anapse.github.io/fox-thief/",
    "allowEmbed": true
  },
  "repository": {
    "provider": "github",
    "owner": "anapse",
    "name": "fox-thief",
    "branch": "main"
  },
  "firebase": {
    "projectId": "fox-thief-prod",
    "databaseType": "firestore"
  },
  "collections": {
    "players": "players",
    "ranking": "rankings",
    "scores": "scores",
    "events": "gameEvents"
  },
  "ranking": {
    "enabled": true,
    "type": "score",
    "limit": 50,
    "scoreField": "score"
  }
}
```

El dashboard de ANAPSE analiza automáticamente el repositorio mediante el botón **"🔄 SINCRONIZAR REPOSITORIO"** y actualiza el catálogo central.

---

## 🌐 Despliegue en GitHub Pages / Hosting

1. En GitHub, crea el repositorio `anapse-video-games`.
2. Sube el código fuente:
   ```bash
   git add .
   git commit -m "feat: ANAPSE VIDEO GAMES Official Portal"
   git branch -M main
   git remote add origin https://github.com/anapse/anapse-video-games.git
   git push -u origin main
   ```
3. Configura GitHub Pages desde la pestaña *Settings > Pages* seleccionando GitHub Actions o la rama `gh-pages` tras ejecutar `npm run build`.

---

© 2026 **ANAPSE VIDEO GAMES**. Todos los derechos reservados.
