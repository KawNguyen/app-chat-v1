"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "@tanstack/react-form"

import { signupSchema } from "@/schemas/auth.schema"
import type { SignupFormValues } from "@/schemas/auth.schema"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { getApiErrorMessage } from "@/lib/api-error"
import { toast } from "../ui/toast"
import { useRegister } from "@/hooks/auth/mutations/register.mutation"

function getFieldError(errors: Array<unknown>): string | undefined {
  for (const error of errors) {
    if (typeof error === "string") return error

    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string"
    ) {
      return error.message
    }
  }

  return undefined
}

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const register = useRegister()
  const [errorMessage, setErrorMessage] = useState<string>("")

  const form = useForm({
    defaultValues: {
      displayName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    } satisfies SignupFormValues,

    validators: {
      onSubmit: signupSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        await register.mutateAsync({
          displayName: value.displayName.trim(),
          username: value.username.trim(),
          email: value.email.trim(),
          password: value.password,
        })

        toast.add({
          title: "Đăng ký thành công",
          description: "Bạn đã tạo tài khoản thành công. Vui lòng đăng nhập.",
          type: "success",
        })

        form.reset()
        // router.push("/")
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error))
      }
    },
  })

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Tạo tài khoản</CardTitle>
        <CardDescription>
          Nhập thông tin để tham gia ứng dụng chat.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field name="displayName">
              {(field) => {
                const error = getFieldError(field.state.meta.errors)

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Tên hiển thị</FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      autoComplete="name"
                      placeholder="Nguyễn Văn An"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={Boolean(
                        field.state.meta.isTouched && error
                      )}
                    />

                    {field.state.meta.isTouched && error && (
                      <FieldDescription className="text-destructive">
                        {error}
                      </FieldDescription>
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="username">
              {(field) => {
                const error = getFieldError(field.state.meta.errors)

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Tên đăng nhập</FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      autoComplete="username"
                      placeholder="nguyenvana"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={Boolean(
                        field.state.meta.isTouched && error
                      )}
                    />

                    {field.state.meta.isTouched && error && (
                      <FieldDescription className="text-destructive">
                        {error}
                      </FieldDescription>
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="email">
              {(field) => {
                const error = getFieldError(field.state.meta.errors)

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      autoComplete="email"
                      placeholder="ban@example.com"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={Boolean(
                        field.state.meta.isTouched && error
                      )}
                    />

                    {field.state.meta.isTouched && error && (
                      <FieldDescription className="text-destructive">
                        {error}
                      </FieldDescription>
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="password">
              {(field) => {
                const error = getFieldError(field.state.meta.errors)

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Mật khẩu</FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      autoComplete="new-password"
                      placeholder="Ít nhất 8 ký tự"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={Boolean(
                        field.state.meta.isTouched && error
                      )}
                    />

                    {field.state.meta.isTouched && error && (
                      <FieldDescription className="text-destructive">
                        {error}
                      </FieldDescription>
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="confirmPassword">
              {(field) => {
                const error = getFieldError(field.state.meta.errors)

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Xác nhận mật khẩu
                    </FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      autoComplete="new-password"
                      placeholder="Nhập lại mật khẩu"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={Boolean(
                        field.state.meta.isTouched && error
                      )}
                    />

                    {field.state.meta.isTouched && error && (
                      <FieldDescription className="text-destructive">
                        {error}
                      </FieldDescription>
                    )}
                  </Field>
                )
              }}
            </form.Field>

            {errorMessage && (
              <p role="alert" className="text-sm text-destructive">
                {errorMessage}
              </p>
            )}

            <Field>
              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || register.isPending}
                  >
                    {isSubmitting || register.isPending
                      ? "Đang tạo tài khoản..."
                      : "Tạo tài khoản"}
                  </Button>
                )}
              </form.Subscribe>

              <FieldDescription className="text-center">
                Đã có tài khoản?{" "}
                <Link href="/signin " className="underline underline-offset-4">
                  Đăng nhập
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
