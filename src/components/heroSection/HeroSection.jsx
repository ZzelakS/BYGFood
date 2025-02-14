import React from 'react';

function HeroSection() {
  return (
    <div className="w-full min-h-[300px] h-[50vh] md:h-[60vh] lg:h-[80vh] relative flex items-center justify-center">
      <img
        src="https://res.cloudinary.com/danccwm8m/image/upload/v1700000000/hero-bg_gp4uk5.jpg"
        alt="Hero Background"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default HeroSection;
