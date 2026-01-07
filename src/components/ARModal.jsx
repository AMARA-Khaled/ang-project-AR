import React, { useEffect, useRef, useState } from "react";

const ARModal = ({ dish, onClose }) => {
  const modelViewerRef = useRef(null);
  const [arSupported, setArSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  // For deployed sites, we need absolute URLs for AR to work properly
  // Android Scene Viewer requires fully accessible HTTPS URLs
  const getAbsoluteUrl = (path) => {
    // If already absolute, return as-is
    if (path.startsWith('http')) return path;
    // Build absolute URL from current origin
    const origin = window.location.origin;
    // Ensure the path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${origin}${normalizedPath}`;
  };

  const arSrc = getAbsoluteUrl(dish.modelPath);
  
  // Build intent URL for Android Scene Viewer fallback
  const sceneViewerUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(arSrc)}&mode=ar_only&title=${encodeURIComponent(dish.name)}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(arSrc)};end;`;

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  
  useEffect(() => {
    // Check if AR is supported after model-viewer loads
    const checkARSupport = () => {
      if (modelViewerRef.current) {
        // model-viewer exposes canActivateAR property
        const canAR = modelViewerRef.current.canActivateAR;
        setArSupported(canAR !== false);
      }
    };
    
    // Give model-viewer time to initialize
    const timer = setTimeout(checkARSupport, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleActivateAR = () => {
    if (modelViewerRef.current && modelViewerRef.current.canActivateAR) {
      modelViewerRef.current.activateAR();
    } else {
      // Fallback: Open Scene Viewer directly on Android
      const isAndroid = /android/i.test(navigator.userAgent);
      if (isAndroid) {
        window.location.href = sceneViewerUrl;
      } else {
        alert('AR is not supported on this device or browser. Please use Chrome on Android.');
      }
    }
  };
  
  const handleModelLoad = () => {
    setIsLoading(false);
  };
  
  const handleModelError = (e) => {
    console.error('Model loading error:', e);
    setIsLoading(false);
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
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl z-10">
            <div className="text-gray-500">Loading 3D model...</div>
          </div>
        )}

        <model-viewer
          ref={modelViewerRef}
          src={arSrc}
          ar
          ar-modes="scene-viewer webxr quick-look"
          camera-controls
          auto-rotate
          ar-scale="fixed"
          ar-placement="floor"
          scale="0.001 0.001 0.001"
          max-camera-orbit="auto 90deg auto"
          min-camera-orbit="auto 0deg auto"
          className="w-full h-72 rounded-lg"
          style={{ width: "100%", height: "300px" }}
          onLoad={handleModelLoad}
          onError={handleModelError}
          crossorigin="anonymous"
        />

        <button
          onClick={handleActivateAR}
          className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-lg py-3 px-6 cursor-pointer text-base font-semibold transition-colors"
        >
          📱 Activate AR
        </button>
        
        {!arSupported && (
          <p className="mt-2 text-xs text-amber-600">
            Note: AR may require Chrome on Android with ARCore support
          </p>
        )}
      </div>
    </div>
  );
};

export default ARModal;
