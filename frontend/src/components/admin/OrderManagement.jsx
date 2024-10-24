import React, { useEffect, useState } from "react";
import OrderCancellation from "./OrderCancellation";
import SelectStatus from "./SelectStatus";
import { useAllOrders, useAllOrdersMutation } from "../../hooks/CustomHooks";
import {
  cancelOrderAdmin,
  changeOrderStatus,
  getOrders,
} from "../../utils/order/orderCRUD";
import toast from "react-hot-toast";
import NoOrdersFoundAdmin from "./NoOrderFoundAdmin";
import OrderDetails from "../user/my-orders/OrderDetails";
import { Button } from "@headlessui/react";
import { X } from "lucide-react";
import Pagination from "../user/Pagination";

export default function Component() {
  // ===========================================================================
  // ========================== for pagination =================================
  const itemsPerPage = 4;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ===========================================================================

  const { data, isLoading } = useAllOrders(
    getOrders,
    currentPage,
    itemsPerPage
  );
  const { mutate: cancel_order } = useAllOrdersMutation(cancelOrderAdmin);
  const { mutate: changeStatus } = useAllOrdersMutation(changeOrderStatus);
  const [orders, setOrders] = useState([]);

  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (data) {
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 0);
    }
  }, [data]);

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

  if (orders && !orders.length) {
    return <NoOrdersFoundAdmin />;
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
                    ₹
                    {order.order_items
                      .reduce((total, item) => total + item.total_price, 0)
                      .toFixed(2)}
                  </td>
                  <td className="p-2 flex">
                    <OrderCancellation
                      order={{ id: order._id, status: order.order_status }}
                      handleCancelOrder={handleCancelOrder}
                    />
                    <button
                      onClick={() => {
                        setOrderId(order._id);
                        setIsOrderDetailsModalOpen(true);
                      }}
                      className="hover:cursor-pointer px-4 py-2 text-sm font-medium ml-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-800 text-white"
                    >
                      Order Details
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
        {isOrderDetailsModalOpen && (
          <>
            <div className="fixed bg-black opacity-50 inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none"></div>
            <div className="bg-white flex-col max-w-5xl rounded h-3/4 my-auto mx-auto fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOrderDetailsModalOpen(false)}
                className=""
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
              <OrderDetails orderId={orderId} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
