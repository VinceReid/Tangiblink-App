import { useState } from "react";
import { LucideIcon } from "@/components/LucideIcons";
import {
  YStack,
  Separator,
  XStack,
  Form,
  Button,
  TextArea,
  AnimatePresence,
  Image,
  Theme,
} from "tamagui";
import { ThemedText } from "@/components/ThemedText";
import { useSetRecordsStore } from "@/store/setRecordsStore";
import { useToastController } from "@tamagui/toast";
import { ErrorDialog } from "@/components/ErrorDialog";
import { socialURLCheck, isSocialProfile } from "@/utils/socialRecordChecks";
import {
  isDescriptionRecord,
  isImageUrl,
} from "@/utils/descriptionRecordChecks";
import { isValidURL } from "@/utils/urlCheck";
import { canOpenURL } from "expo-linking";

export function EditRecordsForm() {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const toast = useToastController();
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  //   Destructuring the store
  const existingRecords = useSetRecordsStore((state) => state.existingRecords);
  const deletedRecords = useSetRecordsStore((state) => state.deletedRecords);
  const editedRecords = useSetRecordsStore((state) => state.editedRecords);
  const addEditedRecord = useSetRecordsStore((state) => state.addEditedRecord);
  const deleteEditedRecordByKey = useSetRecordsStore(
    (state) => state.deleteEditedRecordByKey
  );
  const addDeletedRecord = useSetRecordsStore(
    (state) => state.addDeletedRecord
  );
  const deleteDeletedRecord = useSetRecordsStore(
    (state) => state.deleteDeletedRecord
  );
  async function updateRecords() {
    if (!key || !value) {
      return;
    }
    const trimmedKey = key.trim();
    const trimmedValue = value.trim();

    if (isSocialProfile(trimmedKey)) {
      const urlAccepted = await socialURLCheck({
        profile: trimmedKey,
        url: trimmedValue,
      });
      if (urlAccepted === false) {
        setError(
          `The value is not a valid ${trimmedKey} social profile URl or User ID. \nPlease check the url capitalization and try again or alternatively copy and paste the URL or User Id from your social media platform.`
        );
        setIsDialogOpen(true);
        return;
      }
    }

    if (isDescriptionRecord(trimmedKey)) {
      if (trimmedKey === "logo" && !isImageUrl(trimmedValue)) {
        setError(
          `The value is not a valid URL for the ${trimmedKey} record. \nPlease check the image url and image file extension (jpeg|jpg|gif|png|bmp) and try again or alternatively copy and paste the URL from your browser.`
        );
        setIsDialogOpen(true);
        return;
      }
      if (
        trimmedKey === "website" &&
        !isValidURL(trimmedValue) &&
        !(await canOpenURL(trimmedValue))
      ) {
        setError(
          `The value is not a valid URL for the ${trimmedKey} record. \nPlease check the url and try again or alternatively copy and paste the URL from your browser. \nEnsure the URL starts with http:// or https://`
        );
        setIsDialogOpen(true);
        return;
      }
    }

    toast.show("Record edited", {
      message: `Record with key: "${key}" edited.`,
      type: "info",
      duration: 3000,
    });
    addEditedRecord({ key, value: trimmedValue });
    setKey("");
    setValue("");
  }

  function onValueChange(value: string) {
    setValue(value);
  }

  function editRecord({ key, value }: { key: string; value: string }) {
    const edited = editedRecords.find((r) => r.key === key);
    setKey(key);
    setValue(edited?.value ?? value);
  }

  function closeEditRecord() {
    setKey("");
    setValue("");
  }

  const placeholder = () => {
    if (isDescriptionRecord(key)) {
      if (key === "title") {
        return "Title...";
      }
      if (key === "description") {
        return "Description...";
      }
      if (key === "website") {
        return "URL...";
      }
      if (key === "logo") {
        return "Image URL...(jpeg|jpg|gif|png|bmp)";
      }
    }
    if (isSocialProfile(key)) {
      return `${key} profile URL or User ID...`;
    }
    return "Value...";
  };

  return (
    <YStack f={1} gap={"$1"} pb="$4">
      {key && (
        <AnimatePresence>
          <Form
            animation="bouncy"
            gap="$4"
            mb="$4"
            onSubmit={updateRecords}
            borderWidth={1}
            borderRadius="$4"
            backgroundColor="$background"
            borderColor="$borderColor"
            padding="$3"
            enterStyle={{
              opacity: 0,
              y: 10,
              scale: 0.9,
            }}
            exitStyle={{
              opacity: 0,
              y: -10,
              scale: 0.9,
            }}
          >
            <XStack justifyContent="space-between">
              <ThemedText type="subtitle">Edit Record</ThemedText>
              <LucideIcon defaultIcon="close" size={24} onPress={closeEditRecord} />
            </XStack>
            <YStack gap={"$4"}>
              <ThemedText type="subtext">{key}</ThemedText>
              <TextArea
                size={"$4"}
                value={value}
                placeholder={placeholder()}
                onChangeText={onValueChange}
              />
            </YStack>
            <Form.Trigger asChild disabled={!key || !value}>
              <Button icon={<LucideIcon defaultIcon="addRecord" size={16} />}>
                Confirm Edit
              </Button>
            </Form.Trigger>
            <XStack gap={"$2"}>
              {editedRecords.find((r) => r.key === key) ? (
                <Button
                  icon={<LucideIcon defaultIcon="undo" size={16} />}
                  onPress={() => deleteEditedRecordByKey(key)}
                >
                  Remove changes
                </Button>
              ) : null}
              {deletedRecords.includes(key) ? (
                <Button
                  icon={<LucideIcon defaultIcon="archive" size={16} />}
                  onPress={() => deleteDeletedRecord(key)}
                />
              ) : (
                <Button
                  icon={<LucideIcon defaultIcon="delete" size={16} />}
                  onPress={() => addDeletedRecord(key)}
                />
              )}
            </XStack>
          </Form>
        </AnimatePresence>
      )}
      <AnimatePresence>
        {existingRecords &&
          existingRecords.map((record, index) => {
            const deleted = deletedRecords.includes(record.key);
            const edited = editedRecords.find((r) => r.key === record.key);
            return (
              <Theme name={"accent"} key={`Edit-Record-${record.key}`}>
                <XStack
                  animation="bouncy"
                  gap={"$2"}
                  justifyContent="space-between"
                  padding={"$2"}
                  borderWidth={1}
                  borderTopLeftRadius={index === 0 ? "$4" : 0}
                  borderTopRightRadius={index === 0 ? "$4" : 0}
                  borderBottomLeftRadius={
                    index === existingRecords.length - 1 ? "$4" : 0
                  }
                  borderBottomRightRadius={
                    index === existingRecords.length - 1 ? "$4" : 0
                  }
                  bg={
                    deleted ? "$red5Dark" : edited ? "$green5Dark" : "$background"
                  }
                  enterStyle={{
                    opacity: 0,
                    y: 10,
                    scale: 0.9,
                  }}
                  exitStyle={{
                    opacity: 0,
                    y: -10,
                    scale: 0.9,
                  }}
                >
                  <YStack f={1} gap={"$2"}>
                    {edited && !deleted && (
                      <ThemedText type="defaultSemiBold">Edited</ThemedText>
                    )}
                    {deleted && (
                      <ThemedText type="defaultSemiBold">Deleted</ThemedText>
                    )}
                    <ThemedText type="subtext">{record.key}</ThemedText>
                    <Separator />

                    {edited && !deleted ? (
                      <>
                        <ThemedText type="default">{edited.value}</ThemedText>
                        {record.key === "logo" && edited.value && (
                          <>
                            <Separator />
                            <ThemedText type="subtext">
                              New Logo Preview:
                            </ThemedText>
                            <Image
                              source={{ uri: edited.value }}
                              width={80}
                              height={80}
                            />
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <ThemedText type="default">{record.value}</ThemedText>
                        {record.key === "logo" && record.value && (
                          <>
                            <Separator />
                            <ThemedText type="subtext">
                              Current Logo Preview:
                            </ThemedText>
                            <Image
                              source={{ uri: record.value }}
                              width={80}
                              height={80}
                            />
                          </>
                        )}
                      </>
                    )}
                  </YStack>
                  <XStack gap={"$2"}>
                    {edited && !deleted && (
                      <Button
                        icon={<LucideIcon defaultIcon="undo" size={16} />}
                        onPress={() => deleteEditedRecordByKey(record.key)}
                      />
                    )}
                    {!deleted && (
                      <Button
                        icon={<LucideIcon defaultIcon="editRecord" size={16} />}
                        onPress={() => editRecord(record)}
                      />
                    )}
                    {deleted ? (
                      <Button
                        icon={<LucideIcon defaultIcon="archive" size={16} />}
                        onPress={() => deleteDeletedRecord(record.key)}
                      />
                    ) : (
                      <Button
                        icon={<LucideIcon defaultIcon="delete" size={16} />}
                        onPress={() => addDeletedRecord(record.key)}
                      />
                    )}
                  </XStack>
                </XStack>
              </Theme>
            );
          })}
      </AnimatePresence>
      <ErrorDialog
        error={error}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </YStack>
  );
}
