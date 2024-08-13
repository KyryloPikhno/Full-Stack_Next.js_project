"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import bcrypt from "bcryptjs"
import { useRouter } from "next/navigation"
import { FormProvider, useForm } from "react-hook-form"

import { IRegister } from "@/interfaces"
import { registrationSchema } from "@/validation"

import { CustomButton } from "../Button/Button"
import { InputField } from "../InputField/InputField"

const Register = () => {
  const router = useRouter()

  const methods = useForm({
    mode: "onSubmit",
    resolver: yupResolver(registrationSchema),
  })

  const {
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = methods

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
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-4"
        onChange={() => clearErrors()}
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputField name="firstName" placeholder="First name" />
        <InputField name="lastName" placeholder="Last name" />
        <InputField name="email" placeholder="Email" />
        <InputField name="password" placeholder="Password" type="password" />
        <InputField name="confirmPassword" placeholder="Confirm password" type="password" />

        <CustomButton error={errors["root"]?.message as string} text="Register" />
      </form>
    </FormProvider>
  )
}

export default Register
