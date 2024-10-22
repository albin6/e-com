<<<<<<< HEAD
import OrderCard from "./OrderCard";

function Orders() {
  const orders = [
    {
      id: "407-3553833-2519631",
      date: "15 September 2024",
      total: "299.00",
      customerName: "Customer Name",
      productName:
        "HELLO ZONE Back Cover Case for CMF by Nothing Phone 1 - Smoke Grey Transparent",
      price: "299.00",
      status: "PROCESSING",
    },
    {
      id: "407-3553833-2519631",
      date: "15 September 2024",
      total: "299.00",
      customerName: "Customer Name",
      productName:
        "HELLO ZONE Back Cover Case for CMF by Nothing Phone 1 - Smoke Grey Transparent",
      price: "299.00",
      status: "DELIVERED",
      returnEligible: "Return eligible through 27-Sept-2024",
    },
    {
      id: "407-3553833-2519631",
      date: "15 September 2024",
      total: "299.00",
      customerName: "Customer Name",
      productName:
        "HELLO ZONE Back Cover Case for CMF by Nothing Phone 1 - Smoke Grey Transparent",
      price: "299.00",
      status: "DELIVERED",
      returnEligible: "Return eligible through 27-Sept-2024",
    },
  ];

  return (
    <div className="container mx-auto p-4 space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

export default Orders;
=======
import { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import { axiosInstance } from "../../../config/axiosInstance";
import { useAllOrders } from "../../../hooks/CustomHooks";
import { getOrdersUser } from "../../../utils/order/orderCRUD";

export default function Component() {
  const [orders, setOrders] = useState([]);

  const { data } = useAllOrders(getOrdersUser);

  useEffect(() => {
    setOrders(data);
  }, [data]);

  return (
    <div className="container mx-auto p-4 space-y-4">
      {orders &&
        orders.map((order, index) => (
          <OrderCard key={order.id} order={order} />
        ))}
    </div>
  );
}
>>>>>>> wishlist-cart-management
