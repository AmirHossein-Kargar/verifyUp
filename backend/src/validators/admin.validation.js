const { z } = require("zod");

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/i, "شناسه نامعتبر است");

const orderStatusEnum = z.enum([
  "pending_docs",
  "in_review",
  "needs_resubmit",
  "approved",
  "rejected",
  "completed",
]);

const adminListOrdersQuerySchema = z
  .object({
    status: orderStatusEnum.optional(),

    from: z
      .string()
      .datetime()
      .optional()
      .describe("ISO datetime string for start of createdAt range"),

    to: z
      .string()
      .datetime()
      .optional()
      .describe("ISO datetime string for end of createdAt range"),

    userQuery: z
      .string()
      .trim()
      .min(3, "عبارت جستجو باید حداقل ۳ کاراکتر باشد")
      .max(64, "عبارت جستجوی کاربر خیلی طولانی است")
      .optional(),

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

    sortBy: z.enum(["createdAt", "amount", "status"]).default("createdAt"),

    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .refine(
    (q) => !q.from || !q.to || new Date(q.from) <= new Date(q.to),
    {
      message: "بازه تاریخ نامعتبر است (از باید قبل از تا باشد)",
      path: ["to"],
    }
  );

const adminOrderParamsSchema = z.object({
  orderId: objectIdSchema,
});

const updateOrderStatusBodySchema = z.object({
  status: orderStatusEnum,
  adminNote: z
    .string()
    .trim()
    .max(2000, "یادداشت مدیر حداکثر می‌تواند ۲۰۰۰ کاراکتر باشد")
    .optional(),
});

module.exports = {
  objectIdSchema,
  orderStatusEnum,
  adminListOrdersQuerySchema,
  adminOrderParamsSchema,
  updateOrderStatusBodySchema,
};
