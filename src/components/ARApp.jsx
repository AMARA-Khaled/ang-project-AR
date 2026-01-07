import React, { useState, useCallback } from "react";
import { dishes } from "../data/dishes";
import DishCard from "./DishCard";
import ARModal from "./ARModal";

const ARGallery = () => {
  const [selectedDish, setSelectedDish] = useState(null);
  const [modelError, setModelError] = useState(null);

  const handleViewAR = useCallback(async (dish) => {
    // Validate GLB file exists before opening modal
    try {
      const response = await fetch(dish.modelPath, { method: "HEAD" });
      if (!response.ok) {
        setModelError(dish.id);
        setTimeout(() => setModelError(null), 3000);
        return;
      }
      setSelectedDish(dish);
    } catch {
      setModelError(dish.id);
      setTimeout(() => setModelError(null), 3000);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedDish(null);
  }, []);

  return (
    <section className="p-8">
      <div className="text-center mb-12">
        <p className="text-gray-500 max-w-md mx-auto">
          View these delicious food items in augmented reality using your
          device's camera
        </p>
      </div>

      {/* Error Toast */}
      {modelError && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          ⚠️ 3D model not found. Please check the file path.
        </div>
      )}

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} onViewAR={handleViewAR} />
        ))}
      </div>

      {/* AR Modal */}
      {selectedDish && (
        <ARModal dish={selectedDish} onClose={handleCloseModal} />
      )}
    </section>
  );
};

const ARApp = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white py-4 px-8 shadow-sm text-center">
        <h1 className="m-0 text-3xl font-bold text-gray-800">
          AR Food Gallery
        </h1>
        <p className="mt-2 mb-0 text-gray-500">
          Experience food in augmented reality
        </p>
      </header>

      <ARGallery />
    </div>
  );
};

export default ARApp;
