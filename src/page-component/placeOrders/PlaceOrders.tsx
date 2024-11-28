import React, { useState, useEffect } from "react";
import styles from "./placeOrders.module.css";
import { useRouter } from "next/navigation";
import { createOrder } from "@/service/orderService";

interface Food {
  id: number;
  name: string;
  price: number;
  image: string;
  mealType: string;
}

interface PlaceOrdersProps {
  selectedFoods: Food[];
}

const PlaceOrders = ({ selectedFoods }: PlaceOrdersProps) => {
  const router = useRouter();
  const [foodQuantities, setFoodQuantities] = useState<{ [key: number]: number }>({});
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any | null>(null);
  const [isQuantityPopupOpen, setIsQuantityPopupOpen] = useState(false);
  const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);

  useEffect(() => {
    const initialQuantities = selectedFoods.reduce((quantities, food) => {
      quantities[food.id] = 1; // Initial quantity of 1
      return quantities;
    }, {} as { [key: number]: number });
    setFoodQuantities(initialQuantities);
  }, [selectedFoods]);

  const changeQuantity = (id: number, value: number) => {
    setFoodQuantities((prev) => {
      const newQuantities = { ...prev };
      newQuantities[id] = value;
      return newQuantities;
    });
  };

  const handleBack = () => {
    router.push("/addToCarts");
  };

  const handlePlaceOrder = async () => {
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    const totalPrice = selectedFoods.reduce((total, food) => {
      return total + food.price * foodQuantities[food.id];
    }, 0);
  
    const order = {
      order_date: currentDate,
      items: selectedFoods.map((food) => ({
        id: food.id,
        name: food.name,
        price: food.price,
        quantity: foodQuantities[food.id],
        mealType: food.mealType,
      })),
      totalPrice: totalPrice.toFixed(2),
    };
  
    try {
      // Create the order
      const response = await createOrder(order);
      setOrderDetails(order);
      setIsOrderPlaced(true);
  
      // Send WhatsApp message to the group
      const message = `New Order Placed!\nOrder Date: ${order.order_date}\nItems: ${order.items.map(item => `${item.name} x ${item.quantity}`).join(', ')}\nTotal Price: $${order.totalPrice}`;
      const groupName = "Test"; // Replace with your actual group name
  
      // Send message to the WhatsApp group
      await fetch("http://localhost:3001/api/whatsapp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupName,
          message,  
        }),
      });
  
      console.log("Message sent to WhatsApp group!");
  
    } catch (error) {
      console.error("Error placing order or sending message:", error);
      alert("There was an issue placing your order or sending the message. Please try again.");
    }
  };
  

  const handleCancelOrder = () => {
    setIsOrderPlaced(false);
    handleBack();
  };

  const openQuantityPopup = (foodId: number) => {
    if (isQuantityPopupOpen && selectedFoodId !== foodId) {
      closeQuantityPopup();
    }
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

  const totalPrice = selectedFoods.reduce((total, food) => {
    return total + food.price * foodQuantities[food.id];
  }, 0);

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
      <button className={styles.orderBtn} onClick={handlePlaceOrder}>
        Place Order
      </button>

      {isOrderPlaced && orderDetails && (
        <div className={styles.popupContainer}>
          <div className={styles.popup}>
            <h3>Order Placed Successfully!</h3>
            <p>Your order has been placed on: {orderDetails.date}</p>
            <div>
              <h4>Order Summary:</h4>
              <ul>
                {orderDetails.items.map((item: any) => (
                  <li key={item.id}>
                    {item.name} ({item.mealType}) - ${item.price.toFixed(2)} x {item.quantity}
                  </li>
                ))}
              </ul>
              <p>Total Price: ${orderDetails.totalPrice}</p>
            </div>
            <button className={styles.cancelBtn} onClick={handleCancelOrder}>
              <i className="fas fa-times"></i> Okay
            </button>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default PlaceOrders;
