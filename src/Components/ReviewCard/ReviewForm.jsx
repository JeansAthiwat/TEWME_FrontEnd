import React, { useState } from 'react';
import { useToast } from '../Toast/Toast';
import StarRating from '../StarRating/StarRating';
import { Textarea } from '../ui/textarea';
import { X } from 'lucide-react';

const ReviewForm = ({ courseId, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating before submitting",
        variant: "destructive",
      });
      return;
    }
  
    if (comment.trim().length < 10) {
      toast({
        title: "Review too short",
        description: "Please write a more detailed review (minimum 10 characters)",
        variant: "destructive",
      });
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      await onSubmit(courseId, rating, comment);  // Submit review
  
      setRating(0);
      setComment("");
      setIsSubmitting(false);
      
      onCancel();  // 🔥 Close the form automatically!
    } catch (error) {
      toast({
        title: "Error submitting review",
        description: "Please try again later",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Write a Review</h3>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close review form"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
          </label>
          <StarRating 
            rating={rating} 
            interactive={true} 
            onChange={setRating} 
            size={28} 
            className="mb-1"
          />
          <p className="text-sm text-gray-500">
            {rating > 0 ? `You selected ${rating} ${rating === 1 ? 'star' : 'stars'}` : 'Select a rating'}
          </p>
        </div>

        <div className="mb-4">
          <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <Textarea
            id="review-comment"
            placeholder="Share your experience with this course..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            disabled={isSubmitting}
            className="resize-none focus:ring-apple-blue focus:border-apple-blue transition-all duration-200"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md transition-all hover:bg-blue-700 active:scale-95"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
