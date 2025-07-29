import React, { useState } from "react";
import vegetables from "../vegetables";

const Store = () => {
  const [basket, setBasket] = useState([]);

  const addToBasket = (vegetable) => {
    setBasket((prev) => [...prev, vegetable]);
    // Optional: Show a brief success message
    console.log(`Added ${vegetable.name} to basket!`);
  };

  return (
    <div className="min-h-screen p-6">
      {/* Basket counter */}
      <div className="flex justify-center mt-4">
        <div className="bg-green-700 text-white px-4 py-2 rounded-full font-semibold">
          🛒 Basket: {basket.length} items
        </div>
      </div>

      {/* Vegetables Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vegetables.map((veg, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${
              veg.inStock
                ? "border-green-200 hover:border-green-300"
                : "border-gray-200 opacity-75"
            }`}
          >
            {/* Vegetable Image/Emoji */}
            <div className="text-6xl text-center py-6 bg-gradient-to-br from-green-100 to-emerald-50 rounded-t-xl">
              {veg.emoji}
            </div>

            {/* Card Content */}
            <div className="p-5">
              {/* Name and Stock Status */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-green-800">{veg.name}</h3>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    veg.inStock
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {veg.inStock ? "In Stock" : "Out of Stock"}
                </div>
              </div>

              {/* Price */}
              <div className="text-2xl font-bold text-green-600 mb-3">
                ${veg.price.toFixed(2)}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {veg.description}
              </p>

              {/* Key Nutrients */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {veg.nutrients.slice(0, 2).map((nutrient, nutIdx) => (
                    <span
                      key={nutIdx}
                      className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                    >
                      {nutrient}
                    </span>
                  ))}
                  {veg.nutrients.length > 2 && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      +{veg.nutrients.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Basket Button */}
              <button
                onClick={() => addToBasket(veg)}
                disabled={!veg.inStock}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  veg.inStock
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg active:transform active:scale-95"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {veg.inStock ? <>Add to Basket</> : <>Out of Stock</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;
