import { Star } from "lucide-react";
import { useState } from "react";

const StarRating = ({ rating, setRating, maxStars = 5 }) => {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex space-x-1">
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            className={`w-6 h-6 cursor-pointer transition ${
              starValue <= (hover || rating)
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }`}
            onClick={() => setRating(rating === starValue ? 0 : starValue)} // Nếu click lại vào sao đã chọn, sẽ reset về 0
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(null)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
