import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    ImageGravity,
    Query,
    Storage,
  } from "react-native-appwrite";

  export const appwriteConfig = {
    endpoint: "http://192.168.1.11/v1",
    platform: "com.sabin.vaibu",
    projectId: "6762c769002f51ff7599",
    storageId: "6762d0720002dcf32ada",
    databaseId: "6762cd89003e75bb51f3",
    userCollectionId: "6762cdbb002e70aa45fc",
    videoCollectionId: "6762ce030038f7a527ba",
  };
  
  const client = new Client();
  
  client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);
  
  const account = new Account(client);
  const storage = new Storage(client);
  const avatars = new Avatars(client);
  const databases = new Databases(client);
  
  // Register user
  export async function createUser(email: string, password: string, username: string) {
    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
      );
  
      if (!newAccount) throw Error;
  
      const avatarUrl = avatars.getInitials(username);
  
      await signIn(email, password);
  
      const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        {
          accountId: newAccount.$id,
          email: email,
          username: username,
          avatar: avatarUrl,
        }
      );
  
      return newUser;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
  
  // Sign In
  export async function signIn(email: string, password: string) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
  
      return session;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
  
  // Get Account
  export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
  
  // Get Current User
  export async function getCurrentUser() {
    try {
      const currentAccount = await getAccount();
      if (!currentAccount) throw Error;
  
      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  
  // Sign Out
  export async function signOut() {
    try {
      const session = await account.deleteSession("current");
  
      return session;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
  
  // Upload File
  export async function uploadFile(file: { mimeType: string; name: string; size: number; uri: string; [key: string]: any }, type: string) {
    if (!file) return;
    try {
      const fileData = {
        name: file.name,
        type: file.mimeType,
        size: file.size,
        uri: file.uri || ''
      };
      
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        fileData
      );

      const fileUrl = await getFilePreview(uploadedFile.$id, type);
      return fileUrl;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
  
  // Get File Preview
  export async function getFilePreview(fileId: string, type: string) {
    let fileUrl;
  
    try {
      if (type === "video") {
        fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
      } else if (type === "image") {
        fileUrl = storage.getFilePreview(
          appwriteConfig.storageId,
          fileId,
          2000,
          2000,
          ImageGravity.Top,
          100
        ); 
      } else {
        throw new Error("Invalid file type");
      }
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
  
  interface VideoPostForm {
    thumbnail: { mimeType: string; name: string; size: number; uri: string; [key: string]: any };
    video: { mimeType: string; name: string; size: number; uri: string; [key: string]: any };
    title: string;
    prompt: string;
    userId: string;
  }

  export interface Post {
    $id: string;
    $createdAt: string;
    title: string;
    prompt: string;
    userId: string;
    video: string;
    thumbnail: string;
    creator: {
      username: string;
      avatar: string;
    }
  }

  // Create Video Post
  export async function createVideoPost(form: VideoPostForm) {
    try {
      const [thumbnailUrl, videoUrl] = await Promise.all([
        uploadFile(form.thumbnail, "image"),
        uploadFile(form.video, "video"),
      ]);

      // const currentUser = await getCurrentUser();

      const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        ID.unique(),
        {
          title: form.title,
          thumbnail: thumbnailUrl,
          video: videoUrl,
          prompt: form.prompt,
          creator: form.userId,
          // userId: form.userId,
          // email: currentUser?.email ?? '',
          // creator: {
          //   username: currentUser?.username ?? 'Unknown User',
          //   avatar: currentUser?.avatar ?? '',
          // },
        }
      );

      return newPost;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
  
  // Get all video Posts
  export async function getAllPosts() {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.orderDesc("$createdAt")]
      );
  
      return posts.documents.map(doc => ({ 
        $id: doc.$id,
        $createdAt: doc.$createdAt,
        title: doc.title,
        prompt: doc.prompt,
        userId: doc.creator.userId,
        video: doc.video,
        thumbnail: doc.thumbnail,
        creator: doc.creator,
        username: doc.creator.username,
        avatar: doc.creator.avatar
      })) as Post[];
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
  
  // Get video posts created by user
  export async function getUserPosts(userId: string ) {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.orderDesc("$createdAt"), Query.equal("creator", userId)]
      );
  
      return posts.documents;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
  
  // Get video posts that matches search query
  export async function searchPosts(query: string) {
    console.log(query);
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.search("title", query)]
      );
  
      if (!posts) throw new Error("Something went wrong");
  
      return posts.documents;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
  
  // Get latest created video posts
  export async function getLatestPosts() {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(7)]
      );

      return posts.documents.map(doc => ({
        $id: doc.$id,
        $createdAt: doc.$createdAt,
        title: doc.title,
        prompt: doc.prompt,
        userId: doc.creator.userId,
        video: doc.video,
        thumbnail: doc.thumbnail,
        creator: doc.creator,
        username: doc.creator.username,
        avatar: doc.creator.avatar
      })) as Post[];
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }