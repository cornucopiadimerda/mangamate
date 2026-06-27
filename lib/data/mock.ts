import { Series, CollectionEntry, WishlistEntry } from '@/lib/types/manga.types'

export const MOCK_SERIES: Series[] = [
  {
    id: 'berserk',
    title: 'Berserk',
    author: 'Kentaro Miura',
    genres: ['Dark Fantasy', 'Action'],
    status: 'hiatus',
    totalVolumes: 42,
    malId: 2,
    coverUrl: 'https://cdn.myanimelist.net/images/manga/1/157897.jpg',
    description: 'Guts, il Guerriero Nero, intraprende un viaggio di vendetta contro il suo ex amico Griffith nel mondo oscuro di Midland.',
    publisher: 'Panini Comics',
    language: 'it',
  },
  {
    id: 'one-piece',
    title: 'One Piece',
    author: 'Eiichiro Oda',
    genres: ['Adventure', 'Action', 'Comedy'],
    status: 'ongoing',
    totalVolumes: 109,
    malId: 13,
    coverUrl: 'https://cdn.myanimelist.net/images/manga/2/253146.jpg',
    description: 'Monkey D. Luffy sogna di diventare il Re dei Pirati e trovare il leggendario tesoro chiamato "One Piece".',
    publisher: 'Star Comics',
    language: 'it',
  },
  {
    id: 'demon-slayer',
    title: 'Demon Slayer',
    author: 'Koyoharu Gotouge',
    genres: ['Action', 'Supernatural'],
    status: 'completed',
    totalVolumes: 23,
    malId: 96792,
    coverUrl: 'https://cdn.myanimelist.net/images/manga/3/179023.jpg',
    description: 'Tanjiro Kamado diventa un cacciatore di demoni per salvare sua sorella Nezuko, trasformata in un demone.',
    publisher: 'Star Comics',
    language: 'it',
  },
  {
    id: 'attack-on-titan',
    title: 'Attack on Titan',
    author: 'Hajime Isayama',
    genres: ['Action', 'Dark Fantasy', 'Post-Apocalyptic'],
    status: 'completed',
    totalVolumes: 34,
    malId: 23390,
    coverUrl: 'https://cdn.myanimelist.net/images/manga/2/37860.jpg',
    description: "L'umanità sopravvive dentro enormi mura per proteggersi dai Titani, creature gigantesche che divorano gli esseri umani.",
    publisher: 'Planet Manga',
    language: 'it',
  },
]

export const SERIES_COLORS: Record<string, { from: string; to: string; text: string }> = {
  'berserk': { from: '#1a0a00', to: '#3d1a00', text: '#C8860A' },
  'one-piece': { from: '#0a1a3d', to: '#1a3d7a', text: '#FFB800' },
  'demon-slayer': { from: '#1a0a1a', to: '#3d0a2e', text: '#E85D9C' },
  'attack-on-titan': { from: '#0a1a0a', to: '#1a3d1a', text: '#6BCB77' },
}

export const INITIAL_COLLECTION: CollectionEntry[] = [
  ...([1, 2, 3, 5, 6, 7].map(n => ({
    id: `berserk-${n}`,
    seriesId: 'berserk',
    volumeNumber: n,
    addedAt: Date.now() - (43 - n) * 86400000,
    condition: 'mint' as const,
  }))),
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `one-piece-${i + 1}`,
    seriesId: 'one-piece',
    volumeNumber: i + 1,
    addedAt: Date.now() - (55 - i) * 86400000,
    condition: 'good' as const,
  })),
  ...Array.from({ length: 23 }, (_, i) => ({
    id: `demon-slayer-${i + 1}`,
    seriesId: 'demon-slayer',
    volumeNumber: i + 1,
    addedAt: Date.now() - (25 - i) * 86400000,
    condition: 'mint' as const,
  })),
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `attack-on-titan-${i + 1}`,
    seriesId: 'attack-on-titan',
    volumeNumber: i + 1,
    addedAt: Date.now() - (35 - i) * 86400000,
    condition: 'good' as const,
  })),
]

export const INITIAL_WISHLIST: WishlistEntry[] = [
  { id: 'w1', seriesId: 'berserk', seriesTitle: 'Berserk', volumeNumber: 4, addedAt: Date.now() - 86400000 * 2 },
  { id: 'w2', seriesId: 'berserk', seriesTitle: 'Berserk', volumeNumber: 8, addedAt: Date.now() - 86400000 },
  { id: 'w3', seriesId: 'attack-on-titan', seriesTitle: 'Attack on Titan', volumeNumber: 16, addedAt: Date.now() - 86400000 * 3 },
  { id: 'w4', seriesId: 'attack-on-titan', seriesTitle: 'Attack on Titan', volumeNumber: 17, addedAt: Date.now() - 86400000 * 3 },
  { id: 'w5', seriesId: 'one-piece', seriesTitle: 'One Piece', volumeNumber: 51, addedAt: Date.now() - 86400000 * 5 },
]

export const MOCK_SCAN_RESULT = {
  series: 'Berserk',
  volumeNumber: 4,
  language: 'Italiano',
  publisher: 'Panini Comics',
  edition: 'Deluxe Edition',
  author: 'Kentaro Miura',
  isbn: '9788891282347',
  confidence: 0.97,
  coverUrl: 'https://covers.openlibrary.org/b/isbn/9788891282347-L.jpg',
}
