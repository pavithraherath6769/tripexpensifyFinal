/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/screenWrapper'; // Importing the screen wrapper component for consistent layout
import { colors } from '../theme'; // Importing color themes for consistent styling
import BackButton from '../components/backButton'; // Importing the custom back button component
import { useNavigation } from '@react-navigation/native'; // React Navigation hook for navigating between screens
import Snackbar from 'react-native-snackbar'; // Snackbar for displaying error or success messages
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase method to handle user sign-in
import { auth } from '../config/firebase'; // Firebase authentication instance
import { useDispatch, useSelector } from 'react-redux'; // Redux hooks for dispatching actions and accessing the state
import Loading from '../components/loading'; // Custom loading spinner component
import { setUserLoading } from '../redux/slices/user'; // Redux action to set user loading state

// SignInScreen component for user sign-in functionality
export default function SignInScreen() {
    // Local state for storing email and password input values
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Access the userLoading state from Redux store
    const { userLoading } = useSelector(state => state.user);

    // Hooks for navigation and dispatch
    const navigation = useNavigation();
    const dispatch = useDispatch();

    // Function to handle user sign-in process
    const handleSubmit = async () => {
        if (email && password) {
            try {
                // Set loading state to true before starting the sign-in process
                dispatch(setUserLoading(true));
                // Sign in using Firebase authentication with email and password
                await signInWithEmailAndPassword(auth, email, password);
                // Set loading state to false once sign-in is successful
                dispatch(setUserLoading(false));
            } catch (e) {
                // Set loading state to false if an error occurs during sign-in
                dispatch(setUserLoading(false));
                // Show error message using Snackbar
                Snackbar.show({
                    text: e.message,
                    backgroundColor: 'red', // Set background color of Snackbar to red for error
                });
            }
        } else {
            // If email or password is empty, show an error message
            Snackbar.show({
                text: 'Email and Password are required!',
                backgroundColor: 'red',
            });
        }
    };

    return (
        <ScreenWrapper>
            <View className="flex justify-between h-full mx-4">
                {/* Header section with back button and title */}
                <View>
                    <View className="relative">
                        {/* Back button to navigate to the previous screen */}
                        <View className="absolute top-0 left-0 z-10">
                            <BackButton />
                        </View>
                        {/* Sign-in title */}
                        <Text className={`${colors.heading} text-xl font-bold text-center`}>Sign In</Text>
                    </View>
                    
                    {/* Sign-in image */}
                    <View className="flex-row justify-center my-3 mt-5">
                        <Image className="h-80 w-80" source={require('../assets/images/login.png')} />
                    </View>
                    
                    {/* Input fields for email and password */}
                    <View className="space-y-2 mx-2">
                        {/* Email input field */}
                        <Text className={`${colors.heading} text-lg font-bold`}>Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={value => setEmail(value)} // Update email state when user types
                            className="p-4 bg-white rounded-full mb-3"
                        />

                        {/* Password input field */}
                        <Text className={`${colors.heading} text-lg font-bold`}>Password</Text>
                        <TextInput
                            value={password}
                            secureTextEntry // Hide the password input for security
                            onChangeText={value => setPassword(value)} // Update password state when user types
                            className="p-4 bg-white rounded-full mb-3"
                        />

                        {/* Forgot password link */}
                        <TouchableOpacity className="flex-row justify-end">
                            <Text>Forget Password?</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bottom section with Sign-In button or loading spinner */}
                <View>
                    {userLoading ? (
                        // Show loading spinner while the sign-in process is ongoing
                        <Loading />
                    ) : (
                        // Sign-In button
                        <TouchableOpacity
                            onPress={handleSubmit} // Call handleSubmit when the button is pressed
                            style={{ backgroundColor: colors.button }}
                            className="my-6 rounded-full p-3 shadow-sm mx-2"
                        >
                            <Text className="text-center text-white text-lg font-bold">Sign In</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </ScreenWrapper>
    );
}
