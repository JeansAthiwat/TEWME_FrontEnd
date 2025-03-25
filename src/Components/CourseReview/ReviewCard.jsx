import React from 'react';
import StarRating from '../StarRating/StarRating';
import { formatDistanceToNow, parseISO } from 'date-fns';

const ReviewCard = ({review}) => {
  return (
    <div className="p-5 bg-white rounded-xl border border-gray-100 transition-all hover:border-border hover:shadow-sm">
      <div className="flex items-start">
        <img 
          src={review.user.profilePicture} 
          alt={review.user.firstname + ' ' + review.user.lastname}
          className="w-10 h-10 rounded-full object-cover mr-3"
          loading="lazy"
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-medium">{review.user.firstname + ' ' + review.user.lastname}</h4>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(parseISO(review.updatedAt), { addSuffix: true })}
            </span>
          </div>
          <div className="mt-1 mb-3">
            <StarRating rating={review.rating} size="sm" showValue={false} />
          </div>
          <p className="text-sm text-muted-foreground">{review.review_text}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;