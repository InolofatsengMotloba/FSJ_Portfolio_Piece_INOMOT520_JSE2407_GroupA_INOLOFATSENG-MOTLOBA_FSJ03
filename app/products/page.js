import Link from "next/link";
import { SingleImageGallery } from "@/components/ImageGallery";

export const dynamic = "force-dynamic"; // Ensure the page always fetches fresh data.

/**
 * Fetches products from the API with pagination.
 *
 * @param {number} [page=1] - The page number to fetch. Defaults to 1.
 * @returns {Promise<Object[]>} A promise that resolves to an array of product objects.
 * @throws {Error} Throws an error if the fetch request fails.
 */
async function fetchProducts(page = 1) {
  const skip = (page - 1) * 20;
  const res = await fetch(
    `https://next-ecommerce-api.vercel.app/products?limit=20&skip=${skip}`
  );

  if (!res.ok) {
    throw error;
  }

  return res.json();
}

/**
 * The Products page component that displays a list of products and pagination controls.
 *
 * @param {Object} props - The props for the component.
 * @param {Object} props.searchParams - The search parameters from the URL.
 * @param {string} [props.searchParams.page="1"] - The current page number from the URL. Defaults to "1".
 * @returns {JSX.Element} The rendered Products page component.
 */
export default async function Products({ searchParams }) {
  const page = searchParams.page || 1;
  let products;

  try {
    products = await fetchProducts(page);
  } catch (error) {
    throw error;
  }

  return (
    <div>
      <div className="max-w-[90rem] mx-auto  p-8 pb-12 gap-8 sm:p-12 min-h-screen">
        <h1 className="grid items-center justify-center text-2xl font-bold mb-6">
          PRODUCTS
        </h1>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col max-h-[100rem] border border-gray-200 shadow-md bg-white rounded-3xl overflow-hidden hover:shadow-lg hover:scale-105 transition duration-500 relative"
            >
              {/* Product Image */}
              <SingleImageGallery alt={product.name} images={product.images} />

              {/* Product Details */}
              <div className="flex-1 flex flex-col p-6">
                <div className="flex-1">
                  <header className="mb-2 flex-2">
                    <h2 className="text-lg line-clamp-2 font-extrabold leading-snug text-gray-700">
                      {product.title}
                    </h2>
                  </header>
                </div>

                <div className="flex-1">
                  <header className="mb-2 flex-2">
                    <p className="text-sm line-clamp-2 leading-snug text-gray-400">
                      {product.description}
                    </p>
                  </header>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <span className="inline-flex items-center rounded-sm px-2 py-1 text-xs border-2 font-bold border-black bg-white text-black ring-1 ring-inset ring-blue-700/10">
                    {product.category}
                  </span>

                  <p className="text-base font-bold text-[#2d7942] leading-snug">
                    ${product.price}
                  </p>
                </div>

                <Link
                  href={`/products/${product.id}`}
                  className="flex text-black justify-center mt-3 bg-white px-3 py-2 text-sm font-semibold hover:text-[#2d7942]"
                >
                  <span>View Details →</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <Pagination currentPage={page} />
      </div>
    </div>
  );
}

/**
 * A component that displays pagination controls for navigating between product pages.
 *
 * @param {Object} props - The props for the component.
 * @param {string} props.currentPage - The current page number.
 * @returns {JSX.Element} The rendered Pagination component.
 */
function Pagination({ currentPage }) {
  const pageNumber = parseInt(currentPage, 10);
  const prevPage = pageNumber > 1 ? pageNumber - 1 : null;
  const nextPage = pageNumber + 1;

  return (
    <div className="flex justify-center items-center mt-8 space-x-2">
      {prevPage && (
        <Link href={`/products?page=${prevPage}`}>
          <button className="px-4 py-2 bg-[#2d7942] text-white rounded-lg hover:bg-[#1d5931] transition-colors duration-300">
            Previous
          </button>
        </Link>
      )}
      <span className="text-lg">Page {currentPage}</span>
      <Link href={`/products?page=${nextPage}`}>
        <button className="px-4 py-2 bg-[#2d7942] text-white rounded-lg hover:bg-[#1d5931] transition-colors duration-300">
          Next
        </button>
      </Link>
    </div>
  );
}
