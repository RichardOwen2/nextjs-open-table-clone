import Image from "next/image"
import { Review } from "@prisma/client"
import fullStar from "../../public/icons/full-star.png"
import halfStar from "../../public/icons/half-star.png"
import emptyStar from "../../public/icons/empty-star.png"
import { calculateReviewRatingAverage } from "../../utils/CalculateReviewRatingAverage"

export default function Stars({ reviews, rating }: { reviews: Review[], rating?: number }) {
  const reviewRating = rating || calculateReviewRatingAverage(reviews);

  const renderStar = () => {
    const stars = [];

    for (let i = 0; i < 5; i++) {
      const diffrence = parseFloat((reviewRating - i).toFixed(1));
      if (diffrence >= 1) {
        stars.push(fullStar)
      } else if (diffrence < 1 && diffrence > 0) {
        if (diffrence <= 0.2) {
          stars.push(emptyStar)
        } else if (diffrence > 0.2 && diffrence <= 0.6) {
          stars.push(halfStar);
        } else {
          stars.push(fullStar);
        }
      } else {
        stars.push(emptyStar);
      }
    }

    return stars.map((star) => {
      return (
        <Image src={star} alt="" className="w-4 h-4 mr-1" />
      )
    })
  }

  return (
    <div className="flex items-center">
      {renderStar()}
    </div>
  )
}
