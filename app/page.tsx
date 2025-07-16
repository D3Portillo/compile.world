import { FlickeringGrid } from "@/components/magicui/flickering-grid"
import Link from "next/link"
import { FaArrowRight } from "react-icons/fa"

const GRID_GAP = 6
export default function Home() {
  return (
    <main className="min-h-[calc(100vh-3rem)] px-6 overflow-hidden relative grid place-items-center">
      <section className="relative z-[1]">
        <h1 className="text-5xl sm:text-7xl font-bold max-w-xl">
          Build the{" "}
          <span className="text-blue-600 whitespace-nowrap underline underline-offset-4">
            Best 👌
          </span>
          <br /> Mini App ever!
        </h1>
        <p className="text-xl sm:text-2xl mt-2 max-w-sm sm:max-w-lg">
          <span className="font-semibold">Compile World:</span> A
          community-driven hub to learn, build, and ship Mini Apps for
          Worldchain.
        </p>

        <nav className="grid sm:flex mt-8 items-center gap-4">
          <Link
            href="/learn"
            className="group flex items-center justify-between gap-4 text-xl font-semibold cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>Get Started</span>
            <FaArrowRight className="group-hover:translate-x-px" />
          </Link>

          <Link
            href="https://t.me/+kZhwOjUVIk4zNzRh"
            target="_blank"
            className="group flex items-center justify-between gap-4 text-xl font-semibold cursor-pointer px-6 py-3 bg-black/10 dark:bg-white/7 dark:hover:bg-white/10 hover:bg-black/15 backdrop-blur-xs text-black dark:text-white rounded-lg transition-colors"
          >
            <span>Community</span>
            <FaArrowRight className="group-hover:translate-x-px" />
          </Link>
        </nav>
      </section>
      <FlickeringGrid
        style={{
          top: GRID_GAP,
          left: GRID_GAP,
          bottom: 0,
          right: 0,
        }}
        className="absolute dark:invert opacity-20 dark:opacity-35"
        gridGap={GRID_GAP}
      />
    </main>
  )
}
