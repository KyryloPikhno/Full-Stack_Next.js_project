"use client"
import { yupResolver } from "@hookform/resolvers/yup"
import bcrypt from "bcryptjs"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as yup from "yup"

import { IRegister } from "@/interfaces"

const registrationSchema = yup.object().shape({
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
})

const Register = () => {
  const router = useRouter()

  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(registrationSchema),
  })

  const onSubmit = async (data: IRegister) => {
    try {
      const hashedPassword = bcrypt.hashSync(data.password, 10)

      const res = await fetch("/api/register", {
        body: JSON.stringify({ ...data, password: hashedPassword }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })

      if (!res.ok) {
        const error = await res.json()

        setError("email", {
          message: error.error || "An error occurred",
          type: "manual",
        })
        return
      }

      if (res?.ok) {
        router.push("/auth/login")
      }
    } catch (error) {
      setError("root", { message: "Something went wrong. Try again.", type: "manual" })
    }
  }

  return (
    <div>
      <form
        className="flex flex-col"
        onChange={() => clearErrors()}
        onSubmit={handleSubmit(onSubmit)}
      >
        <input {...register("firstName")} placeholder="First name" required />
        {errors.firstName?.message && (
          <div className="error-message">{errors.firstName?.message}</div>
        )}

        <input {...register("lastName")} placeholder="Last name" required />
        {errors.lastName?.message && (
          <div className="error-message">{errors.lastName?.message}</div>
        )}

        <input {...register("email")} placeholder="Email" required />
        {errors.email?.message && <div className="error-message">{errors.email?.message}</div>}

        <input {...register("password")} placeholder="Password" required type="password" />
        {errors.password?.message && (
          <div className="error-message">{errors.password?.message}</div>
        )}
        <input
          {...register("confirmPassword")}
          placeholder="Confirm password"
          required
          type="password"
        />
        {errors.confirmPassword?.message && (
          <div className="error-message">{errors.confirmPassword?.message}</div>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Register
