"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "@tanstack/react-form"

import { cn } from "@/lib/utils"
import { loginSchema } from "@/schemas/auth.schema"
import { getApiErrorMessage, getApiFieldErrors } from "@/lib/api-error"

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
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSignin } from "@/hooks/auth/mutations/login.mutation"

type ApiFieldErrors = Record<string, string[]>

function getValidationMessage(error: unknown): string | undefined {
  if (typeof error === "string") return error

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message
  }

  return undefined
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const login = useSignin()
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState("")
  const [apiFieldErrors, setApiFieldErrors] = useState<ApiFieldErrors>({})
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const clearApiError = (fieldName: string) => {
    setApiFieldErrors((previous) => {
      if (!previous[fieldName]) return previous

      const next = { ...previous }
      delete next[fieldName]

      return next
    })

    setErrorMessage("")
  }

  const form = useForm({
    defaultValues: {
      identifier: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setErrorMessage("")
      setApiFieldErrors({})

      try {
        await login.mutateAsync(
          {
            identifier: value.identifier.trim(),
            password: value.password,
          },
          {
            onSuccess: () => {
              router.push("/")
              form.reset()
            },
          }
        )
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error))
        setApiFieldErrors(getApiFieldErrors(error))
      }
    },
  })

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email or username below to login to your account.
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
              <form.Field name="identifier">
                {(field) => {
                  const validationError = getValidationMessage(
                    field.state.meta.errors[0]
                  )

                  const apiError =
                    apiFieldErrors.identifier?.[0] ??
                    apiFieldErrors.email?.[0] ??
                    apiFieldErrors.username?.[0]

                  const error = validationError ?? apiError

                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Email or username
                      </FieldLabel>

                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        placeholder="m@example.com or username"
                        autoComplete="username"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => {
                          field.handleChange(event.target.value)

                          clearApiError("identifier")
                          clearApiError("email")
                          clearApiError("username")
                        }}
                        aria-invalid={Boolean(error)}
                        aria-describedby={
                          error ? `${field.name}-error` : undefined
                        }
                      />

                      {error ? (
                        <p
                          id={`${field.name}-error`}
                          className="text-sm text-destructive"
                          role="alert"
                        >
                          {error}
                        </p>
                      ) : null}
                    </Field>
                  )
                }}
              </form.Field>

              <form.Field name="password">
                {(field) => {
                  const validationError = getValidationMessage(
                    field.state.meta.errors[0]
                  )

                  const apiError = apiFieldErrors.password?.[0]
                  const error = validationError ?? apiError

                  return (
                    <Field>
                      <div className="flex items-center">
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>

                        <Link
                          href="/quen-mat-khau"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>

                      <div className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => {
                            field.handleChange(event.target.value)
                            clearApiError("password")
                          }}
                          aria-invalid={Boolean(error)}
                          aria-describedby={
                            error ? `${field.name}-error` : undefined
                          }
                        />
                        <Button
                          className="absolute top-0 right-0"
                          variant="ghost"
                          size={"icon"}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {error ? (
                        <p
                          id={`${field.name}-error`}
                          className="text-sm text-destructive"
                          role="alert"
                        >
                          {error}
                        </p>
                      ) : null}
                    </Field>
                  )
                }}
              </form.Field>

              {errorMessage && Object.keys(apiFieldErrors).length === 0 ? (
                <p className="text-sm text-destructive" role="alert">
                  {errorMessage}
                </p>
              ) : null}

              <Field>
                <form.Subscribe selector={(state) => state.isSubmitting}>
                  {(isSubmitting) => {
                    const isLoading = login.isPending || isSubmitting

                    return (
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Login"}
                      </Button>
                    )
                  }}
                </form.Subscribe>

                <Button variant="outline" type="button" disabled>
                  Login with Google
                </Button>

                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
