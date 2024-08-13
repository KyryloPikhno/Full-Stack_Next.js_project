import { FC } from "react"

import { Button } from "@/components/ui/button"
import { IButtonProps } from "@/interfaces"

export const CustomButton: FC<IButtonProps> = ({
  text,
  error,
  onClick,
  style = "",
  type = "submit",
}) => {
  return (
    <div className="relative">
      <Button className={`w-[420px] ${style}`} onClick={onClick} type={type}>
        {text}
      </Button>

      {error ? (
        <span className="ml-[0.5px] first-letter:uppercase absolute top-full text-[9px] leading-3 text-[#FF1C5E] text-left left-0 mt-[2px]">
          {error}
        </span>
      ) : null}
    </div>
  )
}
