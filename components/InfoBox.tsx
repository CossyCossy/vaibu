import { View, Text } from "react-native";

interface InfoBoxProps {
  title: string | any;
  subtitle?: string;
  containerStyles?: string;
  titleStyles?: string;
}

const InfoBox = ({ title, subtitle, containerStyles, titleStyles }: InfoBoxProps) => {
  return (
    <View className={containerStyles}>
      <Text className={`text-black text-center font-psemibold ${titleStyles}`}>
        {title}
      </Text>
      <Text className="text-sm text-black-100 text-center font-pregular">
        {subtitle}
      </Text>
    </View>
  );
};

export default InfoBox;
