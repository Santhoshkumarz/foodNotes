import { get, post, getById, put, deleteRequest } from "./api";

// Define the interface for the food object
interface Order {
  order_date: string;
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    mealType: string;
  }[];
  totalPrice: string;
}

// Service functions for interacting with /api/foods

// Get all orders
const getOrder = async (): Promise<Order[]> => {
    try {
      const response = await get<Order[]>(`/api/food-orders`);
      return response;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  };

// Get a single orders by ID
const getOrderById = async (id: number): Promise<Order> => {
  try {
    const response = await getById<Order>("/api/food-orders", id);
    return response;
  } catch (error) {
    console.error("Error fetching orders by ID:", error);
    throw error;
  }
};

// Create a new orders
const createOrder = async (newFood: Order): Promise<Order> => {
  try {
    const response = await post<Order>("/api/food-orders", newFood);
    return response;
  } catch (error) {
    console.error("Error creating orders:", error);
    throw error;
  }
};

// Update an existing orders
const updateOrder = async (id: number, updatedFood: Order): Promise<Order> => {
  try {
    const response = await put<Order>("/api/food-orders", id, updatedFood);
    return response;
  } catch (error) {
    console.error("Error updating orders:", error);
    throw error;
  }
};

// Delete a orders by ID
const deleteOrder = async (id: number): Promise<void> => {
  try {
    await deleteRequest<void>("/api/food-orders", id);
  } catch (error) {
    console.error("Error deleting orders:", error);
    throw error;
  }
};

export { getOrder, getOrderById, createOrder, updateOrder, deleteOrder };
