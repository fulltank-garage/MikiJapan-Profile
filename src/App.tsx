import { useEffect, useState } from 'react'
import {
  fallbackMember,
  getRegisteredMember,
  type RegisteredMember,
} from './services/memberService'

type LoadState = 'loading' | 'ready' | 'fallback'

type MemberField = {
  label: string
  value: string
  href?: string
}

const memberEndpoint = import.meta.env.VITE_MEMBER_PROFILE_ENDPOINT

const statusText: Record<LoadState, string> = {
  loading: 'กำลังโหลดข้อมูล',
  ready: 'ข้อมูลสมาชิก',
  fallback: 'ข้อมูลตัวอย่าง',
}

const getMemberFields = (member: RegisteredMember): MemberField[] => [
  { label: 'ชื่อ', value: member.firstName },
  { label: 'นามสกุล', value: member.lastName },
  { label: 'ชื่อเล่น', value: member.nickname },
  { label: 'เบอร์โทร', value: member.phone },
  { label: 'เลขบัตรประชาชน', value: member.citizenId },
  {
    label: 'ลิงก์ร้าน/เพจ',
    value: member.shopPageUrl,
    href: member.shopPageUrl,
  },
]

function App() {
  const [member, setMember] = useState<RegisteredMember>(fallbackMember)
  const [loadState, setLoadState] = useState<LoadState>(
    memberEndpoint ? 'loading' : 'fallback',
  )

  useEffect(() => {
    if (!memberEndpoint) {
      return
    }

    let ignore = false

    getRegisteredMember()
      .then((memberData) => {
        if (!ignore) {
          setMember(memberData)
          setLoadState('ready')
        }
      })
      .catch(() => {
        if (!ignore) {
          setLoadState('fallback')
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  const fullName = `${member.firstName} ${member.lastName}`.trim()
  const fields = getMemberFields(member)

  return (
    <main className="min-h-dvh bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 py-5">
        <header className="border-b border-[var(--color-border)] pb-5">
          <div className="flex items-center gap-3">
            <div className="grid size-12 shrink-0 place-items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-strong)] text-xl font-semibold text-[var(--color-primary-dark)] shadow-sm">
              み
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--color-muted)]">
                Miki Japan
              </p>
              <h1 className="truncate text-xl font-semibold text-[var(--color-text)]">
                ข้อมูลสมาชิก
              </h1>
            </div>
          </div>
        </header>

        <section className="py-5">
          <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase text-[var(--color-primary)]">
                  {statusText[loadState]}
                </p>
                <h2 className="mt-2 truncate text-2xl font-semibold text-[var(--color-text)]">
                  {fullName || '-'}
                </h2>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {member.nickname ? `ชื่อเล่น ${member.nickname}` : 'ไม่มีชื่อเล่น'}
                </p>
              </div>
            </div>

            <dl className="mt-5 divide-y divide-[var(--color-border)]">
              {fields.map((field) => (
                <div
                  className="grid gap-1 py-4 first:pt-0 last:pb-0"
                  key={field.label}
                >
                  <dt className="text-sm font-medium text-[var(--color-muted)]">
                    {field.label}
                  </dt>
                  <dd className="break-words text-base font-semibold leading-7 text-[var(--color-text)]">
                    {field.href ? (
                      <a
                        className="text-[var(--color-primary-dark)] underline decoration-[color:var(--color-primary)]/35 underline-offset-4"
                        href={field.href}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {field.value || '-'}
                      </a>
                    ) : (
                      field.value || '-'
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
