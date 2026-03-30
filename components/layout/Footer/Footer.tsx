import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";

interface Post {
  id: number | string;
  title?: string;
  diller_no: string;
}

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(
      "https://backend.vintocash.com/api/web/data",
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error("Failed to fetch data");
      return [];
    }

    const result = await res.json();
    console.log("API RESULT:", result);

    // 🔥 Universal Safe Handling
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.data)) return result.data;
    if (result?.data && typeof result.data === "object")
      return [result.data];

    return [];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

export default async function Footer() {
  const posts = await getPosts();

  return (
    <footer className="bg-black text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand & Description */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">
              VintoCash
            </h3>

            <p className="text-sm leading-relaxed">
              Operated by VintoCash.NY
              <br />
              Motor Vehicle Dealer, Licensed Dealer
            </p>

            {/* Dealer Data */}
            <ul className="text-sm space-y-1">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <li key={post.id}>
                    <span className="font-bold">Dealer No:</span> {post.diller_no}
                  </li>
                ))
              ) : (
                <li>No data available</li>
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/howItWorks" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/SellerUpsides" className="hover:text-white transition-colors">
                  Seller Upside
                </Link>
              </li>
              <li>
                <Link href="/whatWeBuy" className="hover:text-white transition-colors">
                  What We Buy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">
              Connect
            </h4>
            <div className="flex items-center gap-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-6 w-6 hover:text-white transition" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-6 w-6 hover:text-white transition" />
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-6 w-6 hover:text-white transition" />
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-start md:items-end justify-center">
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-base font-medium rounded-full shadow-lg transition"
            >
              Get an Offer
            </Button>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
            <p className="text-gray-500">
              demore@vintocash.com
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-gray-500">
              <Link href="/Terms" className="hover:text-gray-300">
                Terms & conditions
              </Link>
              <Link href="/privacy" className="hover:text-gray-300">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}