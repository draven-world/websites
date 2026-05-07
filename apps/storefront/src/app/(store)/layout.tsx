import { ReactNode } from 'react'
import SiteChrome from '@/components/layout/SiteChrome'

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteChrome />
      <main className="min-h-screen">{children}</main>
    </>
  )
}
