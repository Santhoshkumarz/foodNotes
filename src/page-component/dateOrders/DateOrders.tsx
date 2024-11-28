import React, { useEffect, useState } from "react";
import styled from "./DataOrders.module.css";
import { getOrder } from "@/service/orderService";

type Food = {
  id: number;
  food_name: string;
  food_quantity: number;
  food_price: string;
  lunchOrDinner: string;
  date: string;
  totalsingleFoodPrice: string;
};

const DateOrders = () => {
  const [foodData, setFoodData] = useState<Food[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const data = await getOrder();
        const mappedData = data.map((food: any) => {
          const { id, name, quantity, price, meal_type, order_date } = food;
          const formattedDate = new Date(order_date).toLocaleDateString("en-GB");
          const priceNumber = parseFloat(price);
          const totalsingleFoodPrice = (priceNumber * quantity).toFixed(2);

          return {
            id,
            food_name: name,
            food_quantity: quantity,
            food_price: `$${price}`,
            lunchOrDinner: meal_type,
            date: formattedDate,
            totalsingleFoodPrice: `$${totalsingleFoodPrice}`,
          };
        });

        setFoodData(mappedData);
      } catch (error) {
        setError("Failed to fetch food data.");
        console.error("Error fetching foods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  // Group food data by date
  const groupedData = foodData.reduce((acc: any, food) => {
    if (!acc[food.date]) {
      acc[food.date] = [];
    }
    acc[food.date].push(food);
    return acc;
  }, {});

  const renderFoodForDate = (date: string) => {
    const foodsForDate = groupedData[date];
    return foodsForDate.map((food: Food) => (
      <div key={food.id} className={styled.card}>
        <h4>{food.food_name}</h4>
        <div className={styled.mealType}>
          <p className={food.lunchOrDinner === "Lunch" ? styled.lunch : styled.dinner}>{food.lunchOrDinner}</p>
        </div>
        <p><strong>Quantity:</strong> {food.food_quantity}</p>
        <p><strong>Price:</strong> {food.food_price}</p>
        <p><strong>Total:</strong> {food.totalsingleFoodPrice}</p>
      </div>
    ));
  };

  return (
    <div className={styled.container}>
      {loading && <div className={styled.loading}>Loading...</div>}
      {error && <div className={styled.error}>{error}</div>}
      {Object.keys(groupedData).map((date) => (
        <div key={date} className={styled.dateSection}>
          <h3>{date}</h3>
          <div className={styled.dateCardContainer}>{renderFoodForDate(date)}</div>
        </div>
      ))}
    </div>
  );
};

export default DateOrders;
