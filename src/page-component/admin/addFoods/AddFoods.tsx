import { createFood } from "../../../service/service";
import styles from "../../../../public/css/AddFoods.module.css";
import { useState } from "react";


const AddFoods = () => {
  const [newFood, setNewFood] = useState({
    image: "",
    name: "",
    description: "",
    quantity: 0,
    price: 0,
    meal_type: "",
  }) as any;
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImageFile(file);
    }
  };

  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = newFood.image;
    if (imageFile) {
      const uploadedImageUrl = await uploadImage(imageFile);
      imageUrl = uploadedImageUrl;
    }

    try {
      const food = await createFood({
        ...newFood,
        image: imageUrl,
      });
 
      setNewFood({
        image: "",
        name: "",
        description: "",
        quantity: 0,
        price: 0,
        meal_type: "",
      });
      setImageFile(null);
    } catch (error) {
      console.error("Error adding food:", error);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
      }, 1000);
    });
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.formHeading}>Add a New Food</h3>
      <form onSubmit={handleAddFood}>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="foodName">Food Name</label>
            <input
              type="text"
              id="foodName"
              className="form-control"
              value={newFood.name}
              onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
              placeholder="Food name"
              required
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="foodDescription">Description</label>
            <input
              type="text"
              id="foodDescription"
              className="form-control"
              value={newFood.description}
              onChange={(e) =>
                setNewFood({ ...newFood, description: e.target.value })
              }
              placeholder="Food description"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="foodImage">Image Upload</label>
          <input
            type="file"
            id="foodImage"
            className="form-control"
            onChange={handleImageUpload}
            accept="image/*"
          />
          {imageFile && <p>Selected File: {imageFile.name}</p>}{" "}
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="foodQuantity">Quantity</label>
            <input
              type="number"
              id="foodQuantity"
              className="form-control"
              value={newFood.quantity}
              onChange={(e) =>
                setNewFood({ ...newFood, quantity: Number(e.target.value) })
              }
              placeholder="Quantity"
              required
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="foodPrice">Price</label>
            <input
              type="number"
              step="0.01"
              id="foodPrice"
              className="form-control"
              value={newFood.price}
              onChange={(e) =>
                setNewFood({ ...newFood, price: Number(e.target.value) })
              }
              placeholder="Price"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="foodMealType">Meal Type</label>
          <input
            type="text"
            id="foodMealType"
            className="form-control"
            value={newFood.meal_type}
            onChange={(e) =>
              setNewFood({ ...newFood, meal_type: e.target.value })
            }
            placeholder="Meal type"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Food
        </button>
      </form>
    </div>
  );
};

export default AddFoods;
