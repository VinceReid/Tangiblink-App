import OpenLocationCode from "@/utils/openlocationcode";
import { LocationObject } from "expo-location";

export const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const r = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = r * c; // Distance in kilometers
  const m = d * 1000; // Distance in meters
  return m;
};

// Converts from degrees to radians.
function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function getDistance(location: LocationObject, domain: string) {
  const isValidPlusCode = OpenLocationCode.isValid(domain);
  if (!isValidPlusCode) return Infinity;
  const point = OpenLocationCode.decode(domain) as any;
  return haversine(
    location.coords.latitude,
    location.coords.longitude,
    point.latitudeCenter,
    point.longitudeCenter
  );
}

// distance in meters to human readable format in kilometers or meters
export function formatDistance(distance: number) {
  if (distance < 1000) {
    return `${Math.round(distance)}m`;
  }
  return `${(distance / 1000).toFixed(2)}km`;
}
