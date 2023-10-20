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

export default function Home({navigation}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => setSearchQuery(query);
  const [userInfo, setUserInfo] = useState({});
  let [isLoading, setIsLoading] = useState(true);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [debitur, setDebitur] = useState([]);

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

  const getDebitur = async () => {
    await AsyncStorage.getItem('token', async (err, token) => {
      if (token) {
        // console.log(token);
        await axios
          .get(`${BASE_URL_API}/v1/debitur`, {
            headers: {
              Authorization: `Bearer ` + token,
              'Content-Type': 'application/json',
            },
          })
          .then(async res => {
            setDebitur(res.data.data);
            console.log('DEBITUR\n', res.data);
            setIsUserLoaded(true);
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

  // function component start
  function rekdpk(angka, orang, jumlah) {
    return (
      <View style={[styles.DPKcontent]}>
        <View style={[styles.Circle]}>
          <Text style={{color: COLOR.WHITE, fontSize: wp(6)}}>{angka}</Text>
        </View>
        <Text
          style={{
            color: COLOR.BLACK,
            fontSize: wp(4.5),
            marginLeft: wp(3),
          }}>
          {orang} Orang
        </Text>
        <View style={[styles.Jumlah]}>
          <Text
            style={{
              color: COLOR.BLACK,
              fontWeight: 'bold',
            }}>
            {jumlah}
          </Text>
        </View>
      </View>
    );
  }

  function rekNPL(icon, nama, jumlah, orang) {
    return (
      <View style={[styles.DPKcontent]}>
        <View style={[styles.Circle]}>
          <Icon name={icon} size={wp(6)} color={COLOR.WHITE} />
        </View>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: wp(30),
            height: wp(13),
          }}>
          <Text
            style={{
              color: COLOR.BLACK,
              fontSize: wp(4),
              marginLeft: wp(1.5),
            }}>
            {nama}
          </Text>
          <Text
            style={{
              color: COLOR.BLACK,
              fontSize: wp(3.5),
              marginLeft: wp(1.5),
              fontWeight: 'bold',
            }}>
            {orang} Orang
          </Text>
        </View>
        <View
          style={{
            width: wp(45),
            height: wp(13),
            justifyContent: 'center',
            // borderRadius: wp(5),
            alignItems: 'flex-end',
            // marginLeft: wp(3),
            alignSelf: 'center',
          }}>
          <Text
            style={{
              color: COLOR.BLACK,
              fontWeight: 'bold',
            }}>
            {jumlah}
          </Text>
        </View>
      </View>
    );
  }

  // function component end

  useEffect(() => {
    getUserInfo();
    getDebitur();
  }, [refreshing]);
  return (
    <View style={{flex: 1}}>
      <View style={{height: wp(10)}}></View>
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
            height: wp(180),
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

            {/* TES FUNCTION START */}
            {rekdpk(1, '20', 'Rp. 100.000.00')}
            {rekdpk(2, '40', 'Rp. 1.100.000.00')}
            {rekdpk(3, '60', 'Rp. 5.500.000.00')}
            {/* TES FUNCTION END */}

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
                {''}
                REKAP NPL
              </Text>
              <View
                style={{
                  width: wp(95),
                  height: wp(65),
                  // backgroundColor: COLOR.PRIMARY,
                }}>
                {rekNPL('hand-o-up', 'Kurang Lancar', 'Rp. 100.000.00', '20')}
                {rekNPL('minus', 'Diragukan', 'Rp. 1.100.000.00', '50')}
                {rekNPL('bitbucket', 'Macet', 'Rp. 5.500.000.00', '90')}
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('DaftarNasabah')}
                style={{
                  // marginTop: wp(2),
                  width: wp(95),
                  height: wp(12),
                  backgroundColor: COLOR.SECONDARYPRIMARY,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: wp(2),
                  // alignSelf: 'center',
                  flexDirection: 'row',
                }}>
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
                style={{
                  marginTop: wp(2),
                  width: wp(95),
                  height: wp(12),
                  backgroundColor: COLOR.RED,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: wp(2),
                  // alignSelf: 'center',
                  flexDirection: 'row',
                }}>
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
    </View>
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
  DPKcontent: {
    width: wp(95),
    height: wp(20),
    backgroundColor: COLOR.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLOR.PRIMARY,
    borderRadius: wp(5),
    marginTop: wp(1),
  },
  Circle: {
    width: wp(15),
    height: wp(13),
    backgroundColor: COLOR.PRIMARY,
    justifyContent: 'center',
    borderRadius: wp(5),
    alignItems: 'center',
    marginLeft: wp(3),
  },
  Jumlah: {
    width: wp(50),
    height: wp(13),
    // backgroundColor: COLOR.PRIMARY,
    justifyContent: 'center',
    // borderRadius: wp(5),
    alignItems: 'flex-end',
    marginLeft: wp(3),
    alignSelf: 'center',
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
});
