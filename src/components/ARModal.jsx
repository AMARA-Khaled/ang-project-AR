import React, { useEffect, useRef } from "react";

const ARModal = ({ dish, onClose }) => {
  const modelViewerRef = useRef(null);
  const arSrc = `${dish.modelPath}?v=${Date.now()}`;
  // iOS requires USDZ format - derive path from GLB path
  const iosSrc = dish.iosModelPath || dish.modelPath.replace('.glb', '.usdz');

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleActivateAR = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.activateAR();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-md p-6 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 border-none rounded px-4 py-2 cursor-pointer text-sm transition-colors"
        >
          Close
        </button>

        <h3 className="m-0 mb-2 text-gray-800 text-xl font-semibold">
          {dish.name} in AR
        </h3>
        <p className="m-0 mb-4 text-gray-500 text-sm">
          Tap the AR button below to view in your space!
        </p>

        <model-viewer
          ref={modelViewerRef}
          src={arSrc}
          ios-src={iosSrc}
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          auto-rotate
          ar-scale="fixed"
          ar-placement="floor"
          scale="0.001 0.001 0.001"
          max-camera-orbit="auto 90deg auto"
          min-camera-orbit="auto 0deg auto"
          className="w-full h-72 rounded-lg"
          style={{ width: "100%", height: "300px" }}
        />

        <button
          onClick={handleActivateAR}
          className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-lg py-3 px-6 cursor-pointer text-base font-semibold transition-colors"
        >
          📱 Activate AR
        </button>
      </div>
    </div>
  );
};

export default ARModal;
