import React, { useEffect, useState } from "react";
import { ChevronRight, Edit2 } from "lucide-react";
import {
  useCartProduct,
  useDirectCheckoutProduct,
  useProfileAddress,
  useProfileAddressMutation,
} from "../../../hooks/CustomHooks";
import {
  addNewAddress,
  updateUserAddress,
} from "../../../utils/address/addressCRUD";
import AddEditAddressModal from "../Address/AddEditAddressModal";
import OrderSummaryModal from "../my-orders/OrderSummaryModal";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const useQueryParams = () => {
  return new URLSearchParams(useLocation().search);
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  // ==============================================================================
  // ==============================================================================

  const query = useQueryParams();
  const productId = query.get("productId");
  const variant = query.get("currVariant");

  const { data: singleProduct } = useDirectCheckoutProduct({
    variant,
    productId,
  });

  // ==============================================================================
  // ==============================================================================

  const { data: products, isError, isLoading } = useCartProduct();

  const [selectedAddress, setSelectedAddress] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [addresses, setAddresses] = useState(null);
  const [cart, setCart] = useState([]);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isOrderSummaryModalOpen, setIsOrderSummaryModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const { data: profileAddress } = useProfileAddress();
  const { mutate: addAddress } = useProfileAddressMutation(addNewAddress);
  const { mutate: updateAddress } =
    useProfileAddressMutation(updateUserAddress);

  useEffect(() => {
    setAddresses(profileAddress?.addresses);
  }, [profileAddress]);

  useEffect(() => {
    if (productId) {
      console.log(productId, variant);
      console.log("direct checkout=================>", singleProduct);
      setCart(singleProduct);
    } else {
      setCart(products);
    }
  }, [products, singleProduct]);

  const handleAddressEdit = (address) => {
    setEditingAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleAddressSave = (addressData) => {
    if (editingAddress) {
      updateAddress(addressData, {
        onSuccess: () => toast.success("Address updated successfully"),
      });
    } else {
      addAddress(addressData, {
        onSuccess: () => toast.success("Address added successfully"),
      });
    }
    setIsAddressModalOpen(false);
    setEditingAddress(null);
  };

  let subtotal = 0;
  if (products?.items) {
    subtotal = products.items.reduce(
      (sum, product) => sum + product.totalPrice * product.quantity,
      0
    );
  }
  const shipping = 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    setIsOrderSummaryModalOpen(true);
  };

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  if (isError) {
    return <div>Error: {isError.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex mb-8 text-sm">
        <a href="#" className="text-gray-500 hover:text-gray-700">
          Account
        </a>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-500" />
        <a href="#" className="text-gray-500 hover:text-gray-700">
          Product
        </a>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-500" />
        <a href="#" className="text-gray-500 hover:text-gray-700">
          View Cart
        </a>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-500" />
        <span className="text-gray-900 font-medium">Checkout</span>
      </nav>

      <h1 className="text-3xl font-bold mb-8">Billing Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
          {addresses && addresses.length > 0 ? (
            addresses.map((address, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg relative">
                <input
                  type="radio"
                  id={`address-${index}`}
                  name="address"
                  value={index}
                  checked={selectedAddress === index}
                  onChange={() => setSelectedAddress(index)}
                  className="absolute right-4 top-4"
                />
                <button
                  onClick={() => handleAddressEdit(address)}
                  className="absolute right-12 top-4 text-gray-500 hover:text-gray-600"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <label
                  htmlFor={`address-${index}`}
                  className="flex flex-col cursor-pointer"
                >
                  <h3 className="font-semibold">{address.name}</h3>
                  <p>
                    {address.firstName} {address.lastName}
                  </p>
                  <p>{address.address}</p>
                  <p>{`${address.district}, ${address.state} ${address.pinCode}`}</p>
                  <p>{address.phone}</p>
                </label>
              </div>
            ))
          ) : (
            <div className="h-1/5 text-center font-medium text-xl">
              No Addresses!
            </div>
          )}
          <button
            className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition-colors"
            onClick={() => {
              setEditingAddress(null);
              setIsAddressModalOpen(true);
            }}
          >
            Add New Address
          </button>

          <h2 className="text-xl font-semibold mt-8 mb-4">Payment Methods</h2>
          <p className="mb-4 text-sm text-gray-600">
            Select any payment methods
          </p>
          {["Credit Card/ Debit Card", "Bank", "UPI", "Cash on Delivery"].map(
            (method, index) => (
              <div key={index} className="flex items-center mb-4">
                <input
                  type="radio"
                  id={`payment-${index}`}
                  name="payment"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                  className="mr-2"
                />
                <label htmlFor={`payment-${index}`}>{method}</label>
              </div>
            )
          )}
          {paymentMethod === "Debit Card / Credit Card" && (
            <div className="flex space-x-2 mt-2">
              <img
                src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FFile%3AUPI-Logo-vector.svg&psig=AOvVaw1SiJwzbbZtHknJFR6ZmftG&ust=1729533159596000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNiik6LDnYkDFQAAAAAdAAAAABAE"
                alt="UPI"
                className="h-5"
              />
              <img
                src="https://cdn.worldvectorlogo.com/logos/visa-10.svg"
                alt="Visa"
                className="h-5"
              />
              <img
                src="https://cdn.worldvectorlogo.com/logos/mastercard-6.svg"
                alt="Mastercard"
                className="h-5"
              />
              <img
                src="https://cdn.worldvectorlogo.com/logos/rupay.svg"
                alt="Rupay"
                className="h-5"
              />
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cart?.items &&
            cart.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-4"
              >
                <div className="flex items-center">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/products/${
                      item.product.variants.filter(
                        (variant) => variant.sku === item.variant
                      )[0].images[0]
                    }`}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover mr-4"
                  />
                  <div className="flex flex-col">
                    <span>{item.product.name}</span>
                    {item.product.variants
                      .filter((variant) => variant.sku === item.variant)
                      .map((variant) => (
                        <span key={variant.sku} className="text-xs">
                          {variant.ram}, {variant.storage}, {variant.color}
                        </span>
                      ))}
                  </div>
                </div>
                <span>
                  ₹{item.totalPrice} x {item.quantity}
                </span>
              </div>
            ))}

          {productId ? (
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>
                  ₹{cart?.totalAmount && cart?.totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>
                  ₹{cart?.totalAmount && cart?.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="mt-8 flex space-x-2">
            <input
              type="text"
              placeholder="Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-grow border rounded px-3 py-2"
            />
            <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">
              Apply Coupon
            </button>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-gray-800 text-white py-3 rounded mt-8 hover:bg-gray-700 transition-colors"
          >
            Place Order
          </button>
        </div>
      </div>
      {isAddressModalOpen && (
        <AddEditAddressModal
          address={editingAddress}
          onClose={() => {
            setIsAddressModalOpen(false);
            setEditingAddress(null);
          }}
          onSave={handleAddressSave}
        />
      )}
      {isOrderSummaryModalOpen && !productId ? (
        <OrderSummaryModal
          cart={cart}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          paymentMethod={paymentMethod}
          selectedAddress={addresses[selectedAddress]}
          onPlace={(orderId) => {
            setIsOrderSummaryModalOpen(false);
            navigate(`/profile/orders/${orderId}`);
          }}
          onClose={() => setIsOrderSummaryModalOpen(false)}
        />
      ) : (
        isOrderSummaryModalOpen && (
          <OrderSummaryModal
            cart={cart}
            subtotal={cart?.totalAmount}
            shipping={shipping}
            total={cart?.totalAmount}
            paymentMethod={paymentMethod}
            selectedAddress={addresses[selectedAddress]}
            onPlace={(orderId) => {
              setIsOrderSummaryModalOpen(false);
              navigate(`/profile/orders/${orderId}`);
            }}
            onClose={() => setIsOrderSummaryModalOpen(false)}
          />
        )
      )}
    </div>
  );
}
