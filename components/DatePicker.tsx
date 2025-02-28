import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { ThemedText } from "./ThemedText";
import { YStack, Button } from "tamagui";
import { LucideIcon } from "@/components/LucideIcons";
import { Keyboard } from "react-native";

type Mode = "date" | "time";

export const DatePicker = ({
  date,
  setDate,
}: {
  date: Date;
  setDate: (date: Date) => void;
}) => {
  const [mode, setMode] = useState<Mode>("date");
  const [show, setShow] = useState(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate ?? new Date();
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode: Mode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    Keyboard.dismiss();
    showMode("date");
  };

  const showTimepicker = () => {
    Keyboard.dismiss();
    showMode("time");
  };

  return (
    <YStack gap="$1">
      <Button icon={<LucideIcon defaultIcon="calendar" size={16} />} onPress={showDatepicker} bg={"$accentColor"}>
        Set Date
      </Button>
      <Button icon={<LucideIcon defaultIcon="time" size={16} />} onPress={showTimepicker} bg={"$accentColor"}>
        Set Time
      </Button>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}
    </YStack>
  );
};
