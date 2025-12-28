import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
      const res = await fetch(`http://localhost:3000/api/listing/get/${params.listingId}`, {
        method: 'GET',
        credentials: 'include', // ✅ send cookies for session auth
      });
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className="bg-gray-50 min-h-screen">
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && <p className="text-center my-7 text-2xl">Something went wrong!</p>}

      {listing && !loading && !error && (
        <>
          {/* Image Slider */}
          <Swiper navigation className="h-[450px]">
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[450px] w-full bg-center bg-cover"
                  style={{ backgroundImage: `url(${url})` }}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Share Button */}
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-white shadow cursor-pointer">
            <FaShare
              className="text-gray-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            />
          </div>

          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-white p-2 shadow">
              Link copied!
            </p>
          )}

          {/* Listing Details */}
          <div className="max-w-6xl mx-auto p-6 py-3 my-10 flex flex-col gap-3  r">
            {/* Title & Price */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                {listing.name}
              </h1>
              <p className="text-2xl font-semibold text-blue-800">
                ${listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                {listing.type === 'rent' && ' / month'}
              </p>
            </div>

            {/* Address */}
            <div className="flex items-center gap-2 text-gray-600 text-lg md:text-xl">
              <FaMapMarkerAlt className="text-green-600" />
              {listing.address}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mt-4">
              <span className={`px-10 py-2 rounded-md font-semibold text-white ${listing.type === 'rent' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </span>
              {listing.offer && (
                <span className="px-10 py-2 rounded-md font-semibold text-white bg-green-600">
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mt-6 text-gray-700 text-lg">
              <span className="font-semibold text-gray-900">Description: </span>
              {listing.description}
            </div>

            {/* Features */}
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4  text-gray-700">
              <div className="flex items-center gap-1 text-xl">
                <FaBed className="text-5xl text-blue-600" /> {listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}
              </div>
              <div className="flex items-center gap-1">
                <FaBath className="text-5xl text-blue-600" /> {listing.bathrooms} {listing.bathrooms > 1 ? 'Baths' : 'Bath'}
              </div>
              <div className="flex items-center gap-1 text-xl">
                <FaParking className="text-5xl text-blue-600" /> {listing.parking ? 'Parking Spot' : 'No Parking'}
              </div>
              <div className="flex items-center gap-1 text-xl">
                <FaChair className="text-5xl text-blue-600" /> {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </div>
            </div>

            {/* Contact Button */}
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="mt-6 w-full md:w-1/2 bg-blue-700 hover:bg-blue-800 text-white font-semibold p-3 rounded-lg transition-all"
              >
                Contact Landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </>
      )}
    </main>
  );
}
