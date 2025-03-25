import { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function ReviewButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  return (
    <div className="p-6">
      {/* Button to open the review modal */}
      <button
        className="px-6 py-3 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-100 transition-colors sm:flex-1 flex justify-center items-center"
        onClick={() => setIsOpen(true)}
      >
        Write a Review
      </button>

      {/* Popup modal with black transparent background */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Write a Review</h2>

            {/* Star rating */}
            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`cursor-pointer text-2xl ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>

            {/* Review input field */}
            <textarea
              className="w-full p-2 border rounded-md"
              rows="4"
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>

            {/* Action buttons */}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => {
                  console.log("Review submitted:", { rating, reviewText });
                  setIsOpen(false);
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
