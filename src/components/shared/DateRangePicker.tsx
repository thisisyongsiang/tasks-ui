import React from "react";
import { Button, Flex, Popover } from "@radix-ui/themes";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";

interface Props {
  selectedRange: { from: Date | undefined; to: Date | undefined };
  setSelectedRange: (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
  disabled?: boolean;
}

export const DateRangePicker = ({
  selectedRange,
  setSelectedRange,
  disabled = false,
}: Props) => {
  const handleClear = () => {
    setSelectedRange({ from: undefined, to: undefined });
  };

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="outline" disabled={disabled}>
          {!selectedRange.from && !selectedRange.to ? (
            "Select Date Range"
          ) : (
            <>
              {`${
                selectedRange.from
                  ? format(selectedRange.from, "yyyy-MM-dd")
                  : "-"
              } - ${
                selectedRange.to ? format(selectedRange.to, "yyyy-MM-dd") : "-"
              }`}
            </>
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Content className="rounded-md bg-white p-4 shadow-md z-50">
        <DayPicker
          mode="range"
          selected={selectedRange}
          onSelect={(dateRange) => {
            if (dateRange !== undefined) {
              setSelectedRange({ from: dateRange.from, to: dateRange.to });
            }
          }}
          className="mt-2"
        />
        <Flex justify="end" mt="3">
          <Button variant="soft" color="gray" onClick={handleClear}>
            Clear
          </Button>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};
