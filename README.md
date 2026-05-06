# Miki Japan Member Profile

React + TypeScript member display page built with Vite, Tailwind CSS, and axios.

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Data Shape

The page displays only the fields used by `MikiJapan-Register`:

```ts
type RegisteredMember = {
  firstName: string
  lastName: string
  nickname: string
  phone: string
  citizenId: string
  shopPageUrl: string
}
```

## API

Set the API host and read endpoint with:

```bash
VITE_API_BASE_URL=https://your-api.example.com/api
VITE_MEMBER_PROFILE_ENDPOINT=/auth/profile
```

If `VITE_MEMBER_PROFILE_ENDPOINT` is not set, the app uses fallback sample data while developing.
