import { SocialLinks } from "social-links";
import * as Linking from "expo-linking";

export type SocialRecord = {
  socialName: string;
  socialValue: string;
};

const socialLinks = new SocialLinks();

export const isSocialProfile = (profile: string) => {
  return socialLinks.hasProfile(profile);
};

export const isSocialValid = (profile: string, url: string) => {
  return socialLinks.isValid(profile, url);
};

export const socialURLCheck = async ({
  profile,
  url,
}: {
  profile: string;
  url: string;
}) => {
  if (!isSocialProfile(profile)) return false;
  // const profileName = socialLinks.detectProfile(url);
  const isValid = socialLinks.isValid(profile, url);
  if (!isValid) return false;
  const sanitizedURL = socialLinks.sanitize(profile, url);
  if (!(await Linking.canOpenURL(sanitizedURL))) {
    return false;
  } else {
    return true;
  }
};

export const normalizeSocialURL = ({
  profile,
  url,
}: {
  profile: string;
  url: string;
}) => {
  return socialLinks.sanitize(profile, url);
};

export const getSocialProfileId = (profile: string, url: string) => {
  return socialLinks.getProfileId(profile, url);
};
