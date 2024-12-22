# Vaibu 🎉 - Your Event Discovery App

## About the App
Vaibu (derived from Swahili slang for "Vibe") is a modern mobile application designed to connect people through events. Built with cutting-edge technology, Vaibu allows users to discover, explore, and engage with local events effortlessly.

### Key Features
- 🔐 Secure User Authentication
  - Register and login with ease
  - Email/password authentication
- 🎟️ Event Discovery
  - Browse and search events
  - Intuitive user interface

### Upcoming Features
- 📍 Event Location Tracking
- 🎫 Event Booking System
- 🌐 Enhanced Social Sharing
- 🔔 Personalized Event Recommendations

### Tech Stack
- [Expo](https://expo.dev/) - Cross-platform mobile development
- [TypeScript](https://www.typescriptlang.org/) - Robust type checking
- [Appwrite](https://appwrite.io/) - Backend as a Service
- React Native - Mobile app framework

### Project Status
**Current Version**: Starter Template
This is an initial version of Vaibu, laying the groundwork for a comprehensive event discovery platform. We're continuously improving and adding features to enhance user experience.

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Appwrite Configuration

### Prerequisites
- [Appwrite](https://appwrite.io/) account
- Appwrite project created

### Setup Steps
1. Create a new project in the [Appwrite Console](https://cloud.appwrite.io/console)

2. Create an `.env` file in the project root and add the following environment variables:
   ```
   EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   ```

3. Replace `your_project_id` with the actual Project ID from your Appwrite Console

4. Enable the following services in your Appwrite project:
   - Authentication
   - Databases
   - Storage

5. Configure Authentication Providers:
   - Set up Email/Password authentication
   - (Optional) Configure additional providers like Google, GitHub, etc.

### Recommended Security Settings
- Set up App Domains in Appwrite Console
- Configure CORS settings
- Use environment variables for sensitive configurations

### Troubleshooting
- Ensure all Appwrite dependencies are installed:
  ```bash
  npm install appwrite
  ```
- Verify your Appwrite endpoint and project ID
- Check network permissions in your Expo project

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
