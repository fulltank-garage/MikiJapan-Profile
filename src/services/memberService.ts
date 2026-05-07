import { api } from '../lib/api'

export type RegisteredMember = {
  id?: string
  firstName: string
  lastName: string
  nickname: string
  phone: string
  citizenId: string
  shopPageUrl: string
  storefrontImage?: string
  storefrontImageUrl?: string
  status?: string
  lineUserId?: string
}

export const fallbackMember: RegisteredMember = {
  firstName: 'มิกิ',
  lastName: 'เจแปน',
  nickname: 'มิกิ',
  phone: '0812345678',
  citizenId: '1234567890123',
  shopPageUrl: 'https://facebook.com/your-page',
  storefrontImageUrl: '',
}

const profileEndpoint = '/auth/profile'

const getFirstValue = (...values: Array<string | null | undefined>) =>
  values.find((value) => value?.trim())?.trim()

const getProfileParams = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const lineUserId = getFirstValue(
    searchParams.get('lineUserId'),
    searchParams.get('line_user_id'),
    import.meta.env.VITE_LINE_USER_ID,
  )
  const lineIdToken = getFirstValue(
    searchParams.get('lineIdToken'),
    searchParams.get('line_id_token'),
    import.meta.env.VITE_LINE_ID_TOKEN,
  )
  const id = getFirstValue(searchParams.get('id'), import.meta.env.VITE_MEMBER_ID)

  return {
    ...(lineUserId ? { lineUserId } : {}),
    ...(lineIdToken ? { lineIdToken } : {}),
    ...(id ? { id } : {}),
  }
}

export const getRegisteredMember = async () => {
  const { data } = await api.get<RegisteredMember>(profileEndpoint, {
    params: getProfileParams(),
  })

  return data
}
