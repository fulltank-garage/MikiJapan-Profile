import { api } from '../lib/api'

export type RegisteredMember = {
  firstName: string
  lastName: string
  nickname: string
  phone: string
  citizenId: string
  shopPageUrl: string
}

export const fallbackMember: RegisteredMember = {
  firstName: 'มิกิ',
  lastName: 'เจแปน',
  nickname: 'มิกิ',
  phone: '0812345678',
  citizenId: '1234567890123',
  shopPageUrl: 'https://facebook.com/your-page',
}

export const getRegisteredMember = async () => {
  const endpoint = import.meta.env.VITE_MEMBER_PROFILE_ENDPOINT ?? '/auth/profile'
  const { data } = await api.get<RegisteredMember>(endpoint)

  return data
}
