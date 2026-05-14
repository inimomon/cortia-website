import React from 'react';

const HeroDashboard = ({ 
  title, 
  description, 
  showMapPlaceholder = true, 
  variant = "dark" 
}) => {
  // Logic for different themes if you want a light version later
  const bgStyles = variant === "dark" 
    ? "bg-gray-900 text-white" 
    : "bg-gray-50 text-gray-900";

  return (
    <section className="pt-14">
      <div className={`relative ${bgStyles} overflow-hidden`}>
        {/* Subtle Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(10,40,80,0.6),transparent_70%)]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl font-bold mb-3 font-serif">
              {title}
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              {description}
            </p>
          </div>

          {showMapPlaceholder && (
            <div className="hidden md:block">
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 h-32 flex items-center justify-center">
                <div className="text-gray-500 text-sm">
                  🗺 Peta Indonesia — Real-time
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroDashboard;