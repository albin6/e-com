<<<<<<< HEAD
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const OrderDetails = () => {
  const naviagate = useNavigate();
  return (
    <div className="container mx-auto px-4 py-8">
=======
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CancelOrderModal from "./CancelOrderModal";
import { toast } from "react-toastify";
import {
  useOrderDetails,
  useOrderDetailsMutation,
} from "../../../hooks/CustomHooks";
import { cancelOrder, getOrderDetails } from "../../../utils/order/orderCRUD";

const OrderDetails = () => {
  const naviagate = useNavigate();
  const { orderId } = useParams();

  const { data: order_data } = useOrderDetails(getOrderDetails(orderId));
  const { mutate: cancel_order } = useOrderDetailsMutation(cancelOrder);

  const [userName, setUserName] = useState("");
  const [order, setOrder] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleConfirmCancel = () => {
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
    // Logic to cancel the order
    console.log("Order cancelled");
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (order_data) {
      setUserName(order_data.customerName);
      setOrder(order_data);
    }
  }, [order_data]);

  if (!order) {
    return <h4>Loading....</h4>;
  }

  return (
    <div className="container w-2/3 mx-auto px-4 py-8">
>>>>>>> wishlist-cart-management
      <nav className="text-sm mb-4">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link to={"/"} className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="mx-2">/</span>
          </li>
          <li className="flex items-center">
            <Link to={"/profile"} className="text-gray-500 hover:text-gray-700">
              Account
            </Link>
            <span className="mx-2">/</span>
          </li>
          <li onClick={() => naviagate(-1)} className="flex items-center">
            <Link className="text-gray-500 hover:text-gray-700">My Orders</Link>
            <span className="mx-2">/</span>
          </li>
          <li className="flex items-center">
            <span className="text-gray-700">Order Details</span>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Order Details</h1>
<<<<<<< HEAD
        <p className="text-gray-600">
          Welcome! <span className="text-red-500">Customer Name</span>
        </p>
=======
        {userName && (
          <p className="text-sm text-gray-600">
            Welcome!{" "}
            <span className="text-gray-800 text-base font-medium">
              {userName}
            </span>
          </p>
        )}
>>>>>>> wishlist-cart-management
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <p className="text-gray-600 text-sm mb-2 sm:mb-0">
<<<<<<< HEAD
              Ordered on 15 September 2024 | Order# 407-3553833-2519631
=======
              Ordered on {order && order.date} | Order# {orderId}
>>>>>>> wishlist-cart-management
            </p>
            <button className="text-blue-600 hover:text-blue-800 text-sm">
              Invoice
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
<<<<<<< HEAD
              <p className="text-sm">Customer Name</p>
              <p className="text-sm">House Name</p>
              <p className="text-sm">Place, District</p>
              <p className="text-sm">State - Pin Code</p>
              <p className="text-sm">Contact Number</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Payment Method</h3>
              <p className="text-sm">Cash On Delivery</p>
=======
              <p className="text-sm">{order.customerName}</p>
              <p className="text-sm">{order.orders.shipping_address.address}</p>
              <p className="text-sm">
                {order.orders.shipping_address.district},{" "}
                {order.orders.shipping_address.state}
              </p>
              <p className="text-sm">
                Pin Code - {order.orders.shipping_address.zip}
              </p>
              <p className="text-sm">
                Contact Number - {order.orders.shipping_address.phone}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Payment Method</h3>
              <p className="text-sm">{order.orders.payment_method}</p>
>>>>>>> wishlist-cart-management
            </div>
            <div>
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="flex justify-between text-sm">
                <p>Items Total</p>
<<<<<<< HEAD
                <p>₹249.00</p>
              </div>
              <div className="flex justify-between text-sm">
                <p>Shipping Charge</p>
                <p>₹40.00</p>
              </div>
              <div className="flex justify-between font-semibold text-sm">
                <p>Total</p>
                <p>₹289.00</p>
              </div>
              <div className="flex justify-between font-semibold text-sm mt-2">
                <p>Grand Total</p>
                <p>₹289.00</p>
=======
                <p>₹{order.orders.total_price_with_discount.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p>Shipping Charge</p>
                <p>₹{order.orders.shipping_fee.toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-semibold text-sm">
                <p>Total</p>
                <p>₹{order.orders.total_price_with_discount.toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-semibold text-sm mt-2">
                <p>Grand Total</p>
                <p>₹{order.orders.total_price_with_discount.toFixed(2)}</p>
>>>>>>> wishlist-cart-management
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
<<<<<<< HEAD
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <img
                src="/placeholder.svg"
                alt="HELLO ZONE Back Cover Case"
                className="w-[150px] h-[150px] rounded-md object-cover"
              />
              <div className="flex-grow">
                <h3 className="font-semibold mb-2">
                  HELLO ZONE Back Cover Case for CMF by Nothing Phone 1 - Smoke
                  Grey Transparent
                </h3>
                <p className="text-gray-600 mb-2">Price: ₹289.00</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <p className="text-green-600 font-semibold mb-2 sm:mb-0">
                    Status : PROCESSING
                  </p>
                  <div className="space-y-2 sm:space-y-0 sm:space-x-2">
                    <button className="w-full sm:w-auto bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                      Track Order
                    </button>
                    <button className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                      Cancel Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Just For You</h2>
          <button className="text-blue-600 hover:text-blue-800">See All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img
                src="/placeholder.svg"
                alt={`CMF BY NOTHING PHONE ${item}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-2">
                  CMF BY NOTHING PHONE {item}
                </h3>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500 mr-1">★★★★★</span>
                  <span className="text-gray-600 text-sm">(5.0)</span>
                </div>
                <p className="text-red-600 font-semibold">₹15,599</p>
                <p className="text-gray-500 line-through text-sm">₹18,999</p>
              </div>
            </div>
          ))}
        </div>
      </div>
=======
            {order &&
              order?.orders?.order_items.map((o) => (
                <div
                  key={o._id}
                  className="flex flex-col sm:flex-row items-start gap-4 mb-4"
                >
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/products/${
                      o.product.variants[0].images[0]
                    }`}
                    alt="HELLO ZONE Back Cover Case"
                    className="w-[80px] h-[80px] rounded-md object-cover"
                  />
                  <div className="flex-grow flex justify-between">
                    <div>
                      <h3 className="font-semibold mb-2">
                        {o.product.name} ( {o.product.variants[0].ram},{" "}
                        {o.product.variants[0].storage},{" "}
                        {o.product.variants[0].color})
                      </h3>
                      <p className="text-gray-600 mb-2">
                        Price: ₹{o.total_price}{" "}
                        <span className="text-sm text-green-800 font-semibold">
                          <strike className=" text-red-800">₹{o.price}</strike>{" "}
                          {o.discount} %
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between">
                      <p className="text-green-600 font-semibold mb-2 sm:mb-0">
                        Status : {order.orders.order_status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            <div className="space-y-2 flex justify-end sm:space-y-0 sm:space-x-2">
              {order.orders.order_status === "Cancelled" ? (
                <button
                  className="cursor-not-allowed w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  disabled
                >
                  Cancelled
                </button>
              ) : (
                <button
                  onClick={handleOpenModal}
                  className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              )}
            </div>
            <CancelOrderModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onConfirm={handleConfirmCancel}
              orderNumber={orderId}
            />
          </div>
        </div>
      </div>
>>>>>>> wishlist-cart-management
    </div>
  );
};

export default OrderDetails;
