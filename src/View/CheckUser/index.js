import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CheckUser({navigation}) {
  useEffect(() => {
    getUserToken();
  }, []);

  const getUserToken = async () => {
    await AsyncStorage.getItem('token', (err, token) => {
      if (token) {
        navigation.replace('Home');
      } else {
        navigation.replace('Login');
      }
    });
  };

  return null;
}
