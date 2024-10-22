/* eslint-disable prettier/prettier */
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import ScreenWrapper from '../components/screenWrapper';
import { colors } from '../theme';
import BackButton from '../components/backButton';
import { useNavigation } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setUserLoading } from '../redux/slices/user';
import Loading from '../components/loading';
import { launchCamera } from 'react-native-image-picker';

export default function SignInScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [photoUri, setPhotoUri] = useState(null); // State to store the image URI
    const { userLoading } = useSelector(state => state.user);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const handleSubmit = async () => {
        if (email && password) {
            try {
                dispatch(setUserLoading(true));
                await createUserWithEmailAndPassword(auth, email, password);
                dispatch(setUserLoading(false));
            } catch (e) {
                dispatch(setUserLoading(false));
                Snackbar.show({
                    text: e.message,
                    backgroundColor: 'red'
                });
            }
        } else {
            Snackbar.show({
                text: 'Email and Password are required!',
                backgroundColor: 'red'
            });
        }
    };

    // Function to launch the camera
    const handleCameraPress = () => {
        launchCamera(
            {
                mediaType: 'photo',
                cameraType: 'back',
                saveToPhotos: true,
            },
            response => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.errorCode) {
                    console.log('Error:', response.errorMessage);
                } else {
                    // Set the URI of the photo taken
                    setPhotoUri(response.assets[0].uri);
                }
            }
        );
    };

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex justify-between h-full mx-4">
                    <View>
                        <View className="relative">
                            <View className="absolute top-0 left-0 z-10">
                                <BackButton />
                            </View>
                            <Text className={`${colors.heading} text-xl font-bold text-center`}>Sign Up</Text>
                        </View>
                        
                        <View className="flex-row justify-center my-3 mt-5">
                            <Image className="h-80 w-80" source={require('../assets/images/signup.png')} />
                        </View>
                        
                        <View className="space-y-2 mx-2">
                            <Text className={`${colors.heading} text-lg font-bold`}>Email</Text>
                            <TextInput
                                value={email}
                                onChangeText={value => setEmail(value)}
                                className="p-4 bg-white rounded-full mb-3"
                            />
                            <Text className={`${colors.heading} text-lg font-bold`}>Password</Text>
                            <TextInput
                                value={password}
                                secureTextEntry
                                onChangeText={value => setPassword(value)}
                                className="p-4 bg-white rounded-full mb-3"
                            />
                        </View>

                        {/* Camera Button */}
                        <View className="space-y-2 mx-2">
                            <TouchableOpacity onPress={handleCameraPress} style={{ backgroundColor: colors.button }} className="rounded-full p-3 shadow-sm mx-2">
                                <Text className="text-center text-white text-lg font-bold">Open Camera</Text>
                            </TouchableOpacity>
                            {photoUri && (
                                <Image source={{ uri: photoUri }} style={{ width: 100, height: 100, marginTop: 10 }} />
                            )}
                        </View>
                    </View>

                    <View>
                        {userLoading ? (
                            <Loading />
                        ) : (
                            <TouchableOpacity
                                onPress={handleSubmit}
                                style={{ backgroundColor: colors.button }}
                                className="my-6 rounded-full p-3 shadow-sm mx-2"
                            >
                                <Text className="text-center text-white text-lg font-bold">Sign Up</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}