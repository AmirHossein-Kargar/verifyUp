const { z } = require("zod");

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("فرمت ایمیل نامعتبر است");

const phoneSchema = z
  .string()
  .trim()
  .min(8, "شماره تلفن باید حداقل ۸ کاراکتر باشد")
  .max(20, "شماره تلفن معتبر نیست");

const passwordSchema = z
  .string()
  .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
  .max(128, "رمز عبور بیش از حد طولانی است");

function exactlyOneIdentifier(d) {
  const hasEmail = !!d.email;
  const hasPhone = !!d.phone;
  return (hasEmail && !hasPhone) || (!hasEmail && hasPhone);
}

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "نام باید حداقل ۳ کاراکتر باشد")
    .max(80)
    .optional(),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
});

const verifyOtpSchema = z.object({
  phone: phoneSchema,
  otp: z.string().trim().length(6, "کد تأیید باید ۶ رقم باشد"),
});

const verifyEmailSchema = z.object({
  token: z.string().trim().min(1, "توکن تأیید الزامی است"),
});

const resendOtpSchema = z.object({
  phone: phoneSchema,
});

const loginSchema = z
  .object({
    email: emailSchema.optional(),
    phone: phoneSchema.optional(),
    password: passwordSchema,
  })
  .refine(exactlyOneIdentifier, {
    message: "فقط یکی از ایمیل یا شماره تلفن باید ارسال شود",
    path: ["email"],
  });

module.exports = {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  verifyEmailSchema,
  resendOtpSchema,
};
