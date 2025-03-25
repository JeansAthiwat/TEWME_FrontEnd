import React from 'react';
import StarRating from '../StarRating/StarRating';
import { formatDistanceToNow,parseISO } from 'date-fns';

const ReviewItem = ({ review, className, style }) => {
  return (
    <div 
      className={`p-6 rounded-xl bg-white border border-gray-100 shadow-sm transition-all duration-300 
        hover:shadow-md hover:border-gray-200 animate-slide-up ${className || ''}`}
      style={style}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
        <img 
          src={review.user.profilePicture} 
          alt={review.user.firstname + ' ' + review.user.lastname}
          className="w-10 h-10 rounded-full object-cover mr-3"
          loading="lazy"
        />
          <div>
          <h4 className="font-medium">{review.user.firstname + ' ' + review.user.lastname}</h4>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(parseISO(review.updatedAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} size={16} />
      </div>
      
      <p className="text-gray-700 leading-relaxed">{review.review_text}</p>
    </div>
  );
};

export default ReviewItem;
