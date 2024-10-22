import React, { useEffect } from "react";
import OrderCancellation from "./OrderCancellation";
import SelectStatus from "./SelectStatus";
import { useAllOrders, useAllOrdersMutation } from "../../hooks/CustomHooks";
import {
  cancelOrderAdmin,
  changeOrderStatus,
  getOrders,
} from "../../utils/order/orderCRUD";
import toast from "react-hot-toast";

export default function Component() {
  const { data: orders, isLoading } = useAllOrders(getOrders);
  const { mutate: cancel_order } = useAllOrdersMutation(cancelOrderAdmin);
  const { mutate: changeStatus } = useAllOrdersMutation(changeOrderStatus);

  useEffect(() => console.log(orders), [orders]);

  const handleStatusChange = (orderId, newStatus) => {
    // Implement status change logic here
    console.log(`Changing status of order ${orderId} to ${newStatus}`);
    changeStatus(
      { orderId, status: newStatus },
      {
        onSuccess: () =>
          toast.success("Order Status Updated Successfully", {
            position: "top-center",
          }),
        onError: () =>
          toast.error("Error on changing order status", {
            position: "top-center",
          }),
      }
    );
  };

  const handleCancelOrder = (orderId) => {
    // Implement order cancellation logic here
    console.log(`Cancelling order ${orderId}`);
    cancel_order(orderId, {
      onSuccess: () =>
        toast.success("Order Cancelled Successfully", {
          position: "top-center",
        }),
      onError: () =>
        toast.error("Failed to cancel order. Please try again.", {
          position: "top-center",
        }),
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Order ID</th>
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Products</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders &&
              orders.map((order, index) => (
                <tr key={order._id} className="border-b">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{order.user_full_name}</td>
                  <td className="p-2">
                    <ul>
                      {order.order_items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item.product_name}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-2">
                    <SelectStatus
                      orderId={order._id}
                      currentStatus={order.order_status}
                      onStatusChange={handleStatusChange}
                    />
                  </td>
                  <td className="p-2">
                    {new Date(order.placed_at).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    $
                    {order.order_items
                      .reduce((total, item) => total + item.total_price, 0)
                      .toFixed(2)}
                  </td>
                  <td className="p-2">
                    <OrderCancellation
                      order={{ id: order._id, status: order.order_status }}
                      handleCancelOrder={handleCancelOrder}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
