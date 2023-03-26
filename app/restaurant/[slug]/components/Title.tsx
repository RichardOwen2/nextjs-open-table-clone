interface Props {
  name: string
}
export default function Title({ name }: Props) {
  return (
    <div className="mt-4 pb-1 mb-1">
      <h1 className="font-bold text-4xl">{name}</h1>
    </div>
  )
}
