import { Loader2 } from "lucide-react"
import { FC } from "react"

import { Button } from "@/components/ui/button"
import { IButtonProps } from "@/interfaces"

export const CustomButton: FC<IButtonProps> = ({
  text,
  error,
  onClick,
  style = "",
  type = "submit",
  loading = false,
  disabled = false,
}) => {
  return (
    <div className="relative">
      <Button
        className={`flex gap-4 items-center sm:w-[140px] w-[100px] sm:text-[14px] border-[2px] border-[#000000] text-[10px] ${style}`}
        disabled={disabled}
        onClick={onClick}
        type={type}
      >
        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : null}
        {loading ? "Loading" : text}
      </Button>

      {error ? (
        <span className="ml-[0.5px] first-letter:uppercase absolute top-full text-[9px] leading-3 text-[#FF1C5E] text-left left-0 mt-[2px]">
          {error}
        </span>
      ) : null}
    </div>
  )
}
