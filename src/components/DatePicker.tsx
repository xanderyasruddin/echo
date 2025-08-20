"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { isAfter, startOfToday } from "date-fns"
import toast from "react-hot-toast"
import { useState } from "react"

function formatDate(date: Date | undefined) {
  if (!date) return ""
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function DatePicker({ value, onChange }: 
  { value: Date | undefined, onChange: (date: Date) => void}) 
  {
  const [open, setOpen] = useState(false)
  const today = startOfToday()

  return (
    <div className="">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="min-w-[100px] justify-between font-normal text-s"
          >
            {value ? formatDate(value) : "Date visited"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0 text-xs"
          align="start"
        >
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            onSelect={(selectedDate) => {
              if (!selectedDate) return
              if (isAfter(selectedDate, today)) {
                toast.error("You can't select a date in the future.")
                return
              }
              onChange(selectedDate)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
