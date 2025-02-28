import { useState, useEffect } from "react";
import { Button, XStack } from "tamagui";
import * as Clipboard from "expo-clipboard";
import { LucideIcon } from "@/components/LucideIcons";
import { create } from "zustand";
import { ThemedText } from "@/components/ThemedText";
import { useToastController } from "@tamagui/toast";

export type ClipboardType = "record" | "domain" | "address" | "any";

// ClipboardState type
export type ClipboardState = {
  clipboardType: ClipboardType;
  setClipboardType: (value: ClipboardType) => void;
  clipboardValue: string;
  setClipboardValue: (value: string) => void;
};

// Zustand store for ClipboardState
export const useClipboardStore = create<ClipboardState>((set) => ({
  clipboardType: "any",
  setClipboardType: (value) => set({ clipboardType: value }),
  clipboardValue: "",
  setClipboardValue: (value) => set({ clipboardValue: value }),
}));

// Copy component
export function Copy({ type, value }: { type: ClipboardType; value: string }) {
  const toast = useToastController();
  const setClipboardType = useClipboardStore((state) => state.setClipboardType);
  const setClipboardValue = useClipboardStore(
    (state) => state.setClipboardValue
  );
  const clipboardValue = useClipboardStore((state) => state.clipboardValue);
  const [copied, setCopied] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  // useEffect to update copied boolean state if clipboardValue changes
  useEffect(() => {
    setCopied(clipboardValue === value);
  }, [clipboardValue]);

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync();
    setCopiedText(text);
  };
  fetchCopiedText();

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(value);
    setClipboardType(type);
    setClipboardValue(value);
    setCopied(true);
    if (type === "record") {
      const keyValuePair = JSON.parse(value);
      toast.show("Copied record clipboard", {
        message: `Copied record with key: "${keyValuePair.key}" and its associated value.`,
        type: "info",
        duration: 3000,
      });
    } else {
      toast.show("Copied to clipboard", {
        message: `Copied "${value}"`,
        type: "info",
        duration: 3000,
      });
    }
  };

  return copied || (clipboardValue === value && copiedText === value) ? (
    <LucideIcon defaultIcon="copied" size={16} onPress={copyToClipboard} />
  ) : (
    <LucideIcon defaultIcon="copy" size={16} onPress={copyToClipboard} />
  );
}

// Paste component
export function Paste({
  type,
  setValue,
  button,
}: {
  type: ClipboardType;
  setValue: (value: string) => void;
  button?: boolean;
}) {
  const clipboardType = useClipboardStore((state) => state.clipboardType);
  const clipboardValue = useClipboardStore((state) => state.clipboardValue);
  const [pasted, setPasted] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync();
    setCopiedText(text);
  };
  fetchCopiedText();

  const pasteFromClipboard = () => {
    setValue(clipboardValue);
    setPasted(true);
  };
  if (clipboardType === "record") {
    return null;
  }
  return (
    ((type === clipboardType && copiedText === clipboardValue) ||
      type === "any") &&
    clipboardValue &&
    (pasted ? (
      button ? (
        <Button
          onPress={pasteFromClipboard}
          icon={<LucideIcon defaultIcon="pasted" size={16} />}
        />
      ) : (
        <LucideIcon
          defaultIcon="pasted"
          size={16}
          onPress={pasteFromClipboard}
        />
      )
    ) : button ? (
      <Button
        onPress={pasteFromClipboard}
        icon={<LucideIcon defaultIcon="paste" size={16} />}
      />
    ) : (
      <LucideIcon defaultIcon="paste" size={16} onPress={pasteFromClipboard} />
    ))
  );
}

// Paste Record component
export function PasteRecord({
  setKey,
  setValue,
  button,
}: {
  setKey: (key: string) => void;
  setValue: (value: string) => void;
  button?: boolean;
}) {
  const clipboardType = useClipboardStore((state) => state.clipboardType);
  const clipboardValue = useClipboardStore((state) => state.clipboardValue);
  const [pasted, setPasted] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync();
    setCopiedText(text);
  };
  fetchCopiedText();
  // Check if the clipboard type is record
  const isRecord = clipboardType === "record";
  // Parse the clipboard value to check if it includes key and value
  let keyValuePair: { key: string; value: string } | null = null;
  try {
    keyValuePair = isRecord && clipboardValue ? JSON.parse(clipboardValue) : null;
  } catch (e: any) {
    console.error(e);
  }
  // Check if the keyValuePair includes key and value
  const hasKeyAndValue = keyValuePair && keyValuePair.key && keyValuePair.value;


  const pasteFromClipboard = () => {
    if (!hasKeyAndValue || !isRecord) {
      return;
    }
    setValue(keyValuePair?.value ?? "");
    setKey(keyValuePair?.key ?? "");
    setPasted(true);
  };
  if (clipboardType !== "record") {
    return null;
  }
  return (
    copiedText === clipboardValue &&
    clipboardValue &&
    hasKeyAndValue &&
    isRecord &&
    (pasted ? (
      button ? (
        <Button
          onPress={pasteFromClipboard}
          icon={<LucideIcon defaultIcon="pasted" size={16} />}
        >
          Paste copied record
        </Button>
      ) : (
        <XStack gap="$2" onPress={pasteFromClipboard}>
          <LucideIcon defaultIcon="pasted" size={16} />
          <ThemedText type="subtext">Paste copied record</ThemedText>
        </XStack>
      )
    ) : button ? (
      <Button
        onPress={pasteFromClipboard}
        icon={<LucideIcon defaultIcon="paste" size={16} />}
      >
        Paste copied record
      </Button>
    ) : (
      <XStack gap="$2" onPress={pasteFromClipboard}>
        <LucideIcon defaultIcon="paste" size={16} />
        <ThemedText type="subtext">Paste copied record</ThemedText>
      </XStack>
    ))
  );
}
