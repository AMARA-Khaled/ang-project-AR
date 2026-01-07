import React, { useState } from "react";

const DishCard = ({ dish, onViewAR }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200 overflow-hidden">
      {/* Image Thumbnail */}
      <div className="h-64 relative overflow-hidden">
        {!imageError ? (
          <img
            src={dish.imagePath}
            alt={dish.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-5xl">
            🍽️
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="m-0 mb-4 text-gray-800 text-xl font-semibold">
          {dish.name}
        </h3>

        <button
          onClick={() => onViewAR(dish)}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white border-none py-3 px-4 rounded-lg cursor-pointer text-base font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          📱 View in AR
        </button>

        <p className="mt-3 mb-0 text-gray-500 text-xs text-center">
          Best experienced on mobile devices
        </p>
      </div>
    </div>
  );
};

export default DishCard;
