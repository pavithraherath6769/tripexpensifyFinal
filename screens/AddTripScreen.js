/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/screenWrapper'; // Custom screen wrapper for consistent layout
import { colors } from '../theme'; // Importing color theme for styling
import BackButton from '../components/backButton'; // Back button component to navigate back
import { useNavigation } from '@react-navigation/native'; // React Navigation hook for navigating between screens
import Loading from '../components/loading'; // Custom loading spinner component
import Snackbar from 'react-native-snackbar'; // Snackbar for displaying messages
import { addDoc } from 'firebase/firestore'; // Firestore method to add a new document
import { tripsRef } from '../config/firebase'; // Firebase trips reference
import { useSelector } from 'react-redux'; // Redux hook to access global state

// AddTripScreen component for adding a new trip
export default function AddTripScreen() {
    // Local state to store trip details
    const [place, setPlace] = useState(''); // State for the trip's place
    const [country, setCountry] = useState(''); // State for the trip's country
    const [loading, setLoading] = useState(false); // State to handle loading state during API call

    // Access the current user from the Redux store
    const { user } = useSelector(state => state.user);

    // Hook to navigate between screens
    const navigation = useNavigation();

    // Function to handle adding a new trip
    const handleAddTrip = async () => {
        if (place && country) {
            // If place and country are provided, proceed with adding the trip
            setLoading(true); // Show loading indicator during the Firestore operation
            try {
                let doc = await addDoc(tripsRef, {
                    place,
                    country,
                    userId: user.uid, // Link the trip to the current user's ID
                });
                setLoading(false); // Hide loading indicator after the operation

                if (doc && doc.id) {
                    navigation.goBack(); // Navigate back to the previous screen after successful addition
                }
            } catch (error) {
                // Handle any error that occurs during the Firestore operation
                setLoading(false);
                Snackbar.show({
                    text: error.message,
                    backgroundColor: 'red',
                });
            }
        } else {
            // Show an error message if the place or country is not provided
            Snackbar.show({
                text: 'Place and Country are required!',
                backgroundColor: 'red',
            });
        }
    };

    return (
        <ScreenWrapper>
            <View className="flex justify-between h-full mx-4">
                {/* Top section with back button and title */}
                <View>
                    <View className="relative mt-5">
                        {/* Back button to return to the previous screen */}
                        <View className="absolute top-0 left-0 z-10">
                            <BackButton />
                        </View>

                        {/* Screen title */}
                        <Text className={`${colors.heading} text-xl font-bold text-center`}>Add Trip</Text>
                    </View>

                    {/* Display image */}
                    <View className="flex-row justify-center my-3 mt-5">
                        <Image className="h-72 w-72" source={require('../assets/images/4.png')} />
                    </View>

                    {/* Input fields for Place and Country */}
                    <View className="space-y-2 mx-2">
                        {/* Input for Place */}
                        <Text className={`${colors.heading} text-lg font-bold`}>Where On Earth?</Text>
                        <TextInput
                            value={place}
                            onChangeText={value => setPlace(value)} // Update place state on user input
                            className="p-4 bg-white rounded-full mb-3"
                        />

                        {/* Input for Country */}
                        <Text className={`${colors.heading} text-lg font-bold`}>Which Country</Text>
                        <TextInput
                            value={country}
                            onChangeText={value => setCountry(value)} // Update country state on user input
                            className="p-4 bg-white rounded-full mb-3"
                        />
                    </View>
                </View>

                {/* Bottom section with Add Trip button or loading spinner */}
                <View>
                    {loading ? (
                        // Show loading spinner when the trip is being added
                        <Loading />
                    ) : (
                        // Add Trip button
                        <TouchableOpacity
                            onPress={handleAddTrip} // Call handleAddTrip function when the button is pressed
                            style={{ backgroundColor: colors.button }}
                            className="my-6 rounded-full p-3 shadow-sm mx-2"
                        >
                            <Text className="text-center text-white text-lg font-bold">Add Trip</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </ScreenWrapper>
    );
}
