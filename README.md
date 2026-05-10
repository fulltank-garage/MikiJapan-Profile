# Miki Japan Member Profile

React + TypeScript member display page built with Vite, Tailwind CSS, and axios.

## Scripts

Use Node.js 24.x.

```bash
npm install
npm run dev
npm run build
```

## Data Shape

The page displays only the fields used by `MikiJapan-Register`:

```ts
type RegisteredMember = {
  id?: string
  firstName: string
  lastName: string
  nickname: string
  phone: string
  citizenId: string
  shopPageUrl: string
  storefrontImage?: string
  storefrontImageUrl?: string
}
```

## API

Set the API host with:

```bash
VITE_API_BASE_URL=https://your-api.example.com/api
VITE_MEMBER_PROFILE_ENDPOINT=/auth/profile
VITE_LIFF_ID=2010003223-KfDmnya6
```

The profile page calls the `MikiJapan-Api` profile router:

```text
GET /api/auth/profile
```

The LIFF app sends `lineUserId` and `lineIdToken` to the API with request headers. For local dev, supported lookup values can still be passed by URL query or Vite env:

Production builds require `VITE_API_BASE_URL`; local `http://localhost:8080/api` is only used in dev mode.

```text
?lineUserId=<LINE_USER_ID>
?lineIdToken=<LIFF_ID_TOKEN>
?id=<MEMBER_ID>
```

```bash
VITE_LINE_USER_ID=<LINE_USER_ID>
VITE_LINE_ID_TOKEN=<LIFF_ID_TOKEN>
VITE_MEMBER_ID=<MEMBER_ID>
```
