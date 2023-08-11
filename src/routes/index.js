import react from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {COLOR} from '../Styles/color';

import Login from '../View/Login';
import splashScreen from '../View/SplashScreen';
import Home from '../View/Home';
import Account from '../View/Account';
import DetailNasabah from '../View/DetailNasabah';
// cuki tes kah
const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const NavigationRoutes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="SplashScreen">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SplashScreen" component={splashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="DetailNasabah" component={DetailNasabah} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default NavigationRoutes;
