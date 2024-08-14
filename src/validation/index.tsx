import * as yup from "yup"

export const registrationSchema = yup.object().shape({
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

export const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
})

export const todoSchema = yup.object().shape({
  newTodo: yup.string().required("Todo is required"),
})
