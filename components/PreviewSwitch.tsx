import { XStack, Separator, Switch, Label } from "tamagui";
import { create } from "zustand";
import { useEffect } from "react";

// PreviewState type
export type PreviewState = {
  preview: boolean;
  setPreview: () => void;
};

// Store for PreviewState
export const usePreviewStore = create<PreviewState>((set) => ({
  preview: false,
  setPreview: () => set((state: PreviewState) => ({ preview: !state.preview })),
}));

export const PreviewSwitch = ({ isAdmin }: { isAdmin: boolean }) => {
  const preview = usePreviewStore((state) => state.preview);
  const setPreview = usePreviewStore((state) => state.setPreview);

  if (!isAdmin) {
    return null;
  }
  return (
    <XStack alignItems="center" gap="$2">
      <Switch
        id={"switch-preview-mode"}
        size={"$2"}
        defaultChecked={preview}
        onCheckedChange={setPreview}
      >
        <Switch.Thumb animation="quick" bg="$accentColor" />
      </Switch>
      <Separator minHeight={20} vertical />
      <Label
        paddingRight="$0"
        justifyContent="flex-end"
        size={"$4"}
        htmlFor={"switch-preview-mode"}
      >
        {preview ? "Preview On" : "Admin Mode"}
      </Label>
    </XStack>
  );
};
