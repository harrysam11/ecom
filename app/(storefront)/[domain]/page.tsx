import Hero from "@/components/shared/hero"
import ProductCard from "@/components/shared/product-card"
import { Product } from "@/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import TrustBadges from "@/components/shared/trust-badges"
import Newsletter from "@/components/shared/newsletter"
import Testimonials from "@/components/shared/testimonials"
import { FadeIn, StaggerContainer } from "@/components/shared/animation-wrapper"
import { prisma } from "@/lib/prisma"
import { unstable_cache } from "next/cache"
import SaasLandingPage from "@/components/saas/landing-page"

const getFeaturedProducts = unstable_cache(
  async (subdomain: string) => {
    return prisma.product.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      where: {
        store: { subdomain },
        status: "PUBLISHED"
      }
    })
  },
  ["featured-products"],
  { revalidate: 3600, tags: ["products"] }
)

export default async function Home({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params

  if (domain === "platform") {
    return <SaasLandingPage />
  }

  const featuredProducts = await getFeaturedProducts(domain)

  const categories = await prisma.category.findMany({
    where: { store: { subdomain: domain } },
    take: 3
  })

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Hero />

      <TrustBadges />

      <section className="container mx-auto px-4 py-32">
        <FadeIn direction="up" className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary/60">Selected Works</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter font-serif uppercase">Featured <br /> Pieces</h2>
          </div>
          <Link href="/products">
            <Button variant="link" className="text-[11px] uppercase tracking-widest font-bold p-0 h-auto hover:text-primary transition-colors border-b border-black pb-1 rounded-none hover:opacity-60">
              Explore All Artifacts
            </Button>
          </Link>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">No featured products found.</p>
          )}
        </StaggerContainer>
      </section>

      <Testimonials />

      <section className="container mx-auto px-4 py-32 border-t border-black/5">
        <FadeIn direction="up" className="text-center mb-16 space-y-4">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary/60">Global Reach</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter font-serif uppercase">Our Collections</h2>
          <p className="text-lg font-light text-muted-foreground max-w-[600px] mx-auto">
            Curated selections of the finest artifacts, delivered with care to every corner of the globe.
          </p>
        </FadeIn>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <FadeIn key={cat.id} direction="up" delay={i * 0.1}>
              <Link href={`/products?category=${cat.slug}`} className="group relative aspect-[4/5] overflow-hidden bg-secondary block">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 z-10" />
                <div className="absolute inset-x-8 bottom-8 z-20 transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="text-2xl font-bold text-white font-serif uppercase tracking-tighter">{cat.name}</h3>
                  <p className="text-[10px] text-white/80 uppercase tracking-widest font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Discover Selection</p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </StaggerContainer>
      </section>

      <Newsletter />
    </main>
  )
}
