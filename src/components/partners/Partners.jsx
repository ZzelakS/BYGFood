import React from 'react';
import { motion } from 'framer-motion';
import partner1 from '../../assets/partner1.png';
import partner2 from '../../assets/partner2.png';
import partner3 from '../../assets/partner3.png';
import partner4 from '../../assets/logo.png';

const partners = [partner1, partner2, partner3, partner4];

const PartnersCarousel = () => {
  return (
    <div className="relative w-full overflow-hidden py-10 bg-white">
      <motion.div
        className="flex space-x-60 w-max"
        initial={{ x: '100%' }}
        animate={{ x: '-100%' }}
        transition={{
          repeat: Infinity,
          duration: 15,
          ease: 'linear'
        }}
        style={{ display: 'flex' }}
      >
        {partners.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Partner ${index + 1}`}
            className="h-20 w-auto object-contain"
          />
        ))}
      </motion.div>
    </div>
  );
};

export default PartnersCarousel;
