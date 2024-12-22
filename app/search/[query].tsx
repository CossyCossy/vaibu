import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useAppwrite from "../../lib/useAppwrite";
import { searchPosts } from "../../lib/appwrite";
import { EmptyState, SearchInput, VideoCard } from "../../components";

const Search = () => {
  const { query } = useLocalSearchParams();
  const searchQuery = Array.isArray(query) ? query[0] : query;
  const { data: posts, refetch } = useAppwrite(() => searchPosts(searchQuery || ''));

  useEffect(() => {
    refetch();
  }, [searchQuery]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex my-6 px-4">
              <Text className="font-pmedium text-black-100 text-sm">
                Search Results
              </Text>
              <Text className="text-2xl font-psemibold text-black-300 mt-1">
                {searchQuery}
              </Text>

              <View className="mt-6 mb-8">
                <SearchInput initialQuery={searchQuery} refetch={refetch} />
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
