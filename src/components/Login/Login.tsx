"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { FormProvider, useForm } from "react-hook-form"

import { ILogin } from "@/interfaces"
import { loginSchema } from "@/validation"

import { InputField } from "../InputField/InputField"

const Login = () => {
  const router = useRouter()

  const methods = useForm({
    mode: "onSubmit",
    resolver: yupResolver(loginSchema),
  })

  const {
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = methods

  const onSubmit = async (data: ILogin) => {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (res?.error) {
        setError("root", { message: "Wrong email or password.", type: "manual" })
      }

      if (res?.ok) {
        router.push("/todos")
      }
    } catch (error) {
      console.log("error", error)
      setError("root", { message: "Something went wrong. Try again.", type: "manual" })
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-4"
        onChange={() => clearErrors()}
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputField name="email" placeholder="Email" />
        <InputField name="password" placeholder="Password" type="password" />

        <div className="relative">
          <button type="submit">Login</button>
          {errors.root?.message && <div className="error-message">{errors.root?.message}</div>}
        </div>
      </form>
    </FormProvider>
  )
}

export default Login
