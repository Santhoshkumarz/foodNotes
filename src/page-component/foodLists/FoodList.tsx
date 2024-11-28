import React, { useEffect, useState, useMemo } from "react";
import styled from "./Food.module.css";
import { FaEye } from "react-icons/fa";
import { getOrder } from "@/service/orderService";

// Helper function to convert decimals to fractions
const decimalToFraction = (decimal: number) => {
  if (decimal % 1 === 0) return decimal.toString(); // if it's an integer, return as is
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const denominator = 1000; // To handle decimals like 0.5, 0.25, etc.
  const numerator = decimal * denominator;
  const divisor = gcd(numerator, denominator);
  return `${numerator / divisor}/${denominator / divisor}`;
};

type Food = {
  id: number;
  order_date: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    meal_type: string;
  }>;
  totalPrice: string;
};

const FoodList = () => {
  const [foodData, setFoodData] = useState<Food[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const data = await getOrder();
        const mappedData = data.map((order: any) => {
          const { id, order_date, items, totalPrice } = order;
          const formattedDate = new Date(order_date).toLocaleDateString(
            "en-GB"
          );
          return { id, order_date: formattedDate, items, totalPrice };
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

  // Group food data by order_date for better display
  const groupedData = useMemo(() => {
    return foodData.reduce((groups: any, food) => {
      if (!groups[food.order_date]) {
        groups[food.order_date] = [];
      }
      groups[food.order_date].push(food);
      return groups;
    }, {});
  }, [foodData]);

  const totalPages = Math.ceil(foodData.length / itemsPerPage);
  const currentData = useMemo(
    () =>
      foodData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [foodData, currentPage]
  );

  const totalAmount = useMemo(() => {
    return foodData
      .reduce((sum, order) => {
        return (
          sum + order.items.reduce((itemSum, item) => itemSum + item.price, 0)
        );
      }, 0)
      .toFixed(2);
  }, [foodData]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
console.log('groupedData',groupedData);

  return (
    <>
      {loading && <div className={styled.loader}>Loading...</div>}
      {error && <div className={styled.error}>{error}</div>}
      <h4 className={styled.heading}>Foods Update</h4>
      <div className={styled.tableContainer}>
        <table className={styled.table}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Food Name</th>
              <th>Meal Type</th>
              <th>Quantity</th>
              <th>Price per Item</th>
              <th>Total Price</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedData).map((date, index) => (
              <React.Fragment key={date}>
                <tr className={styled.dateRow}>
                  <td colSpan={8} className={styled.dateColumn}>
                    <strong>{date}</strong>
                  </td>
                </tr>
                {groupedData[date].map((order: any, foodIndex: number) => (
                  <tr key={order.id}>
                  <td>{foodIndex + 1}</td>
                  <td>
                    {order.items.map((item: any, itemIndex: number) => (
                      <div key={itemIndex}>{item.name}</div>
                    ))}
                  </td>
                  <td>
                  {order.items.map((item: any, itemIndex: number) => (
                        <div key={itemIndex}>{item.mealType}</div>
                      ))}
                  </td>
                  <td>
                    {order.items.map((item: any, itemIndex: number) => (
                      <div key={itemIndex}>
                        {decimalToFraction(item.quantity)}
                      </div>
                    ))}
                  </td>
                  <td>
                    {order.items.map((item: any, itemIndex: number) => (
                      <div key={itemIndex}>
                        ${(
                          item.price * item.quantity
                        ).toFixed(2)} {/* Price based on fractional quantity */}
                      </div>
                    ))}
                  </td>
                  <td>
                    ${order.items
                      .reduce(
                        (total: any, item: any) => total + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)} {/* Total Price with quantity */}
                  </td>
                  <td>{order.order_date}</td>
                  <td>
                    <FaEye
                      className={styled.eyeIcon}
                      onClick={() =>
                        console.log("Viewing details for order ID:", order.id)
                      }
                    />
                  </td>
                </tr>
                
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <div className={styled.totalPriceContainer}>
          Total Price: <span className={styled.totalPrice}>${totalAmount}</span>
        </div>

        <div className={styled.paginationContainer}>
          <nav aria-label="Page navigation">
            <ul className="pagination">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <a
                  className="page-link"
                  href="#"
                  onClick={() => handlePageChange(currentPage - 1)}
                  tabIndex={-1}
                >
                  Previous
                </a>
              </li>
              {[...Array(totalPages)].map((_, pageIndex) => (
                <li
                  key={pageIndex + 1}
                  className={`page-item ${
                    pageIndex + 1 === currentPage ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(pageIndex + 1)}
                >
                  <a className="page-link" href="#">
                    {pageIndex + 1}
                  </a>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <a
                  className="page-link"
                  href="#"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default FoodList;
