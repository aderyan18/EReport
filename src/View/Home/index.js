import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {COLOR} from '../../Styles/color';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ActivityIndicator, Searchbar} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL_API} from '../../../env';
import {CommonActions} from '@react-navigation/native';
import Debitur from './Component/Debitur';
import RekDpk from './Component/RekDpk';
import RekNpl from './Component/RekNpl';

export default function Home({navigation}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => setSearchQuery(query);
  const [userInfo, setUserInfo] = useState({});
  let [isLoading, setIsLoading] = useState(true);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getUserInfo = async () => {
    await AsyncStorage.getItem('token', async (err, token) => {
      if (token) {
        console.log(token);
        await axios
          .get(`${BASE_URL_API}/user`, {
            headers: {
              Authorization: `Bearer ` + token,
              'Content-Type': 'application/json',
            },
          })
          .then(async res => {
            console.log('USER LOGIN\n', res.data);
            setUserInfo(res.data);
            setIsUserLoaded(true);
            setIsLoading(false);
          })
          .catch(err => {
            console.log(err.response.data.code);
          });
      }
    });
  };

  const handleLogout = () => {
    Alert.alert('Peringatan', 'Yakin Ingin Keluar dari Bri-Sik ?', [
      {
        text: 'YA',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: 'Login',
                },
              ],
            }),
          );
        },
        style: 'cancel',
      },
      {
        text: 'Batal',
        style: 'cancel',
      },
    ]);
    {
      cancelable: false;
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    getUserInfo();
  }, [refreshing]);
  return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableOpacity style={[styles.Profile]}>
        <Image
          source={require('../../Assets/user.png')}
          style={{width: wp(18), height: wp(18)}}
        />
        <View style={{flex: 1, flexDirection: 'column', marginLeft: wp(3)}}>
          <Text
            style={{
              color: COLOR.WHITE,
              fontSize: wp(4.5),
              fontWeight: 'bold',
            }}>
            {userInfo.pn}
          </Text>
          <Text
            style={{color: COLOR.WHITE, fontSize: wp(4), fontWeight: 'bold'}}>
            {userInfo.nama}
          </Text>
        </View>
        <Image
          source={require('../../Assets/transparan.png')}
          style={styles.Image}
        />
      </TouchableOpacity>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            refreshingContentColor={COLOR.PRIMARY}
          />
        }>
        <View
          style={{
            // atur scroll nya disini
            width: wp(100),
            alignItems: 'center',
            height: wp(240),
            // backgroundColor: COLOR.PRIMARY,
          }}>
          <View
            style={{
              width: wp(95),
              height: wp(20),
              // backgroundColor: COLOR.BLUE,
              marginTop: wp(2),
            }}>
            <Text
              style={{
                color: COLOR.BLACK,
                fontSize: wp(4.5),
                fontWeight: 'bold',
              }}>
              {' '}
              REKAP DPK
            </Text>
            {/* dpk start */}
            <View>
              <RekDpk />
            </View>
            {/* dpk end */}

            {/* NPL START */}
            <View
              style={{
                marginTop: wp(2),
                width: wp(95),
                height: wp(20),
                // backgroundColor: COLOR.PRIMARY,
              }}>
              <Text
                style={{
                  color: COLOR.BLACK,
                  fontSize: wp(4.5),
                  fontWeight: 'bold',
                }}
                numberOfLines={1}>
                {' '}
                REKAP NPL
              </Text>
              <View>
                <RekNpl />
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('DaftarNasabah')}
                style={[styles.BottomSearch]}>
                <Icon name="search" size={wp(5)} color={COLOR.WHITE} />
                <Text
                  style={{
                    color: COLOR.WHITE,
                    fontSize: wp(4),
                    fontWeight: 'bold',
                    marginLeft: wp(2),
                  }}>
                  Lihat Semua Nasabah
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleLogout()}
                style={[styles.BottomSearch, {backgroundColor: COLOR.RED}]}>
                <Icon name="sign-out" size={wp(5)} color={COLOR.WHITE} />
                <Text
                  style={{
                    color: COLOR.WHITE,
                    fontSize: wp(4),
                    fontWeight: 'bold',
                    marginLeft: wp(2),
                  }}>
                  Keluar
                </Text>
              </TouchableOpacity>
            </View>
            {/* NPL END */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // new
  Image: {
    width: wp(15),
    height: wp(13),
    // backgroundColor: COLOR.WHITE,
    alignSelf: 'center',
    // marginLeft: wp(5),
  },
  Profile: {
    width: wp(100),
    height: wp(25),
    backgroundColor: COLOR.PRIMARY,
    justifyContent: 'space-evenly',
    elevation: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(3),
  },
  BottomSearch: {
    marginTop: wp(2),
    width: wp(95),
    height: wp(11),
    backgroundColor: COLOR.SECONDARYPRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(2),
    // alignSelf: 'center',
    flexDirection: 'row',
  },
});
