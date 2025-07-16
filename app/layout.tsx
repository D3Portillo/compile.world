import "./globals.css"

import type { PropsWithChildren } from "react"

import { Footer, Layout, Navbar } from "nextra-theme-docs"
import { Head } from "nextra/components"
import { getPageMap } from "nextra/page-map"

export const metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
}

const navbar = (
  <Navbar
    className="max-md:!flex-row-reverse [&_a]:max-md:m-0 max-md:!justify-between"
    logo={<strong>🏡 Home</strong>}
  />
)
const footer = <Footer>Compile World, {new Date().getFullYear()}</Footer>

export default async function RootLayout({ children }: PropsWithChildren) {
  const pageMap = await getPageMap()

  // Extract the learn content only from the page map
  // So we do not show "index" pages and show unused "learn" tab in the sidebar
  const learnContentOnly =
    (pageMap as any).find((page: any) => page.route === "/learn")?.children ||
    []

  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head>
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <body>
        <Layout
          navbar={navbar}
          pageMap={learnContentOnly}
          docsRepositoryBase="https://github.com/D3Portillo/compile.world/tree/master"
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
