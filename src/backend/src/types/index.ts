export interface CatProfile {
  id: string
  title: string
  sex: string
  ageRange: string
  area: string
  period: string
  url: string
  thumbNailUrl: string
  from: string
}

export interface PageInfo {
  total: number
  totalPages: number
  currentPage: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
  startCursor?: string
  endCursor?: string
}
