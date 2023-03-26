interface Props {
  description: string
}

export default function Description({ description }: Props) {
  return (
    <div className="mt-4">
      <p className="text-lg font-light">
        {description}
      </p>
    </div>
  )
}
