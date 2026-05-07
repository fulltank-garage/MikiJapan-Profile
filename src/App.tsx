import { useEffect, useState } from 'react'
import mikiJapanLogo from './assets/miki-japan-logo.jpg'
import {
  fallbackMember,
  getRegisteredMember,
  type RegisteredMember,
} from './services/memberService'

type MemberField = {
  label: string
  value: string
  href?: string
}

const getDisplayValue = (value: string) => value || '-'

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

  useEffect(() => {
    let ignore = false

    getRegisteredMember()
      .then((memberData) => {
        if (!ignore) {
          setMember(memberData)
        }
      })
      .catch(() => undefined)

    return () => {
      ignore = true
    }
  }, [])

  const fields = getMemberFields(member)
  const storefrontImage = member.storefrontImageUrl ?? member.storefrontImage

  return (
    <main className="min-h-dvh bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
        <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[color:var(--color-surface)]/95 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+14px)] backdrop-blur">
          <div className="flex items-center gap-3">
            <img
              alt="Miki Japan"
              className="size-10 shrink-0 rounded-full border border-[var(--color-border)] object-cover shadow-sm"
              height="40"
              src={mikiJapanLogo}
              width="40"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--color-muted)]">
                Miki Japan
              </p>
              <h1 className="truncate text-lg font-semibold text-[var(--color-text)]">
                ข้อมูลสมาชิก
              </h1>
            </div>
          </div>
        </header>

        <section className="flex-1 px-4 py-5">
          <div className="mb-5">
            <p className="text-[15px] leading-6 text-[var(--color-muted)]">
              ข้อมูลผู้สมัคร ลิงก์ร้านหรือเพจ และรูปหน้าร้านสำหรับติดต่อกลับ
            </p>
          </div>

          <div className="space-y-4 pb-[calc(env(safe-area-inset-bottom)+24px)]">
            <div className="grid grid-cols-2 gap-3">
              {fields.slice(0, 2).map((field) => (
                <div
                  className="block text-sm font-medium text-[var(--color-text)]"
                  key={field.label}
                >
                  {field.label}
                  <div className="mt-1.5 flex min-h-12 w-full items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-base text-[var(--color-text)]">
                    <span className="break-words">
                      {getDisplayValue(field.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {fields.slice(2).map((field) => (
              <div
                className="block text-sm font-medium text-[var(--color-text)]"
                key={field.label}
              >
                {field.label}
                <div className="mt-1.5 flex min-h-12 w-full items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-base text-[var(--color-text)]">
                  {field.href && field.value ? (
                    <a
                      className="break-all text-[var(--color-primary-dark)] underline decoration-[color:var(--color-primary)]/35 underline-offset-4"
                      href={field.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {field.value}
                    </a>
                  ) : (
                    <span className="break-words">
                      {getDisplayValue(field.value)}
                    </span>
                  )}
                </div>
              </div>
            ))}

            <div className="block text-sm font-medium text-[var(--color-text)]">
              รูปหน้าร้าน
              <div className="mt-1.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                {storefrontImage ? (
                  <img
                    alt="รูปหน้าร้าน"
                    className="aspect-[4/3] w-full rounded-xl object-cover"
                    src={storefrontImage}
                  />
                ) : (
                  <div className="grid aspect-[4/3] w-full place-items-center rounded-xl bg-[var(--color-surface-strong)] px-5 text-center text-sm leading-6 text-[var(--color-muted)]">
                    ยังไม่มีรูปหน้าร้าน
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
