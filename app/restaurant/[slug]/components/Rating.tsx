import { Review } from "@prisma/client";
import { calculateReviewRatingAverage } from "../../../../utils/CalculateReviewRatingAverage";
import Stars from "../../../components/Stars";

interface Props {
  reviews: Review[]
}

export default function Rating({ reviews }: Props) {
  return (
    <div className="flex items-end">
      <div className="ratings mt-2 flex items-center">
        <Stars reviews={reviews} />
        <p className="text-reg ml-3">
          {calculateReviewRatingAverage(reviews).toFixed(1)}
        </p>
      </div>
      <div>
        <p className="text-reg ml-4">{reviews.length} Review{reviews.length === 1 ? "" : "s"}</p>
      </div>
    </div>
  )
}
