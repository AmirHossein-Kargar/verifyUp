const { z } = require("zod");

const createOrderSchema = z.object({
  service: z.literal("upwork_verification", {
    errorMap: () => ({ message: "سرویس باید 'upwork_verification' باشد" }),
  }),
  priceToman: z.number().int().positive("قیمت باید یک عدد صحیح مثبت باشد"),
  requiredDocs: z.array(z.string()).optional().default([]),
});

// Reusable ObjectId validator for order-related params
const orderIdParamsSchema = z.object({
  orderId: z.string().regex(/^[0-9a-fA-F]{24}$/i, "شناسه سفارش نامعتبر است"),
});

module.exports = { createOrderSchema, orderIdParamsSchema };
