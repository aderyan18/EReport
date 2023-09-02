import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import NavigationRoutes from './src/routes';
import localization from 'moment/locale/id';
import moment from 'moment';
moment.updateLocale('id', localization);
export default function App() {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <NavigationRoutes />
    </>
  );
}
