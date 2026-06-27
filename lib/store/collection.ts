'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CollectionEntry, WishlistEntry, CollectionSeries, UserProfile } from '@/lib/types/manga.types'
import { MOCK_SERIES, INITIAL_COLLECTION, INITIAL_WISHLIST } from '@/lib/data/mock'

interface CollectionState {
  collection: CollectionEntry[]
  wishlist: WishlistEntry[]
  favorites: string[]
  profile: UserProfile
  addVolume: (entry: CollectionEntry) => void
  addVolumes: (entries: CollectionEntry[]) => void
  removeVolume: (id: string) => void
  addToWishlist: (entry: WishlistEntry) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (seriesId: string, volumeNumber: number) => boolean
  toggleFavorite: (seriesId: string) => void
  isFavorite: (seriesId: string) => boolean
  updateProfile: (profile: Partial<UserProfile>) => void
  getSeriesCollection: (seriesId: string) => CollectionSeries | null
  getAllSeries: () => CollectionSeries[]
  getTotalVolumes: () => number
  getTotalSeries: () => number
  getCompletionRate: () => number
  getTotalMissing: () => number
  getEstimatedValue: () => number
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      collection: INITIAL_COLLECTION,
      wishlist: INITIAL_WISHLIST,
      favorites: ['berserk', 'one-piece'],
      profile: {
        tagname: '@collezionista',
        displayName: 'Alessandro',
        bio: 'Collezionista di manga dal 2010 🎌',
        avatarColor: '#FF3B30',
      },

      addVolume: (entry) =>
        set((state) => ({
          collection: state.collection.some(
            (e) => e.seriesId === entry.seriesId && e.volumeNumber === entry.volumeNumber
          )
            ? state.collection
            : [...state.collection, entry],
        })),

      addVolumes: (entries) =>
        set((state) => {
          const newEntries = entries.filter(
            (entry) => !state.collection.some(
              (e) => e.seriesId === entry.seriesId && e.volumeNumber === entry.volumeNumber
            )
          )
          return { collection: [...state.collection, ...newEntries] }
        }),

      removeVolume: (id) =>
        set((state) => ({ collection: state.collection.filter((e) => e.id !== id) })),

      addToWishlist: (entry) =>
        set((state) => ({
          wishlist: state.wishlist.some(
            (e) => e.seriesId === entry.seriesId && e.volumeNumber === entry.volumeNumber
          )
            ? state.wishlist
            : [...state.wishlist, entry],
        })),

      removeFromWishlist: (id) =>
        set((state) => ({ wishlist: state.wishlist.filter((e) => e.id !== id) })),

      isInWishlist: (seriesId, volumeNumber) =>
        get().wishlist.some((e) => e.seriesId === seriesId && e.volumeNumber === volumeNumber),

      toggleFavorite: (seriesId) =>
        set((state) => ({
          favorites: state.favorites.includes(seriesId)
            ? state.favorites.filter((id) => id !== seriesId)
            : [...state.favorites, seriesId],
        })),

      isFavorite: (seriesId) => get().favorites.includes(seriesId),

      updateProfile: (partial) =>
        set((state) => ({ profile: { ...state.profile, ...partial } })),

      getSeriesCollection: (seriesId) => {
        const series = MOCK_SERIES.find((s) => s.id === seriesId)
        if (!series) return null
        const { collection } = get()
        const owned = collection
          .filter((e) => e.seriesId === seriesId)
          .map((e) => e.volumeNumber)
          .sort((a, b) => a - b)
        const total = series.totalVolumes ?? Math.max(...owned, 0)
        const missing = Array.from({ length: total }, (_, i) => i + 1).filter((n) => !owned.includes(n))
        return {
          ...series,
          ownedVolumes: owned,
          missingVolumes: missing,
          completionPercent: total > 0 ? Math.round((owned.length / total) * 100) : 0,
        }
      },

      getAllSeries: () => {
        const { collection } = get()
        return MOCK_SERIES.map((series) => {
          const owned = collection
            .filter((e) => e.seriesId === series.id)
            .map((e) => e.volumeNumber)
            .sort((a, b) => a - b)
          const total = series.totalVolumes ?? Math.max(...owned, 0)
          const missing = Array.from({ length: total }, (_, i) => i + 1).filter((n) => !owned.includes(n))
          return {
            ...series,
            ownedVolumes: owned,
            missingVolumes: missing,
            completionPercent: total > 0 ? Math.round((owned.length / total) * 100) : 0,
          }
        }).filter((s) => s.ownedVolumes.length > 0)
      },

      getTotalVolumes: () => get().collection.length,
      getTotalSeries: () => new Set(get().collection.map((e) => e.seriesId)).size,
      getCompletionRate: () => {
        const all = get().getAllSeries()
        if (!all.length) return 0
        return Math.round(all.reduce((sum, s) => sum + s.completionPercent, 0) / all.length)
      },
      getTotalMissing: () => {
        return get().getAllSeries().reduce((sum, s) => sum + s.missingVolumes.length, 0)
      },
      getEstimatedValue: () => {
        // Average Italian manga price ~€8
        return get().collection.length * 8
      },
    }),
    { name: 'mangamate-collection' }
  )
)
