import Link from "next/link"

export default function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="text-sm font-serif font-bold uppercase tracking-wider">Store</h3>
                        <p className="mt-4 text-sm text-muted-foreground/80 leading-relaxed">
                            Premium products for your lifestyle. Quality guaranteed.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-serif font-bold uppercase tracking-wider">Links</h3>
                        <ul className="mt-4 space-y-3 text-sm text-muted-foreground/80">
                            <li><Link href="/products" className="hover:text-primary">Products</Link></li>
                            <li><Link href="/categories" className="hover:text-primary">Categories</Link></li>
                            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-serif font-bold uppercase tracking-wider">Support</h3>
                        <ul className="mt-4 space-y-3 text-sm text-muted-foreground/80">
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-serif font-bold uppercase tracking-wider">Newsletter</h3>
                        <p className="mt-4 text-sm text-muted-foreground/80 leading-relaxed">
                            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
                        </p>
                        {/* Add newsletter form here */}
                    </div>
                </div>
                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Ecom Store. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
