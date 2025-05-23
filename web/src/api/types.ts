export interface Bike {
  id: string
  model: string
  batteryLevel: number
  coordinates: [number, number]
}

export type ApiResponse<T> = {
  data: T
  success: boolean
}