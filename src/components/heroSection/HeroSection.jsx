import React from 'react';

function HeroSection() {
  return (
    <div className="w-full min-h-[300px] h-[50vh] md:h-[60vh] lg:h-[80vh] relative flex items-center justify-center">
      <img
        src="https://ik.imagekit.io/byg/image%20(2)%20(1).png?updatedAt=1743415112098"
        alt="Hero Background"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default HeroSection;
