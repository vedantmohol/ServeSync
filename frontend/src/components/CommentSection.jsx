import { Alert, Button, Label, Textarea } from 'flowbite-react';
import { FaStar } from 'react-icons/fa';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function CommentSection({ hotelId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [content, setContent] = useState('');
  const [stars, setStars] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content || !stars) {
      setError("Comment and rating are required.");
      return;
    }

    try {
      const res = await fetch('/api/comment/createComment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId,
          userId: currentUser._id,
          stars: parseInt(stars),
          content,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Review submitted!");
        setContent('');
        setStars('');
        setError(null);
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 border p-4 rounded shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-purple-700">
        Leave a Review
      </h3>
      {!currentUser ? (
        <p className="text-gray-600 text-sm mb-4">
          You must be logged in to comment.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="stars" value="Rating (1–5 stars)" />
            <div className="flex gap-2 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`cursor-pointer text-2xl transition ${
                    star <= stars ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setStars(star)}
                />
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="comment" value="Comment" />
            <Textarea
              id="comment"
              rows={3}
              placeholder="Share your experience..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={200}
            />
          </div>

          <Button type="submit" gradientDuoTone="purpleToBlue">
            Submit
          </Button>

          {error && <Alert color="failure">{error}</Alert>}
          {successMsg && <Alert color="success">{successMsg}</Alert>}
        </form>
      )}
    </div>
  );
}
