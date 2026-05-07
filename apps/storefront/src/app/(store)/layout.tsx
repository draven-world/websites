import { ReactNode } from 'react'
import SiteChrome from '@/components/layout/SiteChrome'
import AnnouncementBar from '@/components/layout/AnnouncementBar'

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <SiteChrome />
      <main className="min-h-screen">{children}</main>
    </>
  )
}
