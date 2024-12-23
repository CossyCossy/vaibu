import { useState } from "react";
import { router, usePathname } from "expo-router";
import { View, TouchableOpacity, Image, TextInput, Alert } from "react-native";

import { icons } from "../constants";

interface SearchInputProps {
  initialQuery?: string;
  refetch?: () => Promise<void>;
}

const SearchInput = ({ initialQuery, refetch }: SearchInputProps) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-gray-100 rounded-2xl border-1 border-gray-200 focus:border-secondary">
      <TextInput
        className="text-base mt-0.5 text-black-300 flex-1 font-pregular"
        value={query}
        placeholder="Search an event name"
        placeholderTextColor= "#161622"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (query === "")
            return Alert.alert(
              "Missing Query",
              "Please input something to search results across database"
            );

          if (pathname.startsWith("/search")) router.setParams({ query });
          else router.push(`/search/${query}`);
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
