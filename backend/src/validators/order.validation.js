const validateOrder = (req, res, next) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ message: "Order must contain at least one item" });
  }

  for (const item of items) {
    if (!item.name || !item.quantity || !item.price) {
      return res
        .status(400)
        .json({ message: "Each item must have name, quantity, and price" });
    }

    if (item.quantity <= 0 || item.price <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity and price must be positive numbers" });
    }
  }

  next();
};

module.exports = { validateOrder };
