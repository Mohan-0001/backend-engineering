export const products = [
  {
    slug: "iphone",
    name: "iPhone",
    description: "Explore the latest iPhone features.",
  },
  {
    slug: "macbook",
    name: "MacBook",
    description: "Discover laptops for work and creativity.",
  },
];

export async function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}