import { Suspense } from 'react'

import HomeClient from '@/components/HomeClient'
import { getProjects } from '@/lib/payload/queries'

async function Home() {
  const projects = await getProjects()
  return <HomeClient projects={projects} />
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Home />
    </Suspense>
  )
}
