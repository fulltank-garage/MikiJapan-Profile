import { api } from '../lib/api'
import type { LineIdentity } from '../lib/liff'

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

const profileEndpoint = import.meta.env.VITE_MEMBER_PROFILE_ENDPOINT ?? '/auth/profile'

const getFirstValue = (...values: Array<string | null | undefined>) =>
  values.find((value) => value?.trim())?.trim()

const getProfileParams = (lineIdentity?: LineIdentity) => {
  const searchParams = new URLSearchParams(window.location.search)
  const lineUserId = getFirstValue(
    searchParams.get('lineUserId'),
    searchParams.get('line_user_id'),
    import.meta.env.VITE_LINE_USER_ID,
    lineIdentity?.lineUserId,
  )
  const lineIdToken = getFirstValue(
    searchParams.get('lineIdToken'),
    searchParams.get('line_id_token'),
    import.meta.env.VITE_LINE_ID_TOKEN,
    lineIdentity?.lineIdToken,
  )
  const id = getFirstValue(searchParams.get('id'), import.meta.env.VITE_MEMBER_ID)

  return {
    ...(lineUserId ? { lineUserId } : {}),
    ...(lineIdToken ? { lineIdToken } : {}),
    ...(id ? { id } : {}),
  }
}

export const getRegisteredMember = async (lineIdentity?: LineIdentity) => {
  const { data } = await api.get<RegisteredMember>(profileEndpoint, {
    params: getProfileParams(lineIdentity),
    headers: getLineHeaders(lineIdentity),
  })

  return data
}

const getLineHeaders = (lineIdentity?: LineIdentity) => {
  const headers: Record<string, string> = {}

  if (lineIdentity?.lineUserId) {
    headers['X-Line-User-Id'] = lineIdentity.lineUserId
  }
  if (lineIdentity?.lineIdToken) {
    headers['X-Line-ID-Token'] = lineIdentity.lineIdToken
  }
  if (lineIdentity?.lineDisplayName) {
    headers['X-Line-Display-Name'] = lineIdentity.lineDisplayName
  }
  if (lineIdentity?.linePictureUrl) {
    headers['X-Line-Picture-Url'] = lineIdentity.linePictureUrl
  }

  return headers
}
