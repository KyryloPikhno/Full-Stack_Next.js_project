import { FC } from "react"
import { useFormContext } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { IInputProps } from "@/interfaces"

export const InputField: FC<IInputProps> = ({
  name,
  title,
  style = "",
  placeholder,
  type = "text",
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]?.message as string

  return (
    <div className="relative">
      {title ? <div className="ml-[0.5px] mb-1 text-[12px] leading-[18px]">{title}</div> : null}
      <Input
        {...register(name)}
        className={`sm:w-[420px] ${style}`}
        placeholder={placeholder}
        type={type}
      />

      {error ? (
        <span className="ml-[0.5px] first-letter:uppercase absolute top-full text-[9px] leading-3 text-[#FF1C5E] text-left left-0 mt-[2px]">
          {error}
        </span>
      ) : null}
    </div>
  )
}
