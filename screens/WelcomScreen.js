/* eslint-disable prettier/prettier */
import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import ScreenWrapper from '../components/screenWrapper'; // Custom wrapper component for the screen
import { colors } from '../theme'; // Importing the color palette for consistent UI
import { useNavigation } from '@react-navigation/native'; // Hook to navigate between screens

// Import Google Signin and Firebase authentication
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebase'; // Firebase authentication instance

// Configure Google Sign-in with the web client ID (replace with your own client ID)
GoogleSignin.configure({
  webClientId: '713681478913-tvd14diqkvu8ujnf2s5u20g9a602olt4.apps.googleusercontent.com', // Client ID for web authentication
});

// Welcome screen component
export default function WelcomeScreen() {
  const navigation = useNavigation(); // Hook to manage navigation between screens

  // Function to handle Google Sign-in
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices(); // Ensure Google Play services are available
      const { idToken } = await GoogleSignin.signIn(); // Sign in and retrieve the ID token
      const googleCredentials = GoogleAuthProvider.credential(idToken); // Use the token to create Google credentials
      await signInWithCredential(auth, googleCredentials); // Sign in to Firebase with Google credentials
    } catch (error) {
      // Handle possible errors during the sign-in process
      console.log('Error during sign-in: ', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // Handle if the user cancels the sign-in process
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // Handle if a sign-in operation is already in progress
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // Handle if Google Play services are not available or outdated
      } else {
        // Handle other errors
      }
    }
  };

  return (
    // Wrapping the entire screen with a custom wrapper component for consistent styling
    <ScreenWrapper>
      <View className="h-full flex justify-around">
        {/* Welcome Image */}
        <View className="flex-row justify-center mt-10">
          <Image source={require('../assets/images/welcome.gif')} className="h-96 w-96 shadow" />
        </View>
        
        {/* Button Section */}
        <View className="mx-5 mb-20">
          {/* App Title */}
          <Text className={`text-center font-bold text-4xl ${colors.heading} mb-10`}> Trip Expensify</Text>
          
          {/* Sign In Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('SignIn')} // Navigate to the SignIn screen
            className="shadow p-3 rounded-full mb-5"
            style={{ backgroundColor: colors.button }}>
            <Text className="text-center text-white text-lg font-bold">Sign In</Text>
          </TouchableOpacity>
          
          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')} // Navigate to the SignUp screen
            className="shadow p-3 rounded-full mb-5"
            style={{ backgroundColor: colors.button }}>
            <Text className="text-center text-white text-lg font-bold">Sign Up</Text>
          </TouchableOpacity>
          
          {/* Google Sign-In Button */}
          <TouchableOpacity
            onPress={() => signIn()} // Call the Google sign-in function
            className="shadow p-3 rounded-full bg-white">
            <View className="flex-row justify-center items-center space-x-3">
              {/* Google Icon */}
              <Image source={require('../assets/images/googleIcon.png')} className="h-8 w-8" />
              <Text className="text-center text-gray-600 text-lg font-bold">Sign In with Google</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}
