"use client"

// import { useRouter } from "next/router"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"

const Login = () => {
  // const router = useRouter()

  const { register, handleSubmit } = useForm()

  const onSubmit = async (data) => {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (res?.ok) {
        console.log("res", res)
        window.location.href = "/todos"
      } else {
        alert("Invalid credentials")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} placeholder="Email" required />
      <input {...register("password")} placeholder="Password" required type="password" />
      <button type="submit">Login</button>
    </form>
  )
}

export default Login
