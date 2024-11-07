import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

type Order = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: string;
};

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>(); // Extract order ID from URL
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Fetch order details based on orderId (this could be an API call)
    const fetchedOrder = {
      _id: orderId,
      amount: 100,
      quantity: 1,
      discount: 0,
      status: "Pending",
    };
    setOrder(fetchedOrder ? {...fetchedOrder, _id: fetchedOrder._id || ''} : null); // Simulate fetching order by ID
  }, [orderId]);

  if (!order) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>Order Details for ID: {order._id}</h1>
      <p>
        <strong>Amount:</strong> {order.amount}
      </p>
      <p>
        <strong>Quantity:</strong> {order.quantity}
      </p>
      <p>
        <strong>Discount:</strong> {order.discount}
      </p>
      <p >
        <strong>Status:</strong> {order.status}
      </p>
    </div>
  );
};

export default OrderDetails;
