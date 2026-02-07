const Order = require("../models/Order");

const createOrderService = async (userId, orderData) => {
  const { items } = orderData;

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const order = await Order.create({
    user: userId,
    items,
    totalAmount,
  });

  return order;
};

module.exports = { createOrderService };
