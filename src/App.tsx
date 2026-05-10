import { useCallback, useEffect, useState } from 'react'
import mikiJapanLogo from './assets/miki-japan-logo.jpg'
import { getLineIdentity, isLiffLoginRedirectError } from './lib/liff'
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

type MemberViewStatus = 'loading' | 'member' | 'pending' | 'rejected' | 'error'

const skeletonFieldRows = ['field-1', 'field-2', 'field-3', 'field-4']

const getDisplayValue = (value: string) => value || '-'

const getLoadErrorMessage = (error: unknown) => {
  const apiMessage = (
    error as { response?: { data?: { message?: string } } }
  )?.response?.data?.message

  return apiMessage ?? 'ไม่สามารถโหลดข้อมูลสมาชิกได้'
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

function MemberProfileSkeleton() {
  return (
    <div
      className="space-y-4 pb-[calc(env(safe-area-inset-bottom)+24px)]"
      role="status"
    >
      <span className="sr-only">กำลังโหลดข้อมูลสมาชิก</span>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="skeleton-shimmer h-4 w-14" />
          <div className="skeleton-shimmer mt-4 h-12 w-full" />
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="skeleton-shimmer h-4 w-20" />
          <div className="skeleton-shimmer mt-4 h-12 w-full" />
        </div>
      </div>

      {skeletonFieldRows.map((row) => (
        <div
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
          key={row}
        >
          <div className="skeleton-shimmer h-4 w-24" />
          <div className="skeleton-shimmer mt-4 h-12 w-full" />
        </div>
      ))}

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="skeleton-shimmer h-4 w-24" />
        <div className="skeleton-shimmer mt-4 aspect-[4/3] w-full rounded-xl" />
      </div>
    </div>
  )
}

function App() {
  const [member, setMember] = useState<RegisteredMember | null>(null)
  const [viewStatus, setViewStatus] = useState<MemberViewStatus>('loading')
  const [notice, setNotice] = useState('')

  const loadMember = useCallback(
    async () => {
      try {
        const lineIdentity = await getLineIdentity()
        const memberData = await getRegisteredMember(lineIdentity)
        const status = memberData.status ?? 'pending'

        setMember(memberData)
        setNotice('')

        if (status === 'approved') {
          setViewStatus('member')
        } else if (status === 'rejected') {
          setViewStatus('rejected')
        } else {
          setViewStatus('pending')
        }
      } catch (error) {
        if (!isLiffLoginRedirectError(error)) {
          setMember(null)
          setNotice(getLoadErrorMessage(error))
          setViewStatus('error')
        }
      }
    },
    [],
  )

  useEffect(() => {
    void Promise.resolve().then(loadMember)
  }, [loadMember])

  useEffect(() => {
    if (viewStatus !== 'pending') {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      loadMember()
    }, 10000)

    return () => window.clearInterval(intervalId)
  }, [loadMember, viewStatus])

  const displayMember = member ?? fallbackMember
  const fields = getMemberFields(displayMember)
  const storefrontImage =
    displayMember.storefrontImageUrl ?? displayMember.storefrontImage

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
          {viewStatus === 'member' ? (
            <div className="mb-5">
              <p className="text-[15px] leading-6 text-[var(--color-muted)]">
                ข้อมูลผู้สมัคร ลิงก์ร้านหรือเพจ และรูปหน้าร้านสำหรับติดต่อกลับ
              </p>
            </div>
          ) : null}

          {notice && viewStatus === 'error' ? (
            <div
              className="mb-4 rounded-2xl border border-[color:var(--color-error)]/25 bg-[#fff1eb] px-4 py-3 text-sm leading-6 text-[var(--color-error)]"
              role="status"
            >
              {notice}
            </div>
          ) : null}

          {viewStatus === 'loading' ? (
            <MemberProfileSkeleton />
          ) : null}

          {viewStatus === 'pending' ? (
            <div
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-8 text-center"
              role="status"
            >
              <p className="text-base font-semibold text-[var(--color-text)]">
                รอตรวจสอบข้อมูล
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                ร้านได้รับข้อมูลการสมัครแล้ว กรุณารอตรวจสอบสักครู่
              </p>
            </div>
          ) : null}

          {viewStatus === 'rejected' ? (
            <div
              className="rounded-2xl border border-[color:var(--color-error)]/25 bg-[#fff1eb] px-4 py-8 text-center"
              role="status"
            >
              <p className="text-base font-semibold text-[var(--color-error)]">
                ข้อมูลไม่ผ่านเกณฑ์ที่ร้านกำหนด
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                กรุณาติดต่อร้านผ่านแชท LINE เพื่อสอบถามรายละเอียดเพิ่มเติม
              </p>
            </div>
          ) : null}

          {viewStatus === 'member' ? (
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
          ) : null}
        </section>
      </div>
    </main>
  )
}

export default App
