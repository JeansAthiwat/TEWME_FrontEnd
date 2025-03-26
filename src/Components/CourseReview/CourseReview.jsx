import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import { useToast } from '../Toast/Toast';

const CourseReviews = ({ course ,enrollmentStatus}) => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const { toast } = useToast();
  const [sortOrder, setSortOrder] = useState("newest");

  const sortedReviews = [...reviews].sort((a, b) => {
    return sortOrder === "newest"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt);
  });

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch('http://localhost:39189/api/profile/get-profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
  
      const userData = await response.json();
      console.log("User Profile:", userData); // Debugging
  
      return userData; // Ensure it contains `_id` and `email`
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };
  
  const getReviews = async () => {
    try {
      const response = await fetch(`http://localhost:39189/review/course/${course.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();

      // Fetch user details for each review
      const reviewsWithUserData = await Promise.all(
        data.map(async (review) => {
          try {
            const userResponse = await axios.get(
              `http://localhost:39189/user/id/${review.reviewer_id._id}?select=firstname,lastname,profilePicture`
            );
            return { ...review, user: userResponse.data };
          } catch (userError) {
            console.error("Error fetching user data", userError);
            return { ...review, user: { firstname: "Anonymous", lastname: "", profilePicture: "" } };
          }
        })
      );

      setReviews(reviewsWithUserData);
    } catch (error) {
      toast({
        title: "Error fetching reviews",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getReviews(); // Fetch reviews on mount
  }, [course.id]);

  const handleAddReview = async (courseId, rating, comment) => {
    try {
      const user = await fetchUserProfile(); // Get user ID & email
  
      if (!user) {
        toast({
          title: "Error fetching user details",
          description: "Please log in again.",
          variant: "destructive",
        });
        return;
      }
  
      const response = await fetch(`http://localhost:39189/review/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewer_id: user._id, // ✅ Use fetched user ID
          reviewer_email: user.email, // ✅ Use fetched email
          course_id: courseId,
          rating: rating,
          review_text: comment,
        }),
      });
  
      const data = await response.json();
      console.log("Review Submission Response:", data);
  
      if (!response.ok) {
        let errorMessage = "Please try again later.";
  
        if (data.message === "You have already reviewed this course.") {
          errorMessage = "You have already submitted a review for this course.";
        } else if (data.message === "Only learners can submit reviews.") {
          errorMessage = "Only enrolled learners can leave reviews.";
        }
  
        toast({
          title: "Error submitting review",
          description: errorMessage,
          variant: "destructive",
        });
  
        return;
      }

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      
  
      setIsReviewFormOpen(false);
      getReviews(); // 🔄 Refresh reviews
  
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error submitting review",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };  

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          Student Reviews ({reviews.length})
        </h2>
        <div className="flex items-center gap-4">
          {enrollmentStatus && !isReviewFormOpen && reviews.length > 0 &&(
            <button
              onClick={() => setIsReviewFormOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md transition-all hover:bg-blue-700 active:scale-95"
            >
              Write a Review
            </button>
          )}
          <div className="flex bg-gray-200 p-1 rounded-lg w-fit">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                sortOrder === "newest"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setSortOrder("newest")}
            >
              Newest
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                sortOrder === "oldest"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setSortOrder("oldest")}
            >
              Oldest
            </button>
          </div>
        </div>
      </div>
  
      {isReviewFormOpen && (
        <ReviewForm
          courseId={course.id}
          onSubmit={handleAddReview}
          onCancel={() => setIsReviewFormOpen(false)}
        />
      )}
  
      {reviews.length > 0 ? (
        <div className="space-y-6 mt-6">
          {sortedReviews.map((review, index) => (
            <ReviewItem
              key={index}
              review={review}
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600 mb-4">
            Be the first to share your experience with this course
          </p>
          {enrollmentStatus &&  !isReviewFormOpen && (
            <button
              onClick={() => setIsReviewFormOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md transition-all hover:bg-blue-700 active:scale-95"
            >
              Write a Review
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseReviews;
