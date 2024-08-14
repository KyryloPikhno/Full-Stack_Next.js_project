import { toast as t } from "react-hot-toast"

export const toast = (message = "Something went wrong. Try again.", success = false) => {
  return t[success ? "success" : "error"](message, {
    className: `!text-[#FFFFFF] ${success ? "!bg-[#4CAF50]" : "!bg-[#F44336]"}`,
    duration: 4000,
    icon: null,
    position: "bottom-center",
  })
}
