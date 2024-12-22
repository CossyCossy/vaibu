import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";
import { Image, Text, View ,TouchableOpacity} from "react-native";

import { icons } from "../../constants";
import { Loader } from '../../components';
import { useGlobalContext } from "../../context/GlobalProvider";
import Svg, { Path } from 'react-native-svg';

const TabBarCustomButton = ({ accessibilityState, children, onPress }: any) => {
  var isSelected = accessibilityState.selected

  if (isSelected) {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={{ flexDirection: 'row', position: 'absolute', top: 0 }}>
          <View style={{ flex: 1, backgroundColor: "#fff" }}></View>
          <Svg
            width={75}
            height={61}
            viewBox="0 0 75 61"
          >
            <Path
              d="M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z"
              fill={"#fff"}
            />
          </Svg>
          <View style={{ flex: 1, backgroundColor: "#fff" }}></View>
        </View>

        <TouchableOpacity
          style={{
            top: -22.5,
            justifyContent: 'center',
            alignItems: 'center',
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "#fff"
          }}
          onPress={onPress}
        >
          {children}
        </TouchableOpacity>
      </View>
    )
  } else {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          height: 60,
          backgroundColor: "#fff",
        }}
        activeOpacity={1}
        onPress={onPress}
      >
        {children}

      </TouchableOpacity>
    )
  }
}

const TabIcon = ({ icon, color, name, focused } : any) => {
  return (
    <View className="flex items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      {/* <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text> */}
    </View>
  );
};

const TabLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && !isLogged) return <Redirect href="/signin" />;
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: 'transparent',//"#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 50,
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#8A2BE2",
          tabBarInactiveTintColor: "#CDCDE0",
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
            tabBarButton: (props) => (
              <TabBarCustomButton
              {...props}
            />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plus}
                color={color}
                name="Create"
                focused={focused}
              />
            ),
            tabBarButton: (props) => (
              <TabBarCustomButton
              {...props}
            />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
            tabBarButton: (props) => (
              <TabBarCustomButton
              {...props}
            />
            ),
          }}
        />
      </Tabs>

      <Loader isLoading={loading} />
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default TabLayout;
