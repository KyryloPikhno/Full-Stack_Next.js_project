"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"

import { ILogin } from "@/interfaces"
import { loginSchema } from "@/validation"

const Login = () => {
  const router = useRouter()

  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(loginSchema),
  })
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
    <form
      className="flex flex-col"
      onChange={() => clearErrors()}
      onSubmit={handleSubmit(onSubmit)}
    >
      {errors.root?.message && <div className="error-message">{errors.root?.message}</div>}
      <input {...register("email")} placeholder="Email" required />
      {errors.email?.message && <div className="error-message">{errors.email?.message}</div>}

      <input {...register("password")} placeholder="Password" required type="password" />
      {errors.password?.message && <div className="error-message">{errors.password?.message}</div>}
      <button type="submit">Login</button>
    </form>
  )
}

export default Login
