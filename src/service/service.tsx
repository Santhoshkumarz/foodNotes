import { get, post, getById, put, deleteRequest } from "./api";

// Define the interface for the food object
interface Order {
  date: string;
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

// Get all foods
const getFoods = async (): Promise<Order[]> => {
  try {
    const response = await get<Order[]>("/api/foods");
    return response;
  } catch (error) {
    console.error("Error fetching foods:", error);
    throw error;
  }
};

// Get a single food by ID
const getFoodById = async (id: number): Promise<Order> => {
  try {
    const response = await getById<Order>("/api/foods", id);
    return response;
  } catch (error) {
    console.error("Error fetching food by ID:", error);
    throw error;
  }
};

// Create a new food
const createFood = async (newFood: Order): Promise<Order> => {
  try {
    const response = await post<Order>("/api/foods", newFood);
    return response;
  } catch (error) {
    console.error("Error creating food:", error);
    throw error;
  }
};

// Update an existing food
const updateFood = async (id: number, updatedFood: Order): Promise<Order> => {
  try {
    const response = await put<Order>("/api/foods", id, updatedFood);
    return response;
  } catch (error) {
    console.error("Error updating food:", error);
    throw error;
  }
};

// Delete a food by ID
const deleteFood = async (id: number): Promise<void> => {
  try {
    await deleteRequest<void>("/api/foods", id);
  } catch (error) {
    console.error("Error deleting food:", error);
    throw error;
  }
};

export { getFoods, getFoodById, createFood, updateFood, deleteFood };
