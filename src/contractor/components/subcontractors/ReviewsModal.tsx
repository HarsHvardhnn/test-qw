import React from 'react';
import { X, Star, ThumbsUp, Calendar, MessageSquare } from 'lucide-react';

interface Review {
  id: string;
  reviewer: {
    name: string;
    company: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  date: string;
  projectType: string;
  helpful: number;
  response?: {
    comment: string;
    date: string;
  };
}

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subcontractor: {
    name: string;
    company: string;
    avatar?: string;
    rating?: number;
    completedProjects?: number;
  };
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({
  isOpen,
  onClose,
  subcontractor
}) => {
  // Sample reviews data
  const reviews: Review[] = [
    {
      id: '1',
      reviewer: {
        name: 'John Smith',
        company: 'J9 Construction',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80'
      },
      rating: 5,
      comment: "Michael and his team did an outstanding job on our electrical work. They were professional, punctual, and their attention to detail was impressive. The smart home integration they did works flawlessly.",
      date: '2025-03-15',
      projectType: 'Smart Home Installation',
      helpful: 12,
      response: {
        comment: "Thank you for the kind words, John! It was a pleasure working with you and your team.",
        date: '2025-03-16'
      }
    },
    {
      id: '2',
      reviewer: {
        name: 'Sarah Davis',
        company: 'Modern Homes LLC',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80'
      },
      rating: 5,
      comment: "Excellent work on our multi-unit project. The team handled all electrical installations efficiently and their documentation was thorough. Would definitely work with them again.",
      date: '2025-02-28',
      projectType: 'Electrical Installation',
      helpful: 8
    },
    {
      id: '3',
      reviewer: {
        name: 'David Wilson',
        company: 'Wilson Construction',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80'
      },
      rating: 4,
      comment: "Good quality work overall. Communication was great and they met all deadlines. Minor issues with cleanup but they addressed it promptly when mentioned.",
      date: '2025-02-15',
      projectType: 'Electrical Repair',
      helpful: 5,
      response: {
        comment: "Thank you for the feedback, David. We've implemented new cleanup procedures to ensure this doesn't happen again.",
        date: '2025-02-16'
      }
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose} />
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {subcontractor.avatar ? (
                  <img
                    src={subcontractor.avatar}
                    alt={subcontractor.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {subcontractor.name.charAt(0)}
                  </div>
                )}
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{subcontractor.name}</h3>
                  <p className="text-sm text-gray-500">{subcontractor.company}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Rating Summary */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < (subcontractor.rating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-lg font-semibold text-gray-900">
                  {subcontractor.rating}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  ({reviews.length} reviews)
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {subcontractor.completedProjects} projects completed
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <div key={review.id} className="p-6">
                  <div className="flex items-start">
                    {/* Reviewer Info */}
                    <div className="flex-shrink-0">
                      {review.reviewer.avatar ? (
                        <img
                          src={review.reviewer.avatar}
                          alt={review.reviewer.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {review.reviewer.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Review Content */}
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{review.reviewer.name}</h4>
                          <p className="text-sm text-gray-500">{review.reviewer.company}</p>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="mt-2">
                        <p className="text-sm text-gray-600">{review.comment}</p>
                      </div>

                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        {formatDate(review.date)}
                        <span className="mx-2">•</span>
                        <MessageSquare className="w-4 h-4 mr-1.5" />
                        {review.projectType}
                        <button className="ml-4 flex items-center text-gray-400 hover:text-gray-500">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          <span>{review.helpful}</span>
                        </button>
                      </div>

                      {/* Subcontractor Response */}
                      {review.response && (
                        <div className="mt-4 bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">{review.response.comment}</p>
                          <p className="mt-2 text-xs text-gray-500">
                            Response from {subcontractor.name} • {formatDate(review.response.date)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};