import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({
  rating,
  maxRating = 5,
  size = 20,
  interactive = false,
  onChange,
  className,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index) => {
    if (interactive) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const handleClick = (index) => {
    if (interactive && onChange) {
      onChange(index);
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className || ''}`}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = interactive
          ? (hoverRating || rating) >= starValue
          : rating >= starValue;

        return (
          <Star
            key={index}
            size={size}
            className={`transition-all duration-200 ${
              interactive ? 'cursor-pointer transform hover:scale-110' : ''
            } ${isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starValue)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
