/**
 * Rutas oficiales y seguras para los assets de ANAPSE VIDEO GAMES
 * Compatibles con Vite dev server y GitHub Pages (/ANAPSE-VIDEO-GAMES/)
 */

const getAssetUrl = (relativePath: string): string => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return encodeURI(`${cleanBase}${cleanPath}`);
};

export const ASSETS = {
  // Logo Gamer Oficial
  logo: getAssetUrl('assets/logos/Anapse Video Games_ Logo Gamer.png'),

  // Banner Panorámico Oficial (Héroes y mundos neón)
  banner: getAssetUrl('assets/banners/Héroes y mundos de videojuegos neón.png'),

  // Fondo Oficial (Valle fantástico de islas flotantes y cascadas)
  background: getAssetUrl('assets/backgrounds/Valle fantástico de islas flotantes y cascadas.png'),

  // Directorios
  dirs: {
    logos: getAssetUrl('assets/logos/'),
    banners: getAssetUrl('assets/banners/'),
    backgrounds: getAssetUrl('assets/backgrounds/'),
    games: getAssetUrl('assets/games/'),
    sprites: getAssetUrl('assets/sprites/'),
  },

  // Helper para construir URLs dinámicas de assets de juegos o sprites
  url: getAssetUrl,
};
