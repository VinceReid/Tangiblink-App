import { LucideIcon, type DefaultIcon } from "@/components/LucideIcons";

export const TabBarIcon = (props: {
  defaultIcon: DefaultIcon;
  color: string;
}) => {
  return (
    <LucideIcon
      defaultIcon={props.defaultIcon}
      size={"$2"}
      color={props.color}
      mb={"$-1.5"}
    />
  );
};
