import "./globals.css"

import type { PropsWithChildren } from "react"

import { Footer, Layout, Navbar } from "nextra-theme-docs"
import { Banner, Head } from "nextra/components"
import { getPageMap } from "nextra/page-map"

export const metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
}

const banner = <Banner storageKey="some-key">Nextra 4.0 is released 🎉</Banner>
const navbar = (
  <Navbar
    logo={<b>Nextra</b>}
    // ... Your additional navbar options
  />
)
const footer = <Footer>MIT {new Date().getFullYear()} © Nextra.</Footer>

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
      <Head
      // ... Your additional head options
      >
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={learnContentOnly}
          docsRepositoryBase="https://github.com/shuding/nextra/tree/main/docs"
          footer={footer}
          // ... Your additional layout options
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
