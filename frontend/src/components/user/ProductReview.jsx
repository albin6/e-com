import React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { StarRating } from "../ui/ui-components";

const reviews = [
  {
    id: 1,
    author: "John Doe",
    rating: 4,
    date: "2023-05-15",
    content:
      "Great product! It exceeded my expectations. The quality is top-notch and it arrived earlier than expected.",
    helpful: 15,
    notHelpful: 2,
  },
  {
    id: 2,
    author: "Jane Smith",
    rating: 5,
    date: "2023-05-10",
    content:
      "Absolutely love it! This is exactly what I was looking for. The customer service was excellent too.",
    helpful: 20,
    notHelpful: 1,
  },
  // Add more review objects as needed
];

export default function ProductReviews() {
  return (
    <section className="bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Customer Reviews
        </h2>

        <div className="mb-8">
          <div className="flex items-center mb-2">
            <StarRating rating={4} />
            <span className="ml-2 text-gray-600">4.0 out of 5</span>
          </div>
          <p className="text-sm text-gray-500">Based on 47 reviews</p>
        </div>

        <div className="space-y-8">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {review.author}
                  </h3>
                  <div className="flex items-center mt-1">
                    <StarRating rating={review.rating} />
                    <span className="ml-2 text-sm text-gray-500">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{review.content}</p>
              <div className="flex items-center space-x-4">
                <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Helpful ({review.helpful})
                </button>
                <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                  <ThumbsDown className="w-4 h-4 mr-1" />
                  Not Helpful ({review.notHelpful})
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Write a Review
          </button>
        </div>
      </div>
    </section>
  );
}
