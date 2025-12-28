import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_URL}/api/listing/get?offer=true&limit=4`, {
          method: 'GET',
          credentials: 'include',
        }
        );
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_URL}/api/listing/get?type=rent&limit=4`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_URL}/api/listing/get?type=sale&limit=4`, {
          method: 'GET',
          credentials: 'include',
        }
        );
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div>
      {/* top */}
     <div
  className="bg-black relative bg-cover bg-center bg-no-repeat h-full"
  style={{
    backgroundImage: "url('https://abchomes.com.au/_next/image?url=https%3A%2F%2Fassets-prod.abchomes.com.au%2FHomepage%2FSA%2FABC_Secondary-Slider_1.jpg&w=3840&q=75')",
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/40"></div>

  {/* Content */}
  <div className="relative flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto h-[650px]">
    <h1 className="text-white font-bold text-3xl lg:text-6xl mt-10">
      Find your next <span className="text-slate-300">perfect</span>
      <br />
      place <span className="text-slate-300">with</span> ease
    </h1>

    <div className="text-gray-200 text-xs sm:text-2xl max-w-3xl">
      Jayfas Estate is the best place to find your next perfect place to live.
      <br />
      We have a wide range of properties for you to choose from.
    </div>

    <Link
  to="/search"
  className="inline-block px-6 py-3 text-lg 
             font-semibold text-black bg-blue-200
             rounded-3xl hover:bg-blue-700
             transition duration-300 w-fit"
>
  Let’s get started →
</Link>

  </div>
</div>

      {/* swiper */}
      {/* <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[500px]'
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper> */}

      {/* listing results for offer, sale and rent */}

      <div className=' max-w-full mx-auto p-3 flex flex-col gap-8 my-10 h-[50px]'>
     
 
    {offerListings && offerListings.length > 0 && (
      <>
        <div className="my-3 text-center">
          <h2 className="text-4xl font-semibold text-slate-600">
            Recent places for offers
          </h2>

          <Link
            to="/search?offer=true"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            Show more offers →
          </Link>
        </div>

        <div className="flex flex-wrap gap-4 bg-gray-100 py-8 px-3">
          {offerListings.map((listing) => (
            <ListingItem listing={listing} key={listing._id} />
          ))}
        </div>
      </>
    )}

        {rentListings && rentListings.length > 0 && (
        <>
            <div className='my-3 text-center '>
              <h2 className='text-4xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4 bg-gray-100 py-8 px-3'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
       </>
        )}
        {saleListings && saleListings.length > 0 && (
          <>
            <div className='my-3 text-center'>
              <h2 className='text-4xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4 bg-gray-100 py-8 px-3'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
