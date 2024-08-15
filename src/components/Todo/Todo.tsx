"use client"

import { Button, Checkbox } from "@radix-ui/themes"
import moment from "moment"
import { FC, useEffect, useRef, useState } from "react"

import { ITodoProps } from "@/interfaces"
import { DATE_FORMAT_DAY_TIME } from "@/utils/date"

import DeleteIcon from "../Icons/DeleteIcon"
import { Textarea } from "../ui/textarea"

const Todo: FC<ITodoProps> = ({ todo, updateTodo, deleteTodo }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(todo.body)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      const length = textareaRef.current.value.length
      textareaRef.current.setSelectionRange(length, length)
    }
  }, [isEditing])

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    updateTodo(todo.id, { body: e.target.value })
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      setIsEditing(false)
    }
  }

  const onCheckedChange = () => {
    updateTodo(todo.id, { completed: !todo.completed })
  }

  return (
    <>
      {isEditing ? (
        <div className="relative">
          <Textarea
            className="text-[18px]"
            onBlur={handleBlur}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter changes"
            ref={textareaRef}
            value={value}
          />
          <div className="absolute top-[-4px] right-1 text-[9px] text-gray-600 mt-2">
            Hit Esc to drop it!
          </div>
        </div>
      ) : (
        <div className="px-2 border sm:w-[500px] rounded shadow group" key={todo.id}>
          <div className="flex gap-4 justify-between items-center">
            <div className="flex items-center gap-2">
              <div>
                <Checkbox
                  checked={todo.completed}
                  className="w-6 h-6 border-[2px] flex justify-center items-center border-[#000000] rounded-full"
                  onCheckedChange={onCheckedChange}
                />
              </div>
              <div className="py-2 cursor-pointer" onDoubleClick={() => setIsEditing(true)}>
                <p
                  className={`text-lg sm:w-[400px] leading-[23px] break-words ${todo.completed ? "line-through" : ""}`}
                >
                  {todo.body}
                </p>
                <div className="flex gap-4 mt-1">
                  <p className="text-[10px] text-gray-500">
                    Created: {moment(todo?.createdAt).format(DATE_FORMAT_DAY_TIME)}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Updated: {moment(todo?.updatedAt).format(DATE_FORMAT_DAY_TIME)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center mr-[-3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button onClick={() => deleteTodo(todo.id)} type="button">
                <DeleteIcon />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Todo
