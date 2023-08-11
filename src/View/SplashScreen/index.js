import {StyleSheet, Text, View, Image} from 'react-native';
import React, {Component} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {StackActions} from '@react-navigation/native';
import {COLOR} from '../../Styles/color';

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.dispatch(StackActions.replace('Login'));
    }, 3000);
  }

  render() {
    return (
      <View style={[styles.container]}>
        <Image
          style={[styles.tinyLogo]}
          source={require('../../Assets/report.png')}
        />
        <Text
          style={{
            fontSize: wp(5.5),
            fontWeight: 'bold',
            textAlign: 'center',
            color: COLOR.BLACK,
            marginTop: hp(2),
          }}>
          E - Report
        </Text>
        <Text
          style={{
            fontSize: wp(4),
            textAlign: 'center',
            color: COLOR.BLACK,
          }}>
          Report Application
        </Text>
        <Text style={[styles.footer]}>Powered by Dcc</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
    width: wp(100),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  tinyLogo: {
    backgroundColor: '#fff',
    height: hp(20),
    width: wp(40),
    alignSelf: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: wp(7),
    alignSelf: 'center',
    fontSize: wp(3.5),
    color: COLOR.BLACK,
  },
});

export default SplashScreen;
