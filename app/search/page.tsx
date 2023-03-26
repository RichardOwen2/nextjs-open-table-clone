import { PRICE, PrismaClient } from "@prisma/client";
import Header from "./components/Header";
import RestaurantCard from "./components/RestaurantCard";
import SearchSideBar from "./components/SearchSideBar";

const prisma = new PrismaClient();

interface Props {
  city?: string
  cuisine?: string
  price?: PRICE
}

const fetchRestaurantBySearch = (searchParams: Props) => {
  const select = {
    id: true,
    name: true,
    main_image: true,
    slug: true,
    price: true,
    location: true,
    cuisine: true,
    reviews: true,
  }

  const where: any = {};

  if (searchParams.city) {
    const location = {
      name: {
        equals: searchParams.city.toLowerCase(),
      },
    }
    where.location = location;
  }

  if (searchParams.cuisine) {
    const cuisine = {
      name: {
        equals: searchParams.cuisine.toLowerCase(),
      },
    }
    where.cuisine = cuisine;
  }

  if (searchParams.price) {
    const price = {
      equals: searchParams.price,
    }
    where.price = price;
  }

  return prisma.restaurant.findMany({
    where,
    select,
  })
}

const fetchCuisines = async () => {
  return prisma.cuisine.findMany();
}

const fetchLocations = async () => {
  return prisma.location.findMany();
}

export default async function search({ searchParams }: { searchParams: Props }) {
  const restaurants = await fetchRestaurantBySearch(searchParams);
  const locations = await fetchLocations();
  const cuisines = await fetchCuisines();
  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar locations={locations} cuisines={cuisines} searchParams={searchParams} />
        <div className="w-5/6">
          {restaurants.length ? (
            restaurants.map((restaurant) =>
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))
            : (
              <p>Sorry, we found no restaurants in this area</p>
            )}
        </div>
      </div>
    </>
  )
}
