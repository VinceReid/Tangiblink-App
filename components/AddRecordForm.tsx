import { useState } from "react";
import { LucideIcon } from "@/components/LucideIcons";
import {
  YStack,
  Separator,
  XStack,
  Form,
  Button,
  Theme,
  Input,
  TextArea,
  AnimatePresence,
  Image,
} from "tamagui";
import { ThemedText } from "@/components/ThemedText";
import { useSetRecordsStore } from "@/store/setRecordsStore";
import { ErrorDialog } from "@/components/ErrorDialog";
import { useToastController } from "@tamagui/toast";
import { Paste, PasteRecord } from "@/components/ClipboardCopyPaste";
import { socialURLCheck, isSocialProfile } from "@/utils/socialRecordChecks";
import {
  isDescriptionRecord,
  isImageUrl,
} from "@/utils/descriptionRecordChecks";
import { isValidURL } from "@/utils/urlCheck";
import { AddDescriptionRecordScroll } from "./AddDescriptionRecordScroll";
import { AddSocialRecordScroll } from "@/components/AddSocialRecordScroll";
import { canOpenURL } from "expo-linking";

export function AddRecordForm({
  existingKeys,
  isModal,
  definedKey,
}: {
  existingKeys?: string[];
  isModal?: boolean;
  definedKey?: string;
}) {
  const [key, setKey] = useState(definedKey ?? "");
  const [value, setValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addAnother, setAddAnother] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const toast = !isModal ? useToastController() : null;
  //   Destructuring the store
  const records = useSetRecordsStore((state) => state.records);
  const addRecord = useSetRecordsStore((state) => state.addRecord);
  const deleteRecordByIndex = useSetRecordsStore(
    (state) => state.deleteRecordByIndex
  );

  async function updateRecords() {
    if (!key || !value) {
      return;
    }
    const trimmedKey = key.trim();
    const trimmedValue = value.trim();
    if (existingKeys?.includes(trimmedKey)) {
      setError(
        "Key already exists, please use a different key or edit the existing record."
      );
      setIsDialogOpen(true);
      return;
    }
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

    toast &&
      !isEditing &&
      toast.show("Record added", {
        message: `Record with key: "${trimmedKey}" added.`,
        type: "info",
        duration: 3000,
      });
    toast &&
      isEditing &&
      toast.show("Record updated", {
        message: `Record with key: "${trimmedKey}" updated.`,
        type: "info",
        duration: 3000,
      });
    setIsEditing(false);
    setAddAnother(false);
    addRecord({ key: trimmedKey, value: trimmedValue });
    setKey("");
    setValue("");
  }

  function onKeyChange(key: string) {
    setKey(key);
  }

  function onValueChange(value: string) {
    setValue(value);
  }

  function editRecord(key: string) {
    const record = records.find((record) => record.key === key);
    if (!record) {
      return;
    }
    setIsEditing(true);
    setAddAnother(true);
    setKey(record.key);
    setValue(record.value);
  }

  function deleteRecord(key: string, index: number) {
    deleteRecordByIndex(index);
    toast &&
      toast.show("Record deleted", {
        message: `Record with key: "${key}" deleted.`,
        type: "info",
        duration: 3000,
      });
  }

  function setDefinedKey(key: string) {
    setAddAnother(true);
    setKey(key);
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
    <AnimatePresence>
      <YStack f={1} gap={"$2"}>
        {addAnother && (
          <Form
            animation="bouncy"
            gap="$4"
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
            <ThemedText type="subtitle">
              {isEditing ? `Edit Record` : `New Record`}
            </ThemedText>
            {!isEditing && <PasteRecord setKey={setKey} setValue={setValue} />}
            <YStack gap={"$4"}>
              {isEditing ? (
                <ThemedText type="default">{`Key: ${key}`}</ThemedText>
              ) : (
                <XStack gap="$2" flex={1} alignItems="center">
                  <Input
                    flex={1}
                    size={"$4"}
                    value={key}
                    placeholder={`Key...`}
                    onChangeText={onKeyChange}
                  />
                  <Paste setValue={setKey} type="any" />
                </XStack>
              )}
              <XStack gap="$2" flex={1} alignItems="center">
                <TextArea
                  flex={1}
                  size={"$4"}
                  value={value}
                  placeholder={placeholder()}
                  onChangeText={onValueChange}
                />
                <Paste setValue={setValue} type="any" />
              </XStack>
            </YStack>
            <Form.Trigger asChild disabled={!key || !value}>
              <Button icon={<LucideIcon defaultIcon="addRecord" size={16} />}>
                {isEditing ? `Update Record` : `Add Record`}
              </Button>
            </Form.Trigger>
          </Form>
        )}
        {!key && (
          <AddDescriptionRecordScroll
            recordKeys={[
              ...(existingKeys || []),
              ...records.map((record) => record.key),
            ]}
            isLoading={false}
            onSelect={({ key }) => {
              setDefinedKey(key);
            }}
          />
        )}
        {!key && (
          <AddSocialRecordScroll
            recordKeys={[
              ...(existingKeys || []),
              ...records.map((record) => record.key),
            ]}
            isLoading={false}
            onSelect={({ key }) => {
              setDefinedKey(key);
            }}
          />
        )}
        {!addAnother && (
          <YStack gap={"$4"}>
            <Button
              onPress={() => setAddAnother(true)}
              icon={<LucideIcon defaultIcon="addRecord" size={16} />}
            >
              Add another record
            </Button>
          </YStack>
        )}
        <ThemedText type="default">{`Records added: ${records.length}`}</ThemedText>
        <YStack f={1} gap={"$0.5"}>
          {records.length > 0 &&
            records.map((record, index) => (
              <Theme name={"accent"} key={`Record-${record.key}`}>
                <XStack
                  animation="bouncy"
                  gap={"$2"}
                  justifyContent="space-between"
                  padding={"$2"}
                  borderWidth={1}
                  borderTopLeftRadius={index === 0 ? "$4" : 0}
                  borderTopRightRadius={index === 0 ? "$4" : 0}
                  borderBottomLeftRadius={
                    index === records.length - 1 ? "$4" : 0
                  }
                  borderBottomRightRadius={
                    index === records.length - 1 ? "$4" : 0
                  }
                  bg={"$background"}
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
                    <ThemedText type="subtext">{record.key}</ThemedText>
                    <Separator />
                    <ThemedText type="default">{record.value}</ThemedText>
                    {record.key === "logo" && record.value && (
                      <>
                        <Separator />
                        <ThemedText type="subtext">Logo Preview:</ThemedText>
                        <Image
                          source={{ uri: record.value }}
                          width={80}
                          height={80}
                        />
                        <ThemedText type="warning">
                          If your logo preview is not visible above, there may
                          be an issue with the file type in the URL.
                        </ThemedText>
                      </>
                    )}
                  </YStack>
                  <XStack gap={"$2"}>
                    <Button
                      icon={<LucideIcon defaultIcon="editRecord" size={16} />}
                      onPress={() => editRecord(record.key)}
                    />
                    <Button
                      icon={<LucideIcon defaultIcon="delete" size={16} />}
                      onPress={() => deleteRecord(record.key, index)}
                    />
                  </XStack>
                </XStack>
              </Theme>
            ))}
        </YStack>
        <ErrorDialog
          error={error}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </YStack>
    </AnimatePresence>
  );
}
