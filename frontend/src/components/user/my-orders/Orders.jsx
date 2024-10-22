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
