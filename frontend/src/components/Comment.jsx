import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

export default function Comment({ hotelId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getComments/${hotelId}`);
        const data = await res.json();
        setComments(data || []);
      } catch (error) {
        console.log("Failed to fetch comments:", error.message);
      }
    };

    if (hotelId) {
      getComments();
    }
  }, [hotelId]);

  return (
    <div className="max-w-3xl mx-auto w-full mt-10">
      <h3 className="text-2xl font-semibold mb-4 text-purple-700">
        Customer Reviews
      </h3>

      {comments.length === 0 ? (
        <p className="text-sm text-gray-500">
          No reviews yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => (
            <div
              key={comment._id || comment.createdAt}
              className="p-4 border rounded-lg bg-gray-50 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < comment.stars ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{comment.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                Posted by:{" "}
                <span className="font-medium text-gray-700">
                  @{comment.username}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
