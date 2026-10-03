import { Game, Category, Proposal, Poll, Announcement } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'sin-categoria', name: 'Sin categoría', icon: 'FolderQuestion', order: 0, description: 'Juegos nuevos pendientes de clasificar' },
  { id: 'arcade', name: 'Arcade', icon: 'Gamepad2', order: 1, description: 'Juegos clásicos, reflejos rápidos y diversión directa' },
  { id: 'accion', name: 'Acción', icon: 'Sword', order: 2, description: 'Combates, disparos, esquives y adrenalina pura' },
  { id: 'aventura', name: 'Aventura', icon: 'Compass', order: 3, description: 'Exploración de mundos misteriosos e historias' },
  { id: 'puzzle', name: 'Puzzle', icon: 'Puzzle', order: 4, description: 'Rompecabezas, acertijos y desafíos lógicos' },
  { id: 'carreras', name: 'Carreras', icon: 'Trophy', order: 5, description: 'Velocidad en pistas futuristas y circuitos salvajes' },
  { id: 'casual', name: 'Casual', icon: 'Smile', order: 6, description: 'Partidas rápidas, relajantes y para todo público' },
  { id: 'animales', name: 'Animales', icon: 'Cat', order: 7, description: 'Aventuras con simpáticas mascotas y fauna heroica' },
  { id: 'estrategia', name: 'Estrategia', icon: 'Crown', order: 8, description: 'Tácticas, gestión y defensa de reinos' },
  { id: 'otros', name: 'Otros', icon: 'Sparkles', order: 9, description: 'Prototipos innovadores y géneros experimentales' },
];

// No hardcoded fake demo games! Games come exclusively from Firebase/Database.
export const INITIAL_GAMES: Game[] = [];

export const INITIAL_PROPOSALS: Proposal[] = [];

export const INITIAL_POLLS: Poll[] = [];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-welcome',
    title: '🎉 ¡Bienvenidos a ANAPSE VIDEO GAMES!',
    content: 'Plataforma independiente para descubrir, jugar y compartir videojuegos.',
    type: 'release',
    actionLabel: 'Ver Catálogo',
    actionUrl: '#games-section',
    active: true,
    createdAt: new Date().toISOString(),
  },
];
