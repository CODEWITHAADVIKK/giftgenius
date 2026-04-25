import { products } from "@/lib/data";
import { ProductDetailClient } from "./ProductDetailClient";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  return {
    title: product
      ? `${product.name} — GiftGenius AI`
      : "Product — GiftGenius AI",
    description: product?.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/50">Product not found</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <ProductDetailClient product={product} />
      <Footer />
    </>
  );
}
