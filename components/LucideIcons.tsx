import {
  LayoutGrid,
  PlusSquare,
  FilePlus,
  FileX,
  FileEdit,
  FileStack,
  FileKey2,
  FileText,
  FileDiff,
  HandCoins,
  ArrowRightLeft,
  ArrowRight,
  UserRoundPlus,
  MousePointerSquare,
  Combine,
  SquareStack,
  Route,
  MapPinned,
  Trash,
  Edit3,
  SquareCheck,
  Info,
  CircleAlert,
  ShieldAlert,
  History,
  Settings2,
  ActivitySquare,
  User2,
  Search,
  Wallet,
  Share2,
  QrCode,
  ScanQrCode,
  Copy,
  CopyCheck,
  Clipboard,
  ClipboardCheck,
  HelpCircle,
  Code2,
  Mail,
  Github,
  AlertTriangle,
  Link,
  BookMarked,
  UserSquare2,
  UserSquare,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  FileQuestion,
  SquareChevronDown,
  CalendarDays,
  Timer,
  X,
  Undo2,
  ArchiveRestore,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  SaveOff,
} from "@tamagui/lucide-icons";
import type { IconProps } from "@tamagui/helpers-icon";
import React from "react";

export type DefaultIcon =
  | "actions"
  | "buy"
  | "addRecord"
  | "deleteRecord"
  | "editRecord"
  | "records"
  | "recordKey"
  | "recordDetails"
  | "recordTransactions"
  | "pay"
  | "transactions"
  | "minted"
  | "loanDomain"
  | "editRecord"
  | "viewDomain"
  | "transferDomain"
  | "accountDomains"
  | "mapDirections"
  | "map"
  | "delete"
  | "edit"
  | "validate"
  | "info"
  | "notFound"
  | "unauthorized"
  | "history"
  | "settings"
  | "activity"
  | "account"
  | "search"
  | "wallet"
  | "share"
  | "qrCode"
  | "scan"
  | "copy"
  | "copied"
  | "paste"
  | "pasted"
  | "help"
  | "developer"
  | "email"
  | "github"
  | "alert"
  | "blockExplorer"
  | "policies"
  | "owner"
  | "user"
  | "twitter"
  | "instagram"
  | "facebook"
  | "linkedin"
  | "down"
  | "up"
  | "calendar"
  | "time"
  | "close"
  | "undo"
  | "archive"
  | "badgeCheck"
  | "arrowRight"
  | "chevronDown"
  | "chevronUp"
  | "chevronRight"
  | "unsaved";

export type LucideIconProps = IconProps & { defaultIcon: DefaultIcon };
// This function is used to determine the icon to display based on the defaultIcon prop
const getDefaultIconName = (defaultIcon: DefaultIcon) => {
  switch (defaultIcon) {
    case "actions":
      return LayoutGrid;
    case "buy":
      return PlusSquare;
    case "addRecord":
      return FilePlus;
    case "deleteRecord":
      return FileX;
    case "editRecord":
      return FileEdit;
    case "records":
      return FileStack;
    case "recordKey":
      return FileKey2;
    case "recordDetails":
      return FileText;
    case "recordTransactions":
      return FileDiff;
    case "pay":
      return HandCoins;
    case "transactions":
      return ArrowRightLeft;
    case "minted":
      return ArrowRight;
    case "loanDomain":
      return UserRoundPlus;
    case "editRecord":
      return FileEdit;
    case "viewDomain":
      return MousePointerSquare;
    case "transferDomain":
      return Combine;
    case "accountDomains":
      return SquareStack;
    case "mapDirections":
      return Route;
    case "map":
      return MapPinned;
    case "delete":
      return Trash;
    case "edit":
      return Edit3;
    case "validate":
      return SquareCheck;
    case "info":
      return Info;
    case "notFound":
      return CircleAlert;
    case "unauthorized":
      return ShieldAlert;
    case "history":
      return History;
    case "settings":
      return Settings2;
    case "activity":
      return ActivitySquare;
    case "account":
      return User2;
    case "search":
      return Search;
    case "wallet":
      return Wallet;
    case "share":
      return Share2;
    case "qrCode":
      return QrCode;
    case "scan":
      return ScanQrCode;
    case "copy":
      return Copy;
    case "copied":
      return CopyCheck;
    case "paste":
      return Clipboard;
    case "pasted":
      return ClipboardCheck;
    case "help":
      return HelpCircle;
    case "developer":
      return Code2;
    case "email":
      return Mail;
    case "github":
      return Github;
    case "alert":
      return AlertTriangle;
    case "blockExplorer":
      return Link;
    case "policies":
      return BookMarked;
    case "owner":
      return UserSquare2;
    case "user":
      return UserSquare;
    case "twitter":
      return Twitter;
    case "instagram":
      return Instagram;
    case "facebook":
      return Facebook;
    case "linkedin":
      return Linkedin;
    case "down":
      return SquareChevronDown;
    case "up":
      return SquareChevronDown;
    case "calendar":
      return CalendarDays;
    case "time":
      return Timer;
    case "close":
      return X;
    case "undo":
      return Undo2;
    case "archive":
      return ArchiveRestore;
    case "badgeCheck":
      return BadgeCheck;
    case "arrowRight":
      return ArrowRight;
    case "chevronDown":
      return ChevronDown;
    case "chevronUp":
      return ChevronUp;
    case "chevronRight":
      return ChevronRight;
    case "unsaved":
      return SaveOff;
    default:
      return FileQuestion;
  }
};

export function LucideIcon({ defaultIcon, ...props }: LucideIconProps) {
  const IconComponent = getDefaultIconName(defaultIcon);
  return <IconComponent {...props} />;
}
