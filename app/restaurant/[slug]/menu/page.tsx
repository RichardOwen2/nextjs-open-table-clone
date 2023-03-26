import { PrismaClient } from "@prisma/client";
import Menu from "../components/Menu";
import RestaurantNavBar from "../components/RestaurantNavBar";

const prisma = new PrismaClient();

const fetchRestaurantMenus = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      items: true,
    }
  })

  if(!restaurant) {
    throw new Error;
  }

  return restaurant.items;
}

export default async function RestaurantMenu({ params }: { params: { slug: string } }) {
  const menus = await fetchRestaurantMenus(params.slug);
  return (
    <div className="bg-white w-[100%] rounded p-3 shadow">
      <RestaurantNavBar slug={params.slug} />
      <Menu menus={menus} />
    </div>
  );
}