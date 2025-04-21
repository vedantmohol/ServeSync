import React, { useEffect, useState } from "react";
import { FaStar, FaTrashAlt, FaEdit } from "react-icons/fa";
import { Textarea, Button, Alert, Modal } from "flowbite-react";
import { useSelector } from "react-redux";

export default function Comment({ hotelId }) {
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedStars, setEditedStars] = useState(0);
  const [error, setError] = useState(null);

  const [deleteModal, setDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const { currentUser } = useSelector((state) => state.user);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comment/getComments/${hotelId}`);
      const data = await res.json();
      setComments(data || []);
    } catch (error) {
      console.log("Failed to fetch comments:", error.message);
    }
  };

  useEffect(() => {
    if (hotelId) fetchComments();
  }, [hotelId]);

  const handleEditClick = (comment) => {
    setEditingId(comment._id);
    setEditedContent(comment.content);
    setEditedStars(comment.stars);
    setError(null);
  };

  const handleEditSubmit = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${editingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent, stars: editedStars }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Update failed");
        return;
      }

      setEditingId(null);
      fetchComments();
    } catch (err) {
      console.error("Edit error:", err);
      setError("Something went wrong");
    }
  };

  const confirmDelete = (commentId) => {
    setCommentToDelete(commentId);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentToDelete}`, {
        method: "DELETE",
        credentials: 'include',
      });

      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentToDelete));
        setDeleteModal(false);
        setCommentToDelete(null);
      }
    } catch (err) {
      console.log("Delete error:", err.message);
    }
  };

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
          {comments.map((comment) =>
            editingId === comment._id ? (
              <div key={comment._id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`cursor-pointer text-xl ${
                        star <= editedStars ? "text-yellow-400" : "text-gray-300"
                      }`}
                      onClick={() => setEditedStars(star)}
                    />
                  ))}
                </div>
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end gap-3 mt-2">
                  <Button onClick={handleEditSubmit} size="sm" color="purple">
                    Save
                  </Button>
                  <Button
                    onClick={() => setEditingId(null)}
                    size="sm"
                    color="gray"
                  >
                    Cancel
                  </Button>
                </div>
                {error && <Alert color="failure" className="mt-2">{error}</Alert>}
              </div>
            ) : (
              <div
                key={comment._id}
                className="p-4 border rounded-lg bg-gray-50 shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
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

                {currentUser && currentUser._id === comment.userId && (
                  <div className="flex gap-3 mt-2 text-sm">
                    <button
                      onClick={() => handleEditClick(comment)}
                      className="text-purple-600 hover:underline flex items-center gap-1"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(comment._id)}
                      className="text-red-500 hover:underline flex items-center gap-1"
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}

      <Modal
        show={deleteModal}
        size="md"
        popup
        onClose={() => setDeleteModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="text-lg text-gray-700 mb-4">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Yes, Delete
              </Button>
              <Button color="gray" onClick={() => setDeleteModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}