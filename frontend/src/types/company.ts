/**
 * Type definitions for company data
 */

export interface Metric {
  name: string
  score: number
}

export interface ImportantPoint {
  sentiment: "Positive" | "Negative" | "Neutral"
  point: string
}

export interface CompanyApiResponse {
  oneline_desc: string
  privacy_rating_100: string
  data_rating_100: string
  clarity_rating_100: string
  overall_rating_100: string
  important_point_1?: ImportantPoint
  important_point_2?: ImportantPoint
  important_point_3?: ImportantPoint
}

export interface Company {
  id: string
  domain: string
  name: string
  logoUrl: string
  description: string
  metrics: Metric[]
  overallScore: number
  importantPoints?: ImportantPoint[]
}

export interface CompaniesResponse {
  companies: Company[]
  total: number
}
