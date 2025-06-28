import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Category = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`/api/products?category=${categoryName}`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, [categoryName]);

  // Jewelry accent images
  const jewelryAccentImage = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
  const jewelryPatternImage = "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80";

  // Get category-specific content
  const getCategoryContent = (category) => {
    const categoryLower = category?.toLowerCase() || '';

    const categoryData = {
      necklace: {
        title: "Exquisite Necklace Collection",
        description: "Discover the timeless elegance of our handcrafted necklaces. Each piece tells a story of sophistication, designed to grace your neckline with unparalleled beauty. From delicate chains that whisper elegance to statement pieces that command attention, our collection embodies the perfect fusion of traditional craftsmanship and contemporary design.",
        backgroundImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        accent: "from-purple-300 to-purple-400",
        accentText: "text-purple-400"
      },
      ring: {
        title: "Magnificent Ring Collection",
        description: "Step into a world where every ring is a promise, a memory, a celebration. Our meticulously crafted rings are more than jewelry – they are symbols of life's most precious moments. From engagement rings that capture forever to fashion rings that express your unique style, each piece is designed to be treasured for generations.",
        backgroundImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        accent: "from-purple-300 to-purple-400",
        accentText: "text-purple-400"
      },
      bangle: {
        title: "Graceful Bangle Collection",
        description: "Embrace the rhythmic beauty of our bangle collection, where tradition meets contemporary elegance. Each bangle is a circle of endless possibilities, designed to complement your every gesture with grace and sophistication. From sleek modern designs to intricate traditional patterns, our bangles celebrate the art of wrist adornment.",
        backgroundImage: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        accent: "from-purple-300 to-purple-400",
        accentText: "text-purple-400"
      },
      earring: {
        title: "Stunning Earring Collection",
        description: "Frame your face with the ethereal beauty of our earring collection. From subtle studs that add a touch of sparkle to your everyday look to dramatic chandeliers that make a bold statement, each pair is crafted to enhance your natural radiance. Let your ears tell a story of elegance and style.",
        backgroundImage: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        accent: "from-purple-300 to-purple-400",
        accentText: "text-purple-400"
      },
      bracelet: {
        title: "Elegant Bracelet Collection",
        description: "Adorn your wrists with the sophisticated charm of our bracelet collection. Each piece is a testament to fine craftsmanship, designed to complement your personal style while adding a touch of luxury to your ensemble. From delicate tennis bracelets to bold statement pieces, find the perfect accent for every occasion.",
        backgroundImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        accent: "from-purple-300 to-purple-400",
        accentText: "text-purple-400"
      }
    };

    // Try to match the category name with our predefined categories
    for (const [key, value] of Object.entries(categoryData)) {
      if (categoryLower.includes(key) || key.includes(categoryLower)) {
        return value;
      }
    }

    // Default fallback
    return {
      title: `${category} Collection`,
      description: "Discover our exquisite collection of handcrafted jewelry pieces, where timeless elegance meets contemporary design. Each piece in our curated selection represents the pinnacle of craftsmanship and style, designed to enhance your natural beauty and express your unique personality.",
      backgroundImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      accent: "from-purple-300 to-purple-400",
      accentText: "text-purple-400"
    };
  };

  const categoryContent = getCategoryContent(categoryName);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <div className="relative h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${categoryContent.backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${jewelryPatternImage})` }}
        />

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-6 max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-light mb-6 leading-tight">
              {categoryContent.title}
            </h1>
            <div className="w-24 h-0.5 bg-white mx-auto opacity-60" />
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 -mt-24 relative z-20">
          <p className="text-lg leading-relaxed text-gray-700 font-light mb-8 text-center">
            {categoryContent.description}
          </p>

          <div className="text-center mb-12">
            <div className="inline-block w-16 h-2 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${jewelryAccentImage})` }} />
          </div>

          {/* Collection Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
            <div className="p-6 relative">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-10 rounded-lg"
                style={{ backgroundImage: `url(${jewelryAccentImage})` }}
              />
              <div className="text-3xl font-light mb-2 text-gray-800 relative z-10">
                {products.length}+
              </div>
              <p className="text-gray-600 font-light relative z-10">Unique Pieces</p>
            </div>
            <div className="p-6 relative">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-10 rounded-lg"
                style={{ backgroundImage: `url(${jewelryAccentImage})` }}
              />
              <div className="text-3xl font-light mb-2 text-gray-800 relative z-10">
                100%
              </div>
              <p className="text-gray-600 font-light relative z-10">Handcrafted</p>
            </div>
            <div className="p-6 relative">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-10 rounded-lg"
                style={{ backgroundImage: `url(${jewelryAccentImage})` }}
              />
              <div className="text-3xl font-light mb-2 text-gray-800 relative z-10">
                ∞
              </div>
              <p className="text-gray-600 font-light relative z-10">Timeless</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-gray-800 mb-4">Our Collection</h2>
          <p className="text-gray-600 font-light max-w-2xl mx-auto">
            Each piece in our collection is carefully selected and crafted to perfection
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-light">No products found in this collection.</p>
            <p className="text-gray-400 text-sm mt-2">Please check back soon for new arrivals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
                onClick={() => window.location.href = `/product/${product.id}`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image || "https://via.placeholder.com/400x400?text=Product"}
                    alt={product.name}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-light text-gray-800 mb-2 group-hover:text-gray-600 transition-colors">
                    {product.name}
                  </h3>
                   <p className="text-xs text-gray-500">Weight: {product.weight}g</p>
                  <div className="flex items-center justify-between">
                    <div className="relative">
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-20 rounded"
                        style={{ backgroundImage: `url(${jewelryAccentImage})` }}
                      />
                      <p className="text-xl font-light text-gray-800 relative z-10 px-2 py-1">
                        ₹{product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="relative py-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${categoryContent.backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${jewelryPatternImage})` }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h3 className="text-3xl font-light text-white mb-4">
            Discover Your Perfect Piece
          </h3>
          <p className="text-white opacity-90 font-light mb-8 max-w-2xl mx-auto">
            Can't find exactly what you're looking for? Our master craftsmen can create a custom piece just for you.
          </p>
          <button
            className="bg-white text-gray-800 px-8 py-3 rounded-full font-light hover:bg-gray-100 transition-colors duration-300 shadow-lg"
            onClick={() => window.location.href = '/contact'}
          >
            Explore Custom Design
          </button>
        </div>
      </div>
    </div>
  );
};

export default Category;