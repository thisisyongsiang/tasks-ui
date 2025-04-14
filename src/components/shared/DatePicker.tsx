import React from "react";
import { Button, Popover } from "@radix-ui/themes";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";

interface Props {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  disabled?: boolean;
  publicHolidaysDate?: Date[];
}

export const DatePicker = ({
  selectedDate,
  setSelectedDate,
  disabled = false,
  publicHolidaysDate,
}: Props) => {
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

  const isPublicHoliday = (date: Date) => {
    return !!publicHolidaysDate?.find((d) => {
      return (
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
      );
    });
  };
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="outline" disabled={disabled}>
          {selectedDate
            ? format(selectedDate, "yyyy-MM-dd")
            : "Select Due Date"}
        </Button>
      </Popover.Trigger>
      <Popover.Content className="rounded-md bg-white p-4 shadow-md z-50">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="mt-2"
          disabled={(date) => {
            return isWeekend(date) || isPublicHoliday(date);
          }}
        />
      </Popover.Content>
    </Popover.Root>
  );
};
