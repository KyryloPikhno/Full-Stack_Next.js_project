"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { FormProvider, useForm } from "react-hook-form"

import { ILogin } from "@/interfaces"
import { loginSchema } from "@/validation"

import { CustomButton } from "../Button/Button"
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
    formState: { errors, isSubmitting },
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
      setError("root", { message: "Something went wrong. Try again.", type: "manual" })
    }
  }

  return (
    <FormProvider {...methods}>
      <h1 className="text-[30px] font-bold mb-4 text-center">Login</h1>

      <form
        className="flex flex-col gap-4 items-center"
        onChange={() => clearErrors()}
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputField name="email" placeholder="Email" />
        <InputField name="password" placeholder="Password" type="password" />

        <CustomButton
          disabled={isSubmitting || !!Object.keys(errors).length}
          error={errors["root"]?.message as string}
          loading={isSubmitting}
          style="sm:w-[420px]"
          text="Login"
        />

        <Link className="text-center text-[12px]" href="/auth/register">
          Or <span className="underline">register</span> if you are new.
        </Link>
      </form>
    </FormProvider>
  )
}

export default Login
