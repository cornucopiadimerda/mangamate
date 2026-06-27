export interface Series {
  id: string
  title: string
  titleEN?: string
  author: string
  genres: string[]
  status: 'ongoing' | 'completed' | 'hiatus'
  totalVolumes: number | null
  coverUrl: string
  malId?: number
  description: string
  publisher: string
  language: string
  pricePerVolume?: number
}

export interface Volume {
  id: string
  seriesId: string
  number: number
  isbn?: string
  publisher: string
  language: string
  edition: string
  coverUrl: string
  releaseDate?: string
}

export interface CollectionEntry {
  id: string
  seriesId: string
  volumeNumber: number
  volumeId?: string
  addedAt: number
  condition: 'mint' | 'good' | 'fair' | 'poor'
  notes?: string
}

export interface WishlistEntry {
  id: string
  seriesId: string
  seriesTitle: string
  volumeNumber: number
  addedAt: number
}

export interface RecognitionResult {
  series: string
  volumeNumber: number
  language: string
  publisher: string
  edition: string
  isbn?: string
  author?: string
  confidence: number
  coverUrl?: string
}

export interface CollectionSeries extends Series {
  ownedVolumes: number[]
  missingVolumes: number[]
  completionPercent: number
}

export interface UserProfile {
  tagname: string
  displayName: string
  bio: string
  avatarColor: string
}
