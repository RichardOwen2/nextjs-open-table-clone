import Header from "./components/Header";
interface Props {
  children: React.ReactNode
  params: { slug: string }
}
export default function RestaurantLayout({
  children,
  params
}: Props) {
  return (
    <main>
      <Header name={params.slug} />
      <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
        {children}
      </div>
    </main>
  )
}
