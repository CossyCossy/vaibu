import React, { useState, useEffect, useCallback } from "react";
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from "expo-video";
import * as Animatable from "react-native-animatable";
import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

import { icons } from "../constants";

interface Post {
  $id: string;
  video: string;
  thumbnail: string;
}

interface TrendingItemProps { 
  activeItem: Post;
  item: Post;
}

const zoomIn = {
  from: {
    transform: [{ scale: 0.9 }] 
  },
  to: {
    transform: [{ scale: 1 }]
  },
};

const zoomOut = {
  from: {
    transform: [{ scale: 1 }]
  },
  to: {
    transform: [{ scale: 0.9 }]
  },
};

const TrendingItem = ({ activeItem, item }: TrendingItemProps) => { 
  const [play, setPlay] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Comprehensive URL validation and qualification
  const qualifyVideoUrl = useCallback((inputUrl: string) => {
    // Remove any leading/trailing whitespace
    let cleanUrl = inputUrl.trim();

    // If it's already a full URL, return as-is
    if (/^https?:\/\//i.test(cleanUrl)) { 
      return cleanUrl;
    }

    // If it starts with a slash, assume it's a local or relative path
    if (cleanUrl.startsWith('/')) {
      return `file://${cleanUrl}`;
    }

    // If it doesn't start with http/https, try prepending https
    return `https:${cleanUrl.startsWith('//') ? '' : '//'}${cleanUrl}`;
  }, []);

  useEffect(() => {
    try {
      const qualifiedUrl = qualifyVideoUrl(item.video);
      setVideoUri(qualifiedUrl);
    } catch (err) {
      setError('Invalid video URL');
    }
  }, [item.video, qualifyVideoUrl]);

  const player = useVideoPlayer(videoUri || '', (player) => {
    
    player.loop = false;
    
    // Add error handling to player
    player.addListener('playingChange', (e: any) => {
      if (e.error) {
        setError('Failed to load video');
        setPlay(false);
      }
    });

    if (play && videoUri) {
      try {
        player.play();
      } catch (err) {
        setError('Could not play video');
      }
    }
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  useEffect(() => {
  
  }, [videoUri, play, isPlaying, error]);

  useEffect(() => {
    if (!isPlaying) {
      setPlay(false);
    }
  }, [isPlaying]);

  // Error rendering
  if (error) {
    return (
      <View className="w-52 h-72 rounded-[33px] mt-3 bg-white/10 justify-center items-center">
        <Text className="text-red-500">Error: {error}</Text>
        <Text className="text-white">Video URL: {videoUri}</Text>
      </View>
    );
  }

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem.$id === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play && videoUri ? (
        <VideoView
          player={player}
          // className="w-52 h-72 rounded-[33px] mt-3 bg-white/10"
          style={{
            width: 182,    // w-52 (52 * 4 = 208)
            height: 252,   // h-72 (72 * 4 = 288)
            borderRadius: 30, // rounded-[33px]
            marginTop: 12,   // mt-3 (3 * 4 = 12)
            backgroundColor: 'rgba(255, 255, 255, 0.1)' // bg-white/10
          }}
          contentFit="cover"
          allowsFullscreen
          allowsPictureInPicture
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setPlay(true);
            player.play();
          }}
          className="w-52 h-72 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <ImageBackground
            source={{
              uri: item.thumbnail,
            }}
            className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }: { posts: Post[] }) => {
  const [activeItem, setActiveItem] = useState(posts[0]);

  const viewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<{
      key: string;
      isViewable: boolean;
      item: any;
    }>;
  }) => {
    if (viewableItems.length > 0) {
      const activePost = posts.find(post => post.$id === viewableItems[0].key);
      if (activePost) {
        setActiveItem(activePost);
      }
    }
  };

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170, y: 0 }}
    />
  );
};

export default Trending;
