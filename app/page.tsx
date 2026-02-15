import Hero from "@/components/shared/hero"
import ProductCard from "@/components/shared/product-card"
import { Product } from "@/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import TrustBadges from "@/components/shared/trust-badges"
import Newsletter from "@/components/shared/newsletter"
import Testimonials from "@/components/shared/testimonials"
import { FadeIn, StaggerContainer } from "@/components/shared/animation-wrapper"

const MOCK_FEATURED_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description: "Experience crystal clear sound with our noise-cancelling headphones.",
    price: 299.99,
    stock: 10,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"],
    categoryId: "tech",
    slug: "wireless-headphones"
  },
  {
    id: "2",
    name: "Minimalist Watch",
    description: "Elegant design meets precision engineering.",
    price: 149.50,
    stock: 5,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"],
    categoryId: "accessories",
    slug: "minimalist-watch"
  },
  {
    id: "3",
    name: "Smart Fitness Tracker",
    description: "Track your health and fitness goals with ease.",
    price: 89.99,
    stock: 20,
    images: ["https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80"],
    categoryId: "tech",
    slug: "fitness-tracker"
  },
  {
    id: "4",
    name: "Leather Backpack",
    description: "Durable and stylish backpack for everyday use.",
    price: 199.00,
    stock: 0,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"],
    categoryId: "fashion",
    slug: "leather-backpack"
  },
]

export default function Home() {
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
          {MOCK_FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
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
          {['Tech', 'Fashion', 'Accessories'].map((cat, i) => (
            <FadeIn key={cat} direction="up" delay={i * 0.1}>
              <Link href={`/products?category=${cat.toLowerCase()}`} className="group relative aspect-[4/5] overflow-hidden bg-secondary block">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 z-10" />
                <div className="absolute inset-x-8 bottom-8 z-20 transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="text-2xl font-bold text-white font-serif uppercase tracking-tighter">{cat}</h3>
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
