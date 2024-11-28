import React, { useState, useCallback, useMemo } from "react";
import dummyData from "../../config/FoodsData";
import styles from "./AddToCart.module.css";
import { useRouter } from "next/navigation";

interface FoodItem {
  id: number;
  image: string;
  name: string;
  price: number;
  mealType?: string;
}

const AddToCarts = () => {
  const router = useRouter();
  const [cart, setCart] = useState(new Set<number>());
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddToCart = useCallback((id: number) => {
    setCart((prev) => new Set(prev).add(id));
  }, []);

  const handleCancel = useCallback((id: number) => {
    setCart((prev) => {
      const updatedCart = new Set(prev);
      updatedCart.delete(id);
      return updatedCart;
    });
  }, []);

  const clearSelectedFoods = useCallback(() => {
    setCart(new Set());
  }, []);

  const totalPrice = useMemo(
    () =>
      dummyData.reduce(
        (acc, food) => (cart.has(food.id) ? acc + food.price : acc),
        0
      ),
    [cart]
  );

  const orderToPlace = useCallback(() => {
    const selectedFoods = dummyData.filter((food) => cart.has(food.id));
    const updatedSelectedFoods = selectedFoods.map((food) => ({
      ...food,
      mealType: getMealTypeByTime(),
    }));
    const selectedFoodsStr = encodeURIComponent(
      JSON.stringify(updatedSelectedFoods)
    );
    router.push(`/placeOrder?selectedFoods=${selectedFoodsStr}`);
    clearSelectedFoods();
    console.log("selectedFoods", updatedSelectedFoods);
  }, [cart, router, clearSelectedFoods]);

  const getMealTypeByTime = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return "Breakfast";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Lunch";
    } else {
      return "Dinner";
    }
  };

  // Filter foods based on search term
  const filteredData = useMemo(() => {
    return searchTerm.length >= 2
      ? dummyData.filter((food) =>
          food.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : dummyData;
  }, [searchTerm]);

  return (
    <>
      {/* Search Bar */}
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
              onClick={() => !cart.has(food.id) && handleAddToCart(food.id)}
            />
            <div className={styles.foodDetails}>
              <h3 className={styles.foodName}>{food.name}</h3>
              <p className={styles.foodPrice}>
                Price: ${food.price.toFixed(2)}
              </p>

              {cart.has(food.id) ? (
                <button
                  onClick={() => handleCancel(food.id)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={() => handleAddToCart(food.id)}
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
