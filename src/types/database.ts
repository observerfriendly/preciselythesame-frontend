export interface User {
  id: string
  email: string
  name?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description?: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface PreciselyTheSame {
  id: number
  created_at: string
}
