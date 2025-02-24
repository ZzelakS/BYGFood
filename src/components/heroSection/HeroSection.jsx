import React from 'react';

function HeroSection() {
  return (
    <div className="w-full min-h-[300px] h-[50vh] md:h-[60vh] lg:h-[80vh] relative flex items-center justify-center">
      <img
        src="https://res.cloudinary.com/danccwm8m/image/upload/iStock-1287245162_1_u0mqgq.jpg"
        alt="Hero Background"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default HeroSection;
