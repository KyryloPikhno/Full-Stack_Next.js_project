"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import bcrypt from "bcryptjs"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormProvider, useForm } from "react-hook-form"

import { IRegister } from "@/interfaces"
import { toast } from "@/utils/toast"
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
    formState: { errors, isSubmitting },
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
        toast("Registration successful!", true)
        router.push("/auth/login")
      }
    } catch (error) {
      setError("root", { message: "Something went wrong. Try again.", type: "manual" })
    }
  }

  return (
    <FormProvider {...methods}>
      <h1 className="text-[30px] font-bold mb-4 text-center">Register</h1>

      <form
        className="flex flex-col gap-4 items-center sm:mb-[80px]"
        onChange={() => clearErrors()}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex sm:flex-row flex-col sm:gap-2 gap-4">
          <InputField name="firstName" placeholder="First name" style="sm:!w-[206px]" />
          <InputField name="lastName" placeholder="Last name" style="sm:!w-[206px]" />
        </div>
        <InputField name="email" placeholder="Email" />
        <InputField name="password" placeholder="Password" type="password" />
        <InputField name="confirmPassword" placeholder="Confirm password" type="password" />

        <CustomButton
          disabled={isSubmitting || !!Object.keys(errors).length}
          error={errors["root"]?.message as string}
          loading={isSubmitting}
          style="sm:w-[420px]"
          text="Register"
        />

        <Link className="text-center text-[12px]" href="/auth/login">
          Already have <span className="underline">an account</span>?
        </Link>
      </form>
    </FormProvider>
  )
}

export default Register
