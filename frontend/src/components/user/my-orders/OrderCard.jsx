import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cancelOrder } from "../../../utils/order/orderCRUD";
import { useOrderDetailsMutation } from "../../../hooks/CustomHooks";

export default function OrderCard({ order }) {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { mutate: cancel_order } = useOrderDetailsMutation(cancelOrder);

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    cancel_order(order.id, {
      onSuccess: () =>
        toast.success("Order Cancelled Successfully", {
          position: "top-center",
        }),
      onError: () =>
        toast.error("Failed to cancel order. Please try again.", {
          position: "top-center",
        }),
    });
    console.log("Order cancelled:", order.id);
    setShowCancelModal(false);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white">
        <div>
          <span className="text-sm font-medium">Order Placed:</span>
          <span className="text-sm"> {order.date}</span>
        </div>
        <div>
          <span className="text-sm font-medium">Total:</span>
          <span className="text-sm"> ₹{order.total.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-sm font-medium">Ship To:</span>
          <span className="text-sm"> {order.customerName}</span>
        </div>
      </div>
      <div className="flex items-center justify-between bg-gray-50 px-4 py-2">
        <p className="text-sm font-medium">
          <span className="mr-2">Order #</span>
          {order.id}
        </p>
        <button
          onClick={() => navigate(`/profile/orders/${order.id}`)}
          className="text-sm text-blue-600 hover:underline"
        >
          View Order Details
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white">
        {order &&
          order.orderItems.map((item, index) => (
            <div key={index} className="md:col-span-2 flex space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden">
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}/products/${
                    item.image
                  }`}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm">{item.productName}</p>
                <p className="text-sm font-medium">
                  Price: ₹{item.price.toFixed(2)}
                </p>
                {order &&
                  order.orderStatus !== "Cancelled" &&
                  order.returnEligible && (
                    <p className="text-xs text-red-500">
                      {order.returnEligible}
                    </p>
                  )}
              </div>
            </div>
          ))}
        <div className="flex flex-col justify-between items-end space-y-2">
          <div
            className={`text-sm font-medium ${
              order && order.orderStatus === "Cancelled"
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            Status: {order && order.orderStatus}
          </div>
          <div className="space-x-2">
            {order &&
            order.orderStatus === "Delivered" &&
            order.returnEligible === "Eligible for return" ? (
              <button className="w-full sm:w-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                Return
              </button>
            ) : order.orderStatus === "Cancelled" ? (
              <button
                className="cursor-not-allowed w-full sm:w-auto bg-red-500 text-white px-3 py-1 rounded opacity-50"
                disabled
              >
                Cancelled
              </button>
            ) : (
              <button
                onClick={handleCancelClick}
                className="w-full sm:w-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            )}
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
              Invoice
            </button>
          </div>
        </div>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Cancellation</h3>
            <p className="mb-6">Are you sure you want to cancel this order?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                No, Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
