import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import React, {useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {COLOR} from '../../Styles/color';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/EvilIcons';
import {useNavigation} from '@react-navigation/native';
import {BASE_URL_API} from '../../../env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({navigation}) {
  const [pn, setPn] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [icon, setIcon] = useState({
    icon: 'eye',
    status: true,
  });
  const showPass = () => {
    if (icon.icon == 'eye') {
      setIcon({
        ...icon,
        icon: 'minus',
        status: false,
      });
    } else {
      setIcon({
        ...icon,
        icon: 'eye',
        status: true,
      });
    }
  };
  const cekNull = e => {
    if (e == '') {
      return true;
    }
  };

  const handleLogin = async () => {
    setLoading(true);

    if (pn === '' || password === '') {
      Alert.alert('PN dan Password tidak boleh kosong');
      setLoading(false);
      return;
    }

    const data = {
      pn: pn,
      password: password,
    };

    try {
      const response = await axios
        .post(`${BASE_URL_API}/v1/login`, data)
        .then(async response => {
          const token = response.data.token;
          console.log('LOGIN BERHASIL\n', response.data);
          await AsyncStorage.setItem('token', token);
          navigation.replace('Home');
        });
    } catch (error) {
      console.log('LOGIN GAGAL\n', error);
      Alert.alert('Login gagal', 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <ImageBackground
        source={require('../../Assets/bg.png')}
        style={{
          justifyContent: 'center',
          height: wp(200),
        }}>
        <ScrollView>
          <View
            style={{
              width: wp(100),
              // backgroundColor: COLOR.WHITE,
              height: hp(100),
            }}>
            {/* Image Start */}
            <View style={[styles.ContainerImage]}>
              <Image
                style={[styles.Image]}
                source={require('../../Assets/business-report.png')}
              />
            </View>
            {/* Image End */}

            <View
              style={{
                width: wp(80),
                height: wp(100),
                // position: 'absolute',
                bottom: 0,
                backgroundColor: COLOR.WHITE,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                zIndex: 1,
                // marginTop: wp(10),
                borderRadius: wp(5),
                borderColor: COLOR.PRIMARY,
                borderWidth: wp(0.2),
              }}>
              {/* Login Text Start */}
              <Text
                style={{
                  fontSize: wp(5),
                  color: COLOR.BLACK,
                  bottom: wp(3),
                  fontStyle: 'italic',
                }}>
                E - R e p o r t
              </Text>
              <View style={[styles.LoginContainer]}>
                <Text
                  style={{
                    fontSize: wp(7),
                    fontWeight: 'bold',
                    color: COLOR.BLACK,
                    textAlign: 'center',
                  }}>
                  Sign in
                </Text>
              </View>
              {/* Login Text End */}

              {/* TextInput Start */}
              <View
                style={{
                  width: '100%',
                  top: wp(5),
                }}>
                <TextInput
                  placeholder="PN"
                  underlineColor="transparent"
                  keyboardType={'number-pad'}
                  onChangeText={text => setPn(text)}
                  theme={{colors: {primary: COLOR.GREY}}}
                  style={[styles.TxtPN]}
                  left={
                    <TextInput.Icon name="account" color={COLOR.BLUE} />
                  }></TextInput>
                <TextInput
                  placeholder="Password"
                  underlineColor="transparent"
                  secureTextEntry={icon.status}
                  onChangeText={text => setPassword(text)}
                  value={password}
                  theme={{colors: {primary: COLOR.GREY}}}
                  style={[styles.TxtPass]}
                  left={
                    <TextInput.Icon name="lock" color={COLOR.BLUE} />
                  }></TextInput>
                <TouchableOpacity style={[styles.showEye]} onPress={showPass}>
                  <Icon
                    name={icon.icon}
                    color={COLOR.SECONDARYPRIMARY}
                    size={wp(10)}
                  />
                </TouchableOpacity>

                <Icon
                  name="user"
                  color={COLOR.SECONDARYPRIMARY}
                  size={wp(10)}
                  style={{position: 'absolute', left: wp(5), top: wp(3)}}
                />
                <Icon
                  name="lock"
                  color={COLOR.SECONDARYPRIMARY}
                  size={wp(10)}
                  style={{position: 'absolute', left: wp(5), top: wp(21)}}
                />
              </View>
              {/* TextInput End */}
              <TouchableOpacity
                disabled={loading}
                onPress={() => handleLogin()}
                style={{
                  backgroundColor: loading ? 'grey' : COLOR.BLUE,
                  height: wp(10),
                  borderRadius: wp(2),
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: wp(75),
                  alignSelf: 'center',
                  top: wp(10),
                  borderRadius: wp(1),
                  borderColor: COLOR.WHITE,
                }}>
                <Text style={{fontWeight: 'bold', color: COLOR.WHITE}}>
                  {loading ? 'LOADING...' : 'LOGIN'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Image: {
    justifyContent: 'center',
    width: wp(30),
    height: hp(15),
    alignSelf: 'center',
  },
  ContainerImage: {
    width: wp(50),
    height: hp(25),
    // backgroundColor: COLOR.RED,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // top: wp(10),
    // borderRadius: wp(25),
  },
  LoginContainer: {
    width: wp(75),
    // height: hp(5),
    // backgroundColor: COLOR.BLUE,
  },
  TxtPass: {
    height: wp(14),
    borderRadius: wp(2),
    // paddingHorizontal: wp(6),
    fontSize: wp(5),
    marginBottom: wp(4),
    borderColor: COLOR.GREY,
    backgroundColor: COLOR.WHITE,
    width: wp(75),
    alignSelf: 'center',
    borderWidth: wp(0.3),
  },
  showEye: {
    width: wp(15),
    height: wp(8),
    // backgroundColor: COLOR.BLUE,
    position: 'absolute',
    right: wp(4),
    top: wp(22),
    borderRadius: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  TxtPN: {
    height: wp(14),
    width: wp(75),
    borderRadius: wp(2),
    // paddingHorizontal: wp(6),
    fontSize: wp(5),
    marginBottom: wp(4),
    borderColor: COLOR.GREY,
    backgroundColor: COLOR.WHITE,
    alignSelf: 'center',
    borderWidth: wp(0.3),
  },
});
