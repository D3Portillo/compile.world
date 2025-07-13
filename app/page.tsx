import { FlickeringGrid } from "@/components/magicui/flickering-grid"
import Link from "next/link"
import { FaArrowRight } from "react-icons/fa"

const GRID_GAP = 6
export default function Home() {
  return (
    <main className="min-h-[calc(100vh-3rem)] overflow-hidden relative grid place-items-center">
      <section className="relative z-[1]">
        <h1 className="text-7xl font-bold max-w-xl">
          Build the{" "}
          <span className="text-blue-600 whitespace-nowrap underline underline-offset-4">
            best 👌
          </span>
          <br /> Mini App ever!
        </h1>
        <p className="text-2xl mt-2 max-w-lg">
          <span className="font-semibold">Compile World:</span> Learn how to
          build and ship Mini Apps for World.
        </p>

        <nav className="flex">
          <Link
            href="/learn"
            className="mt-8 flex items-center gap-4 text-xl font-semibold cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>Get Started</span>
            <FaArrowRight />
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
        className="absolute opacity-25"
        gridGap={GRID_GAP}
      />
    </main>
  )
}
