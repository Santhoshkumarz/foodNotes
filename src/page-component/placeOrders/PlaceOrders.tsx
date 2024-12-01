import React, { useState, useEffect } from "react";
import styles from "./placeOrders.module.css";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/service/orderService";

const PlaceOrders = () => {
  const { selectedFoods, clearCart } = useCart(); // Using useCart for selectedFoods and clearCart
  const router = useRouter();

  const [foodQuantities, setFoodQuantities] = useState<{ [key: number]: number }>({});
  const [isQuantityPopupOpen, setIsQuantityPopupOpen] = useState(false);
  const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Initialize quantities with a default value of 1 for each selected food item
    const initialQuantities = selectedFoods.reduce((quantities, food) => {
      quantities[food.id] = 1;
      return quantities;
    }, {} as { [key: number]: number });
    setFoodQuantities(initialQuantities);
  }, [selectedFoods]);

  const changeQuantity = (id: number, value: number) => {
    setFoodQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const openQuantityPopup = (foodId: number) => {
    setSelectedFoodId(foodId);
    setIsQuantityPopupOpen(true);
  };

  const closeQuantityPopup = () => {
    setSelectedFoodId(null);
    setIsQuantityPopupOpen(false);
  };

  const handleQuantitySelect = (quantity: number) => {
    if (selectedFoodId !== null) {
      changeQuantity(selectedFoodId, quantity);
    }
    closeQuantityPopup();
  };

  const totalPrice = selectedFoods.reduce(
    (total, food) => total + food.price * foodQuantities[food.id],
    0
  );

  const handlePlaceOrder = async () => {
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    
    // Create the order object
    const order: any = {
      order_date: currentDate,
      items: selectedFoods.map((food) => ({
        id: food.id,
        name: food.name,
        price: food.price,
        quantity: foodQuantities[food.id],
        mealType: food.mealType,
      })),
      totalPrice: Number(totalPrice.toFixed(2)),
    };

    try {
      // Call createOrder API
      const response = await createOrder(order);
      console.log("Order placed successfully:", response);
      setIsOrderPlaced(true);
      setOrderDetails(order);

    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place the order. Please try again.");
    }
  };

  const closeOrderModal = () => {
    setIsOrderPlaced(false);
    setOrderDetails(null);
    router.push("/");
  };

  return (
    <div className={styles.placeOrdersContainer}>
      <h2 className={styles.heading}>Place Your Order</h2>
      {selectedFoods.length > 0 ? (
        <div className={styles.foodItemsContainer}>
          {selectedFoods.map((food) => (
            <div key={food.id} className={styles.foodItem}>
              <div className={styles.foodImageContainer}>
                <img src={food.image} alt={food.name} className={styles.foodImage} />
              </div>
              <div className={styles.foodDetails}>
                <h3>{food.name} ({food.mealType})</h3>
                <p className={styles.foodPrice}>Price: ${food.price.toFixed(2)}</p>
                <div className={styles.quantityControls}>
                  <span className={styles.quantity}>Quantity: {foodQuantities[food.id]}</span>
                  <button
                    className={styles.changeQuantityBtn}
                    onClick={() => openQuantityPopup(food.id)}
                  >
                    Change Quantity
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No items selected.</p>
      )}

      <div className={styles.totalPriceContainer}>
        <span className={styles.totalPrice}>Total Price: ${totalPrice.toFixed(2)}</span>
      </div>

      <div className={styles.buttonGroup}>
        <button className={styles.orderBtn} onClick={handlePlaceOrder}>
          Place Order
        </button>
        <button className={styles.orderBtn} onClick={clearCart}>
          Clear Cart
        </button>
      </div>

      {isQuantityPopupOpen && (
        <div className={styles.quantityPopupContainer}>
          <div className={styles.quantityPopup}>
            <h3>Select Quantity</h3>
            <div className={styles.quantityOptions}>
              {[0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((quantity) => (
                <button
                  key={quantity}
                  className={styles.quantityOptionBtn}
                  onClick={() => handleQuantitySelect(quantity)}
                >
                  {quantity}
                </button>
              ))}
            </div>
            <button className={styles.closeBtn} onClick={closeQuantityPopup}>
              Close
            </button>
          </div>
        </div>
      )}

      {isOrderPlaced && orderDetails && (
        <div className={styles.orderModal}>
          <div className={styles.orderModalContent}>
            <h2>Order Placed Successfully!</h2>
            <p>Order Date: {orderDetails.order_date}</p>
            <h3>Order Summary:</h3>
            <ul>
              {orderDetails.items.map((item: any) => (
                <li key={item.id}>
                  {item.name} ({item.mealType}) - {item.quantity} x ${item.price.toFixed(2)}
                </li>
              ))}
            </ul>
            <p className={styles.totalPrice}>Total Price: ${orderDetails.totalPrice.toFixed(2)}</p>
            <button className={styles.closeOrderBtn} onClick={closeOrderModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceOrders;
