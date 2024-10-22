/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import ScreenWrapper from '../components/screenWrapper'; // Importing custom screen wrapper for consistent layout
import { colors } from '../theme'; // Importing color theme for consistent styling
import randomImage from '../assets/images/randomImage'; // Function to get a random image for trips
import EmptyList from '../components/emptyList'; // Component to display when the list is empty
import { useIsFocused, useNavigation } from '@react-navigation/native'; // React Navigation hooks for navigation and focus
import { signOut } from 'firebase/auth'; // Firebase method to handle user logout
import { auth, tripsRef } from '../config/firebase'; // Firebase configuration
import { useSelector } from 'react-redux'; // Redux hook to access the global state
import { getDocs, query, where } from 'firebase/firestore'; // Firebase Firestore methods for querying the database

// Hardcoded items for demonstration (can be replaced with dynamic data from Firestore)
const items = [
  { id: 1, place: 'Nuwara Eliya', country: 'Sri Lanka' },
  { id: 2, place: 'Kandy', country: 'Sri Lanka' },
  { id: 3, place: 'Washington dc', country: 'America' },
  { id: 4, place: 'New York', country: 'America' },
];

// HomeScreen component for displaying the list of trips
export default function HomeScreen() {
  const navigation = useNavigation(); // Hook to manage navigation between screens
  const { user } = useSelector(state => state.user); // Accessing the user state from the Redux store
  const [trips, setTrips] = useState(items); // State to store the list of trips (initially set to hardcoded items)
  const isFocused = useIsFocused(); // Hook to check if the screen is currently focused

  // Function to fetch trips from Firestore based on the logged-in user's ID
  const fetchTrips = async () => {
    const q = query(tripsRef, where("userId", "==", user.uid)); // Query to fetch trips for the logged-in user
    const querySnapshot = await getDocs(q); // Fetch data from Firestore
    let data = [];
    querySnapshot.forEach(doc => {
      // Map each document to a trip object and push it into the array
      data.push({ ...doc.data(), id: doc.id });
    });
    setTrips(data); // Update the trips state with the fetched data
  };

  // UseEffect to fetch trips whenever the screen is focused
  useEffect(() => {
    if (isFocused) fetchTrips(); // Fetch trips only when the screen is focused
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  // Function to handle user logout
  const handleLogout = async () => {
    await signOut(auth); // Sign out the user using Firebase authentication
  };

  return (
    <ScreenWrapper className="flex-1">
      {/* Header Section */}
      <View className="flex-row justify-between items-center p-4">
        {/* App title */}
        <Text className={`${colors.heading} font-bold text-3xl shadow-sm`}>Trip Expensify</Text>
        {/* Logout button */}
        <TouchableOpacity onPress={handleLogout} className="p-2 px-3 bg-white border border-gray-200 rounded-full">
          <Text className={colors.heading}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Banner Image Section */}
      <View className="flex-row justify-center items-center bg-blue-200 rounded-xl mx-4 mb-4">
        <Image source={require('../assets/images/banner.png')} className="w-60 h-60" />
      </View>

      {/* Recent Trips Section */}
      <View className="px-4 space-y-3">
        <View className="flex-row justify-between items-center">
          <Text className={`${colors.heading} font-bold text-xl`}>Recent Trips</Text>
          {/* Add Trip button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('AddTrip')} // Navigate to the AddTrip screen
            className="p-2 px-3 bg-white border border-gray-200 rounded-full"
          >
            <Text className={colors.heading}>Add Trip</Text>
          </TouchableOpacity>
        </View>

        {/* FlatList to display trips */}
        <View style={{ height: 430 }}>
          <FlatList
            data={trips} // Data for the FlatList
            numColumns={2} // Display two columns of trips
            ListEmptyComponent={<EmptyList message={"You haven't recorded any trips yet"} />} // Display when the list is empty
            keyExtractor={item => item.id} // Unique key for each trip
            showsVerticalScrollIndicator={false} // Hide the vertical scroll indicator
            columnWrapperStyle={{ justifyContent: 'space-between' }} // Align items with space between
            className="mx-1"
            renderItem={({ item }) => (
              // Touchable trip card to navigate to the TripExpenses screen
              <TouchableOpacity
                onPress={() => navigation.navigate('TripExpenses', { ...item })} // Pass trip details to TripExpenses screen
                className="bg-white p-3 rounded-2xl mb-3 shadow-sm"
              >
                <View>
                  {/* Random image for each trip */}
                  <Image source={randomImage()} className="w-36 h-36 mb-2" />
                  {/* Trip place and country */}
                  <Text className={`${colors.heading} font-bold`}>{item.place}</Text>
                  <Text className={`${colors.heading} text-xs`}>{item.country}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}
