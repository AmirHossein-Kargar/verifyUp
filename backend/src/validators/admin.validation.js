const { z } = require("zod");

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/i, "شناسه نامعتبر است");

// Admin orders listing (query params)
const adminListOrdersQuerySchema = z.object({
  status: z.string().min(1, "وضعیت نمی‌تواند خالی باشد").optional(),
  page: z.coerce
    .number()
    .int("صفحه باید عدد صحیح باشد")
    .positive("شماره صفحه باید مثبت باشد")
    .default(1),
  limit: z.coerce
    .number()
    .int("تعداد در هر صفحه باید عدد صحیح باشد")
    .min(1, "حداقل یک مورد در هر صفحه")
    .max(100, "حداکثر ۱۰۰ مورد در هر صفحه")
    .default(20),
});

// Path params for order / document
const adminOrderParamsSchema = z.object({
  orderId: objectIdSchema,
});

const adminDocParamsSchema = z.object({
  docId: objectIdSchema,
});

// Review a document
const reviewDocBodySchema = z.object({
  status: z.enum(["accepted", "resubmit"], {
    errorMap: () => ({
      message: "وضعیت نامعتبر است. باید 'accepted' یا 'resubmit' باشد",
    }),
  }),
  adminNote: z
    .string()
    .trim()
    .max(2000, "یادداشت مدیر حداکثر می‌تواند ۲۰۰۰ کاراکتر باشد")
    .optional(),
});

// Update order status
const updateOrderStatusBodySchema = z.object({
  status: z.enum(
    [
      "pending_docs",
      "in_review",
      "needs_resubmit",
      "approved",
      "rejected",
      "completed",
    ],
    {
      errorMap: () => ({
        message:
          "وضعیت نامعتبر است. باید یکی از وضعیت‌های مجاز سفارش انتخاب شود",
      }),
    }
  ),
  adminNote: z
    .string()
    .trim()
    .max(2000, "یادداشت مدیر حداکثر می‌تواند ۲۰۰۰ کاراکتر باشد")
    .optional(),
});

module.exports = {
  objectIdSchema,
  adminListOrdersQuerySchema,
  adminOrderParamsSchema,
  adminDocParamsSchema,
  reviewDocBodySchema,
  updateOrderStatusBodySchema,
};
