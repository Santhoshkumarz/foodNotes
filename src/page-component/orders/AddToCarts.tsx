"use client";

import React, { useState, useCallback, useMemo } from "react";
import styles from './AddToCart.module.css'

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import dummyData from "@/config/FoodsData";

interface Food {
  id: number;
  name: string;
  price: number;
  image: string;
}
const AddToCarts = () => {
  const router = useRouter();
  const { selectedFoods, addFood, removeFood, clearCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddToCart = useCallback(
    (food: Food) => {
      addFood(food);
    },
    [addFood]
  );

  const handleCancel = useCallback(
    (id: number) => {
      removeFood(id);
    },
    [removeFood]
  );

  const orderToPlace = useCallback(() => {
    router.push("/placeOrder");
  }, [router]);

  const totalPrice = useMemo(
    () => selectedFoods.reduce((acc, food) => acc + food.price, 0),
    [selectedFoods]
  );

  const filteredData = useMemo(() => {
    return searchTerm.length >= 2
      ? dummyData.filter((food) =>
          food.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : dummyData;
  }, [searchTerm]);

  return (
    <>
      <div className={styles.searchBarContainer}>
        <input
          type="text"
          placeholder="Search for food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchBar}
        />
      </div>

      <div className={styles.cartContainer}>
        {filteredData.map((food) => (
          <div key={food.id} className={styles.foodItem}>
            <img
              src={food.image}
              alt={food.name}
              className={styles.foodImage}
              onClick={() => handleAddToCart(food)}
            />
            <div className={styles.foodDetails}>
              <h3 className={styles.foodName}>{food.name}</h3>
              <p className={styles.foodPrice}>
                Price: ${food.price.toFixed(2)}
              </p>
              {selectedFoods.some(
                (selectedFood) => selectedFood.id === food.id
              ) ? (
                <button
                  onClick={() => handleCancel(food.id)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={() => handleAddToCart(food)}
                  className={styles.addButton}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.totalPriceContainer}>
        <p className={styles.totalPrice}>Total: ${totalPrice.toFixed(2)}</p>
        <button onClick={orderToPlace} className={styles.orderButton}>
          Order to Place
        </button>
      </div>
    </>
  );
};

export default AddToCarts;
