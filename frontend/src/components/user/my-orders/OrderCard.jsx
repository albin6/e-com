import React from "react";
import { useNavigate } from "react-router-dom";

function OrderCard({ order }) {
  const navigate = useNavigate();
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white">
        <div>
          <span className="text-sm font-medium">Order Placed:</span>
          <span className="text-sm"> {order.date}</span>
        </div>
        <div>
          <span className="text-sm font-medium">Total:</span>
          <span className="text-sm"> ₹{order.total}</span>
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
        <div className="md:col-span-2 flex space-x-4">
          <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden">
            <img
              src="/placeholder.svg?height=80&width=80"
              alt="Product"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm">{order.productName}</p>
            <p className="text-sm font-medium">Price: ₹{order.price}</p>
            {order.returnEligible && (
              <p className="text-xs text-red-500">{order.returnEligible}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-between items-end space-y-2">
          <div
            className={`text-sm font-medium ${
              order.status === "PROCESSING" ? "text-blue-600" : "text-green-600"
            }`}
          >
            Status: {order.status}
          </div>
          <div className="space-x-2">
            {order.status === "PROCESSING" ? (
              <button className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600">
                Cancel Order
              </button>
            ) : (
              <button className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600">
                Return
              </button>
            )}
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
              Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;
