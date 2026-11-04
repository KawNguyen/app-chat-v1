import { z } from "zod"

export const signupSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
      .max(30, "Tên đăng nhập tối đa 30 ký tự")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới"
      ),

    displayName: z
      .string()
      .trim()
      .min(2, "Tên hiển thị phải có ít nhất 2 ký tự")
      .max(50, "Tên hiển thị tối đa 50 ký tự"),

    email: z
      .string()
      .trim()
      .email("Email không hợp lệ")
      .max(254, "Email quá dài"),

    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(72, "Mật khẩu quá dài"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  })

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Email or username is required."),
  password: z.string().min(1, "Password is required."),
})

export type SignupFormValues = z.infer<typeof signupSchema>
export type LoginFormValues = z.infer<typeof loginSchema>
