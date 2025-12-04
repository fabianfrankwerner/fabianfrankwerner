import React from "react";
import { useBasket } from "./BasketContext";
import { Link } from "react-router-dom";

const Basket = () => {
  const { basket, removeFromBasket, clearBasket, getTotalPrice } = useBasket();

  if (basket.length === 0) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-green-800 mb-4">Basket</h1>
            <p className="text-green-600 text-lg">
              Your fresh vegetable selection
            </p>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-8xl mb-6">🥕</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Your basket is empty
            </h2>
            <p className="text-gray-500 mb-8">
              Add some fresh vegetables from our store to get started!
            </p>
            <Link
              to="/store"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Browse Vegetables
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Basket</h1>
          <p className="text-green-600 text-lg">
            {basket.length} item{basket.length !== 1 ? "s" : ""} in your basket
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Basket Items */}
          <div className="lg:col-span-2 space-y-4">
            {basket.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200 hover:border-green-300 transition-all duration-200"
              >
                <div className="flex items-center gap-6">
                  {/* Vegetable Emoji */}
                  <div className="text-4xl bg-gradient-to-br from-green-100 to-emerald-50 rounded-lg p-4">
                    {item.emoji}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-green-800 mb-2">
                      {item.name}
                    </h3>
                    {/* <p className="text-gray-600 text-sm mb-3">
                      {item.description}
                    </p> */}

                    {/* Nutrients */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.nutrients.slice(0, 5).map((nutrient, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                        >
                          {nutrient}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-green-600">
                        ${item.price.toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeFromBasket(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200 sticky top-6">
              <h2 className="text-2xl font-bold text-green-800 mb-6">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-3 mb-6">
                {basket.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.emoji}</span>
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-gray-700">Total:</span>
                  <span className="text-green-600">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() =>
                    alert(
                      "You would be able to check out now; if this was a real app :)"
                    )
                  }
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={clearBasket}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                >
                  Clear Basket
                </button>
                <Link
                  to="/store"
                  className="block w-full text-center bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Basket;
