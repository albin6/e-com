import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Pagination from "../user/Pagination";

const CouponValidationSchema = Yup.object().shape({
  code: Yup.string().required("Code is required"),
  discount_type: Yup.string()
    .oneOf(["percentage", "fixed"])
    .required("Discount type is required"),
  discount_value: Yup.number().min(0).required("Discount value is required"),
  min_purchase_amount: Yup.number()
    .min(0)
    .required("Minimum purchase amount is required"),
  max_discount_amount: Yup.number().min(0).nullable(),
  start_date: Yup.date().required("Start date is required"),
  expiration_date: Yup.date()
    .min(Yup.ref("start_date"), "Expiration date must be after start date")
    .required("Expiration date is required"),
  usage_limit: Yup.number().integer().min(1).nullable(),
});

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [couponToToggle, setCouponToToggle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [couponsPerPage] = useState(10);

  useEffect(() => {
    // Fetch coupons from API
    // This is a placeholder. Replace with actual API call.
    const fetchCoupons = async () => {
      // Simulating API call
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve(
              Array.from({ length: 50 }, (_, i) => ({
                _id: (i + 1).toString(),
                code: `COUPON${i + 1}`,
                discount_type: i % 2 === 0 ? "percentage" : "fixed",
                discount_value: (i + 1) * 5,
                isActive: i % 3 === 0,
              }))
            ),
          500
        )
      );
      setCoupons(response);
    };

    fetchCoupons();
  }, []);

  const initialCouponState = {
    code: "",
    discount_type: "percentage",
    discount_value: 0,
    min_purchase_amount: 0,
    max_discount_amount: null,
    start_date: new Date().toISOString().split("T")[0],
    expiration_date: "",
    usage_limit: null,
    isActive: true,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    // Here you would typically send the data to your backend API
    console.log("Submitting coupon data:", values);

    // Simulating API call
    setTimeout(() => {
      if (editingCoupon) {
        // Update existing coupon
        setCoupons(
          coupons.map((c) =>
            c._id === editingCoupon._id ? { ...c, ...values } : c
          )
        );
      } else {
        // Add new coupon
        setCoupons([...coupons, { ...values, _id: Date.now().toString() }]);
      }
      setIsModalOpen(false);
      setEditingCoupon(null);
      setSubmitting(false);
    }, 500);
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleToggleActive = (coupon) => {
    setCouponToToggle(coupon);
    setIsConfirmModalOpen(true);
  };

  const confirmToggleActive = () => {
    setCoupons(
      coupons.map((c) =>
        c._id === couponToToggle._id ? { ...c, isActive: !c.isActive } : c
      )
    );
    setIsConfirmModalOpen(false);
    setCouponToToggle(null);
  };

  // Get current coupons
  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = coupons.slice(indexOfFirstCoupon, indexOfLastCoupon);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Coupon Management</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 mb-4"
      >
        Add New Coupon
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Code</th>
              <th className="py-3 px-6 text-left">Type</th>
              <th className="py-3 px-6 text-left">Value</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {currentCoupons.map((coupon) => (
              <tr
                key={coupon._id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {coupon.code}
                </td>
                <td className="py-3 px-6 text-left">{coupon.discount_type}</td>
                <td className="py-3 px-6 text-left">{coupon.discount_value}</td>
                <td className="py-3 px-6 text-left">
                  <span
                    className={`py-1 px-3 rounded-full text-xs ${
                      coupon.isActive
                        ? "bg-green-200 text-green-600"
                        : "bg-red-200 text-red-600"
                    }`}
                  >
                    {coupon.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-6 text-left">
                  <button
                    onClick={() => handleEdit(coupon)}
                    className="text-white mr-2 bg-gray-800 px-3 py-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleActive(coupon)}
                    className="text-white hover:bg-gray bg-gray-600 px-3 py-2 rounded"
                  >
                    {coupon.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(coupons.length / couponsPerPage)}
        paginate={paginate}
      />

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
              </h3>
              <Formik
                initialValues={editingCoupon || initialCouponState}
                validationSchema={CouponValidationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="mt-2 text-left">
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="code"
                      >
                        Code
                      </label>
                      <Field
                        type="text"
                        id="code"
                        name="code"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <ErrorMessage
                        name="code"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="discount_type"
                      >
                        Discount Type
                      </label>
                      <Field
                        as="select"
                        id="discount_type"
                        name="discount_type"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </Field>
                      <ErrorMessage
                        name="discount_type"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="discount_value"
                      >
                        Discount Value
                      </label>
                      <Field
                        type="number"
                        id="discount_value"
                        name="discount_value"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <ErrorMessage
                        name="discount_value"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="min_purchase_amount"
                      >
                        Minimum Purchase Amount
                      </label>
                      <Field
                        type="number"
                        id="min_purchase_amount"
                        name="min_purchase_amount"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <ErrorMessage
                        name="min_purchase_amount"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="max_discount_amount"
                      >
                        Maximum Discount Amount
                      </label>
                      <Field
                        type="number"
                        id="max_discount_amount"
                        name="max_discount_amount"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <ErrorMessage
                        name="max_discount_amount"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="start_date"
                      >
                        Start Date
                      </label>
                      <Field
                        type="date"
                        id="start_date"
                        name="start_date"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <ErrorMessage
                        name="start_date"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="expiration_date"
                      >
                        Expiration Date
                      </label>
                      <Field
                        type="date"
                        id="expiration_date"
                        name="expiration_date"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <ErrorMessage
                        name="expiration_date"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="usage_limit"
                      >
                        Usage Limit
                      </label>
                      <Field
                        type="number"
                        id="usage_limit"
                        name="usage_limit"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <ErrorMessage
                        name="usage_limit"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        {editingCoupon ? "Update Coupon" : "Add Coupon"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                          setEditingCoupon(null);
                        }}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}

      {isConfirmModalOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="confirm-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Confirm Status Change
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to{" "}
                  {couponToToggle?.isActive ? "deactivate" : "activate"} the
                  coupon "{couponToToggle?.code}"?
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={confirmToggleActive}
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Yes, {couponToToggle?.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="mt-3 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;
