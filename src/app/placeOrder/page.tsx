'use client'
import PlaceOrders from '@/page-component/placeOrders/PlaceOrders';
import { useRouter } from 'next/navigation'; // Keep this for navigation actions like router.push
import { useSearchParams } from 'next/navigation'; // Import useSearchParams to access query params
import React, { useEffect, useState } from 'react';

const Page = () => {
  const searchParams = useSearchParams(); 
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const selectedFoodsParam = searchParams.get('selectedFoods');
    if (selectedFoodsParam) {
      try {
        const decodedFoods = JSON.parse(decodeURIComponent(selectedFoodsParam));
        setFoods(decodedFoods);
      } catch (error) {
        console.error("Error decoding foods:", error);
      }
    }
  }, [searchParams]);

  return (
    <div>
      <PlaceOrders selectedFoods={foods} />
    </div>
  );
};

export default Page;
