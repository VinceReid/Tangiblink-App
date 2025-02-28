import { type ViewProps } from "react-native";
import { View } from 'tamagui';

export function CardContainer({
	...otherProps
}: ViewProps) {

	return <View bc={"$background"} br="$5" p="$2" my="$1" shac={"$color10"} shof={{width: 4, height: 4}} shar={"$1"} style={{elevation: 10}} {...otherProps} />;
}