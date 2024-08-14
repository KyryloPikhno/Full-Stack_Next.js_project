"use client"

import { Button, Checkbox } from "@radix-ui/themes"
import moment from "moment"
import { FC, useRef, useState } from "react"

import { ITodoProps } from "@/interfaces"
import { DATE_FORMAT_DAY_TIME } from "@/utils/date"

import DeleteIcon from "../Icons/DeleteIcon"

const Todo: FC<ITodoProps> = ({ todo, updateTodo, deleteTodo }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.body)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDoubleClick = () => {
    setIsEditing(true)
    console.log("lol")
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (editValue !== todo.body) {
      updateTodo(todo.id, { body: editValue })
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(event.target.value)
  }

  return (
    <div className="p-[10px] border w-[500px] rounded shadow" key={todo.id}>
      <div className="flex gap-4 justify-between items-center">
        <div className="flex items-center gap-2">
          <div>
            <Checkbox
              checked={todo.completed}
              className="w-6 h-6 border-[2px] flex justify-center items-center border-[#000000] rounded-full"
              onCheckedChange={() => updateTodo(todo.id, { completed: !todo.completed })}
            />
          </div>
          <p
            className="text-lg min-w-[300px] leading-[23px] border"
            onDoubleClick={handleDoubleClick}
          >
            {todo.body}
          </p>
        </div>
        <div className="flex items-center">
          <Button onClick={() => deleteTodo(todo.id)} type="button">
            <DeleteIcon />
          </Button>
        </div>
      </div>
      <div className="flex gap-4 mt-1">
        <p className="text-[10px] text-gray-500">
          Created: {moment(todo?.createdAt).format(DATE_FORMAT_DAY_TIME)}
        </p>
        <p className="text-[10px] text-gray-500">
          Updated: {moment(todo?.updatedAt).format(DATE_FORMAT_DAY_TIME)}
        </p>
      </div>
    </div>
  )
}

export default Todo
