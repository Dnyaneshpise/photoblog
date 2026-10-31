/**
 * Shared TypeScript shapes matching the public API JSON.
 * Why: Pages stay type-safe without importing server code.
 */

export type CategorySummary = {
  id: string
  name: string
  slug: string
}

export type Photo = {
  id: string
  title: string
  description: string | null
  altText: string | null
  imageUrl: string
  thumbnailUrl: string | null
  width: number | null
  height: number | null
  location: string | null
  isFeatured: boolean
  sortOrder: number
  category: CategorySummary | null
  createdAt?: string
}

export type PhotosResponse = {
  data: Photo[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type PhotoResponse = {
  data: Photo
}

export type Category = CategorySummary & {
  publishedPhotoCount: number
}

export type CategoriesResponse = {
  data: Category[]
}

export type CoverPhoto = {
  id: string
  title: string
  imageUrl: string
  thumbnailUrl: string | null
  altText: string | null
  width: number | null
  height: number | null
}

export type CollectionSummary = {
  id: string
  title: string
  slug: string
  description: string | null
  sortOrder: number
  publishedPhotoCount: number
  coverPhoto: CoverPhoto | null
}

export type CollectionsResponse = {
  data: CollectionSummary[]
}

export type CollectionDetail = {
  id: string
  title: string
  slug: string
  description: string | null
  sortOrder: number
  photos: Array<
    Photo & {
      collectionSortOrder: number
    }
  >
}

export type CollectionDetailResponse = {
  data: CollectionDetail
}

export type PortfolioSettings = {
  photographerName: string
  tagline: string | null
  homepageIntro: string | null
  biography: string | null
  artistStatement: string | null
  profileImageUrl: string | null
  contactEmail: string | null
  socialLinks: Record<string, string> | null
  updatedAt: string
}

export type SettingsResponse = {
  data: PortfolioSettings
}

export type ContactSuccess = {
  data: {
    id: string
    createdAt: string
    message: string
  }
}
