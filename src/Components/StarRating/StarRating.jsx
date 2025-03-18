import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

const StarRating = ({ rating = 0, maxRating = 5, size = 'md', showValue = true, className }) => {
  // Ensure rating is always a valid number
  const safeRating = typeof rating === 'number' && !isNaN(rating) ? rating : 0;

  // Size classes for the stars
  const sizeClass = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  // Text size classes
  const textSizeClass = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // Generate stars
  const renderStars = (safeRating) => {
    const stars = [];
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 >= 0.3 && safeRating % 1 <= 0.7;
    const emptyStars = Math.floor(maxRating - safeRating - (hasHalfStar ? 1 : 0));

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-full-${i}`}
          className={cn(sizeClass[size], 'fill-yellow-400 text-yellow-400')}
        />
      );
    }

    // Half star if needed
    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="star-half"
          className={cn(sizeClass[size], 'fill-yellow-400 text-yellow-400')}
        />
      );
    } else if (safeRating % 1 > 0.7) {
      // If rating is more than 0.7 decimal, round up to full star
      stars.push(
        <Star
          key="star-almost-full"
          className={cn(sizeClass[size], 'fill-yellow-400 text-yellow-400')}
        />
      );
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`star-empty-${i}`}
          className={cn(sizeClass[size], 'text-gray-300')}
        />
      );
    }

    return stars;
  };

  return (
    <div className={cn('flex items-center', className)}>
      <div className="flex">{renderStars(safeRating)}</div>
      {showValue && (
        <span className={cn('ml-1.5 font-medium text-foreground', textSizeClass[size])}>
          {safeRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;