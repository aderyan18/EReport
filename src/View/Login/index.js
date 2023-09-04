import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {COLOR} from '../../Styles/color';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
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
        icon: 'eye-slash',
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
      const response = await axios.post(
        `http://brisik.andexcargo.com/api/v1/login`,
        data,
      );

      if (response.data.code === 200) {
        const token = response.data.token;
        console.log('LOGIN BERHASIL\n', response.data);
        await AsyncStorage.setItem('token', token);
        navigation.replace('Home');
      } else {
        console.log('LOGIN GAGAL\n', response.data.code);
        Alert.alert('Login gagal', 'PN atau Password salah');
      }
    } catch (error) {
      console.log('LOGIN GAGAL\n', error);
      Alert.alert('Login gagal', 'Terjadi kesalahan saat login');
    }

    setLoading(false);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{
            width: wp(100),
            backgroundColor: COLOR.WHITE,
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

          {/* Login Text Start */}
          <View style={[styles.LoginContainer]}>
            <Text
              style={{fontSize: wp(7), fontWeight: 'bold', color: COLOR.BLACK}}>
              LOGIN
            </Text>
          </View>
          {/* Login Text End */}

          {/* TextInput Start */}
          <View
            style={{
              width: '100%',
              marginTop: wp(5),
            }}>
            <TextInput
              mode="outlined"
              label="PN"
              underlineColor="transparent"
              onChangeText={text => setPn(text)}
              theme={{colors: {primary: COLOR.PRIMARY}}}
              style={{
                height: wp(14),
                width: wp(80),
                borderRadius: wp(2),
                paddingHorizontal: wp(6),
                fontSize: wp(5),
                marginBottom: wp(4),
                borderColor: COLOR.PRIMARY,
                backgroundColor: COLOR.WHITE,
                alignSelf: 'center',
              }}></TextInput>
            <TextInput
              mode="outlined"
              label="Password"
              underlineColor="transparent"
              secureTextEntry={icon.status}
              onChangeText={text => setPassword(text)}
              value={password}
              theme={{colors: {primary: COLOR.PRIMARY}}}
              style={{
                height: wp(14),
                borderRadius: wp(2),
                paddingHorizontal: wp(6),
                fontSize: wp(5),
                marginBottom: wp(4),
                borderColor: COLOR.PRIMARY,
                backgroundColor: COLOR.WHITE,
                width: wp(80),
                alignSelf: 'center',
              }}></TextInput>
            <TouchableOpacity
              style={{
                width: wp(15),
                height: wp(8),
                // backgroundColor: COLOR.BLUE,
                position: 'absolute',
                right: wp(8),
                top: wp(25),
                borderRadius: wp(2),
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={showPass}>
              <Icon name={icon.icon} color={COLOR.PRIMARY} size={wp(6)} />
            </TouchableOpacity>

            <Icon
              name="user"
              color={COLOR.PRIMARY}
              size={wp(7)}
              style={{position: 'absolute', left: wp(13), top: wp(5)}}
            />
            <Icon
              name="lock"
              color={COLOR.PRIMARY}
              size={wp(7)}
              style={{position: 'absolute', left: wp(13), top: wp(26)}}
            />
            <TouchableOpacity
              style={{alignItems: 'flex-end', paddingRight: wp(10)}}>
              <Text style={{color: COLOR.BLACK}}>Lupa Kata Sandi ?</Text>
            </TouchableOpacity>
          </View>
          {/* TextInput End */}
          <TouchableOpacity
            disabled={loading}
            onPress={() => handleLogin()}
            style={{
              backgroundColor: loading ? 'grey' : COLOR.PRIMARY,
              height: wp(10),
              borderRadius: wp(2),
              justifyContent: 'center',
              alignItems: 'center',
              width: wp(80),
              alignSelf: 'center',
              top: wp(10),
            }}>
            <Text style={{fontWeight: 'bold', color: COLOR.WHITE}}>
              {loading ? 'LOADING...' : 'MASUK'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Image: {
    justifyContent: 'center',
    width: wp(40),
    height: hp(20),
    alignSelf: 'center',
  },
  ContainerImage: {
    width: wp(50),
    height: hp(25),
    // backgroundColor: COLOR.WHITE,
    alignSelf: 'center',
    top: wp(10),
    // borderRadius: wp(25),
  },
  LoginContainer: {
    width: wp(25),
    height: hp(5),
    // backgroundColor: COLOR.BLUE,
    marginLeft: wp(5),
    marginTop: wp(20),
  },
});
