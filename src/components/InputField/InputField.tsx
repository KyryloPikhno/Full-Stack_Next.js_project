import { FC } from "react"
import { useFormContext } from "react-hook-form"

import { Input } from "@/components/ui/input"

export const InputField: FC<{
  name: string
  type?: string
  title?: string
  placeholder: string
}> = ({ name, placeholder, type = "text", title }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]?.message as string

  return (
    <div className="relative">
      {title ? <div className="mb-3 text-[16px] leading-[18px]">{title}</div> : null}
      <Input {...register(name)} className="w-[420px]" placeholder={placeholder} type={type} />

      {error ? (
        <span className="ml-[0.5px] first-letter:uppercase absolute top-full text-[9px] leading-3 text-[#FF1C5E] text-left left-0 mt-[2px]">
          {error}
        </span>
      ) : null}
    </div>
  )
}
