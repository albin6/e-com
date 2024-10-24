import AsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import { format_date } from "../utils/date-formatter/format-date.js";
import { return_eligible_date } from "../utils/date-formatter/return-eligible-date.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";

// =============================================================================
// user side
// =============================================================================

// for placing an order
export const place_order = AsyncHandler(async (req, res) => {
  console.log("in place_order");

  const { order_data } = req.body;

  console.log("===================================");
  console.log(order_data);
  console.log("===================================");

  const new_order = new Order({ ...order_data, user: req.user.id });

  if (new_order) {
    // Loop through each order item to update the stock
    for (const item of order_data.order_items) {
      const { product, variant, quantity } = item;

      // Find the product by ID
      const product_data = await Product.findById(product);

      if (product_data) {
        // Find the specific variant within the product's variants array
        const variant_data = product_data.variants.find(
          (v) => v.sku === variant
        );

        // Check if the variant exists and has enough stock
        if (variant_data && variant_data.stock >= quantity) {
          // Reduce the stock by the quantity purchased
          variant_data.stock -= quantity;
        } else {
          return res.status(400).json({
            success: false,
            message: `Not enough stock for variant: ${variant}`,
          });
        }

        // Save the updated product with the modified variant stock
        await product_data.save();
      }
    }
    await Cart.updateOne(
      { user: req.user.id },
      {
        $pull: {
          items: {
            product: {
              $in: order_data.order_items.map((item) => item.product),
            },
          },
        },
      }
    );
  }

  // Save the order after updating the stock
  await new_order.save();

  res.json({ success: true, order_id: new_order._id });
});

// for getting user specific orders
export const get_user_specific_orders = AsyncHandler(async (req, res) => {
  console.log("in get_all_orders");

  const user_id = req.user.id;

  const orders = await Order.find({ user: user_id })
    .populate("user")
    .populate("order_items.product");

  const order_data = orders.map((order) => {
    const eligibleReturnDate = return_eligible_date(order.placed_at);

    return {
      date: format_date(order.placed_at),
      total: order.total_price_with_discount,
      customerName: order.user.first_name + " " + order.user.last_name,
      orderItems: order.order_items.map((item) => {
        const product = item.product;
        const variant = product.variants.find((v) => v.sku === item.variant); // Matching the variant in the order with the product variant

        return {
          productName: `${product.name} ( ${variant.ram}, ${variant.storage}, ${variant.color} )`,
          image: variant.images[0], // Assuming the first image is used
          price: item.total_price,
        };
      }),
      id: order._id,
      orderStatus: order.order_status,
      paymentStatus: order.payment_status,
      returnEligible:
        Date.now() <= eligibleReturnDate
          ? "Eligible for return"
          : "Not eligible to return",
    };
  });

  res.json({ success: true, order_data });
});

// for getting specific order details of a customer
export const get_specific_order_details = AsyncHandler(async (req, res) => {
  console.log("in get_specific_order_details");

  const order_id = req.params.orderId;

  const order = await Order.findById(order_id)
    .populate("user")
    .populate("order_items.product");

  console.log(order);

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  const eligibleReturnDate = return_eligible_date(order.placed_at);

  res.json({
    success: true,
    order_data: {
      date: format_date(order.placed_at),
      total: order.total_price_with_discount,
      customerName: order.user.first_name + " " + order.user.last_name,
      orders: order,
    },
  });
});

// for cancelling and order
export const cancel_order = AsyncHandler(async (req, res) => {
  console.log("in cancel_order");

  const order_id = req.params.orderId;

  console.log(order_id, typeof order_id);

  // Find the order by ID
  const order = await Order.findById(order_id);

  // Check if the order exists
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  // Check if the order has already been canceled
  if (order.order_status === "Cancelled") {
    return res
      .status(400)
      .json({ success: false, message: "Order is already canceled" });
  }

  // Update the order status to "Cancelled"
  order.order_status = "Cancelled";

  // Iterate over the order_items to update the stock of each variant
  for (const item of order.order_items) {
    const { product, variant, quantity } = item;

    // Find the product by its ID
    const productData = await Product.findById(product);

    if (productData) {
      // Find the variant in the product's variants array
      const variantData = productData.variants.find((v) => v.sku === variant);

      if (variantData) {
        // Update the stock by adding back the quantity
        variantData.stock += quantity;

        // Save the updated product data
        await productData.save();
      }
    }
  }

  // Save the updated order data
  await order.save();

  res.json({ success: true, message: "Order cancelled successfully" });
});

// =============================================================================
// admin side
// =============================================================================

// for getting all orders
export const get_all_orders = AsyncHandler(async (req, res) => {
  console.log("in get_all_orders");

  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const totalOrdersCount = await Order.countDocuments({});

    // Fetch orders with pagination
    const orders = await Order.find({})
      .populate({
        path: "user",
        select: "first_name last_name",
      })
      .populate({
        path: "order_items.product",
        select: "name variants",
      })
      .sort({ placed_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalPages = Math.ceil(totalOrdersCount / limit);

    const formattedOrders = orders.map((order) => {
      return {
        user_full_name: `${order.user.first_name} ${order.user.last_name}`,
        order_items: order.order_items.map((item) => {
          const product = item.product;

          const variantDetails = product.variants.find(
            (variant) =>
              variant.sku === item.variant || variant.color === item.variant
          );

          return {
            product_name: product.name,
            variant: {
              color: variantDetails?.color || item.variant,
              ram: variantDetails?.ram || "N/A",
              storage: variantDetails?.storage || "N/A",
            },
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
            total_price: item.total_price,
          };
        }),
        _id: order._id,
        order_status: order.order_status,
        payment_status: order.payment_status,
        placed_at: order.placed_at,
      };
    });

    res.json({ success: true, totalPages, page, orders: formattedOrders });
  } catch (error) {
    console.error("Error in get_all_orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// for updating order status
export const update_order_status = AsyncHandler(async (req, res) => {
  console.log("in update_order_status");

  const order_id = req.params.orderId;
  const new_status = req.body.status;

  console.log(order_id, new_status);

  try {
    const order = await Order.findByIdAndUpdate(
      order_id,
      { order_status: new_status },
      { new: true }
    ).populate({
      path: "user",
      select: "first_name last_name",
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (new_status === "Cancelled") {
      for (const item of order.order_items) {
        const { product, variant, quantity } = item;

        // Find the product by its ID
        const productData = await Product.findById(product);

        if (productData) {
          // Find the variant in the product's variants array
          const variantData = productData.variants.find(
            (v) => v.sku === variant
          );

          if (variantData) {
            // Update the stock by adding back the quantity
            variantData.stock += quantity;

            // Save the updated product data
            await productData.save();
          }
        }
      }
    }

    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error in update_order_status:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update order status" });
  }
});
