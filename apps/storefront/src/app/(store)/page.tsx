import { getHomepage } from '@/lib/sanity'
import HeroSilent from '@/components/home/HeroSilent'
import LatestDrop from '@/components/home/LatestDrop'
import LookbookStrip from '@/components/home/LookbookStrip'
import ClosingStatement from '@/components/home/ClosingStatement'

export const revalidate = 0

export default async function HomePage() {
  let data: any = null
  try {
    data = await getHomepage()
  } catch {
    data = null
  }

  return (
    <>
      <HeroSilent videoUrl={data?.heroVideo} imageUrl={data?.heroImage} />
      <LatestDrop collection={data?.featuredCollection ?? null} />
      <LookbookStrip items={(data?.lookbookImages ?? []).filter((i: any) => i?.image)} />
      <ClosingStatement statement={data?.closingStatement || 'BUILT FOR THOSE WHO MOVE DIFFERENTLY'} />
    </>
  )
}
