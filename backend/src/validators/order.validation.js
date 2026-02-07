const { z } = require("zod");

const createOrderSchema = z.object({
  service: z.literal("upwork_verification", {
    errorMap: () => ({ message: "سرویس باید 'upwork_verification' باشد" }),
  }),
  priceToman: z.number().int().positive("قیمت باید یک عدد صحیح مثبت باشد"),
  requiredDocs: z
    .array(z.string())
    .min(1, "حداقل یک مدرک الزامی باید مشخص شود"),
});

const addDocSchema = z.object({
  type: z.string().min(2, "نوع مدرک باید حداقل ۲ کاراکتر باشد"),
  fileUrl: z.string().url("فرمت آدرس فایل نامعتبر است"),
});

module.exports = { createOrderSchema, addDocSchema };
