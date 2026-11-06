"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface PrimopredajaDatePickerProps {
    date?: Date;
    setDate?: (date?: Date) => void;
}

export function PrimopredajaDatePicker({ date: propDate, setDate: propSetDate }: PrimopredajaDatePickerProps) {
    const [internalDate, setInternalDate] = React.useState<Date | undefined>(new Date());
    const currentDate = propDate !== undefined ? propDate : internalDate;
    const handleSelect = propSetDate || setInternalDate;

    return (
        <Popover>
            <PopoverTrigger
                render={
                    <Button
                        variant="outline"
                        data-empty={!currentDate}
                        className="w-full justify-between text-left font-normal h-9 text-xs data-[empty=true]:text-muted-foreground"
                    >
                        <span>{currentDate ? format(currentDate, "dd. MM. yyyy") : "Izberi datum"}</span>
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                    </Button>
                }
            />
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={currentDate}
                    onSelect={handleSelect}
                    defaultMonth={currentDate}
                />
            </PopoverContent>
        </Popover>
    )
}
