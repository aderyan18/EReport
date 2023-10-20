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
      this.props.navigation.dispatch(StackActions.replace('CheckUser'));
    }, 3000);
  }

  render() {
    return (
      <View style={[styles.container]}>
        <Image
          style={[styles.tinyLogo]}
          source={require('../../Assets/brisik.png')}
        />
        <Text
          style={{
            fontSize: wp(5.5),
            fontWeight: 'bold',
            textAlign: 'center',
            color: COLOR.BLACK,
            marginTop: hp(2),
          }}>
          BRI-Sik
        </Text>
        <Text
          style={{
            fontSize: wp(4),
            textAlign: 'center',
            color: COLOR.BLACK,
          }}>
          App
        </Text>
        <Text style={[styles.footer]}>
          Powered by <Text style={{color: COLOR.PRIMARY}}>DCC</Text>
        </Text>
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
    height: hp(13),
    width: wp(30),
    alignSelf: 'center',
    borderRadius: wp(5),
  },
  footer: {
    position: 'absolute',
    bottom: wp(7),
    alignSelf: 'center',
    fontSize: wp(3.5),
    color: COLOR.BLACK,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
