const { z } = require("zod");

const registerSchema = z
  .object({
    name: z.string().min(3, "نام باید حداقل ۳ کاراکتر باشد").optional(),
    email: z.string().email("فرمت ایمیل نامعتبر است").optional(),
    phone: z.string().min(8, "شماره تلفن باید حداقل ۸ کاراکتر باشد").optional(),
    password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
  })
  .refine((d) => d.email || d.phone, {
    message: "ایمیل یا شماره تلفن الزامی است",
  });

const loginSchema = z
  .object({
    email: z.string().email("فرمت ایمیل نامعتبر است").optional(),
    phone: z.string().min(8, "شماره تلفن باید حداقل ۸ کاراکتر باشد").optional(),
    password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
  })
  .refine((d) => d.email || d.phone, {
    message: "ایمیل یا شماره تلفن الزامی است",
  });

module.exports = { registerSchema, loginSchema };
