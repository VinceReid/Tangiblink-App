import { isValidURL } from "@/utils/urlCheck";

// Objective: Check if the description record is valid.

export const descriptionRecordKeys = [
  "title",
  "description",
  "website",
  "logo",
];

export const isImageUrl = (url: string) => {
  return url.match(/\.(jpeg|jpg|gif|png|bmp)$/) != null && isValidURL(url);
};

export const isDescriptionRecord = (key: string) => {
  return descriptionRecordKeys.includes(key);
};
