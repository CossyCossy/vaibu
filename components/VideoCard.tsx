import React, { useState, useEffect, useCallback } from "react";
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from "expo-video";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";

import { icons } from "../constants";

interface VideoCardProps {
  title: string;
  creator: string;
  avatar: string;
  thumbnail: string;
  video: string;
}

const VideoCard = ({ title, creator, avatar, thumbnail, video }: VideoCardProps) => {
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
      const qualifiedUrl = qualifyVideoUrl(video);
      setVideoUri(qualifiedUrl);
    } catch (err) {
      setError('Invalid video URL');
    }
  }, [video, qualifyVideoUrl]);

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
      <View className="flex flex-col items-center px-4 mb-14">
        <Text className="text-red-500">Error: {error}</Text>
        <Text className="text-white">Video URL: {videoUri}</Text>
      </View>
    );
  }

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-full border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-black-200"
              numberOfLines={1}
            >
              {title} 
            </Text>
            <Text
              className="text-xs text-black-300 font-pregular"
              numberOfLines={1}
            >
              {creator}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>

      {play && videoUri ? (
        <VideoView
          player={player}
          style={{ width: '100%', height: 240, borderRadius: 12, marginTop: 12 }}
          allowsFullscreen
          allowsPictureInPicture
          contentFit="cover"
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setPlay(true);
            player.play();
          }}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
