import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
import {Searchbar} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL_API} from '../../../env';
import {CommonActions} from '@react-navigation/native';

export default function Home({navigation}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => setSearchQuery(query);
  const [userInfo, setUserInfo] = useState({});
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  const getUserInfo = async () => {
    await AsyncStorage.getItem('id', async (err, id) => {
      if (token) {
        await AsyncStorage.getItem('id', async (err, id) => {
          if (id) {
            console.log('ID :', id, 'TOKEN :', token);
            await axios
              .get(`${BASE_URL_API}/user/${id}`, {
                headers: {
                  Authorization: `Bearer` + token,
                  'Content-Type': 'application/json',
                },
              })
              .then(async res => {
                setUserInfo(res.data.data);
                setIsUserLoaded(true);
              })
              .catch(err => {
                console.log(err.response.data.message);
              });
          }
        });
      }
    });
  };
  const handleLogout = () => {
    Alert.alert('Peringatan', 'Yakin Ingin Keluar dari Bri-Sik ?', [
      {
        text: 'YA',
        onPress: async () => {
          //  await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('id');
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

  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <SafeAreaView>
      <View style={[styles.ContainerImage]}>
        <Image
          style={[styles.Image]}
          source={require('../../Assets/user.png')}
        />
        <View
          style={{
            width: wp(70),
            height: wp(30),
            // backgroundColor: COLOR.GREY,
            justifyContent: 'center',
            marginLeft: wp(3),
          }}>
          <Text
            style={{color: COLOR.BLACK, fontSize: wp(6), fontWeight: 'bold'}}>
            Activity Report
          </Text>
          <Text
            style={{
              color: COLOR.BLACK,
              fontSize: wp(4),
            }}>
            Hai, {userInfo.name}
          </Text>
        </View>
        <TouchableOpacity>
          <Icon
            name="sign-out"
            size={wp(8)}
            color={COLOR.SECONDARYPRIMARY}
            style={{right: wp(10)}}
            onPress={() => {
              handleLogout();
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.ContainerContent]}>
        <View>
          <Text
            style={{
              color: COLOR.BLACK,
              fontSize: wp(5),
              fontWeight: 'bold',
              marginLeft: wp(5),
              marginTop: wp(5),
            }}>
            Daftar Nasabah
          </Text>
          <Searchbar
            placeholder="Cari Nasabah ...."
            onChangeText={onChangeSearch}
            value={searchQuery}
            icon={() => (
              <Icon
                name="search"
                size={wp(5)}
                color={COLOR.PRIMARY}
                style={{alignSelf: 'center'}}
              />
            )}
            clearIcon={() => (
              <Icon
                name="times"
                size={wp(5)}
                color={COLOR.PRIMARY}
                style={{alignSelf: 'center'}}
              />
            )}
            rippleColor={COLOR.PRIMARY}
            style={{
              color: COLOR.PRIMARY,
              width: wp(90),
              alignSelf: 'center',
              backgroundColor: COLOR.WHITE,
              borderColor: COLOR.PRIMARY,
              borderWidth: 1,
              height: wp(14),
            }}
          />
        </View>
        <ScrollView>
          <TouchableOpacity
            style={[styles.ListNasabah]}
            onPress={() => navigation.navigate('DetailNasabah')}>
            <Image
              style={[styles.Image]}
              source={require('../../Assets/book.png')}
            />
            <View>
              <Text style={{color: COLOR.BLACK, fontSize: wp(5)}}>
                Ade ryan
              </Text>
              <Text style={{color: COLOR.BLACK}}>Status : Belum Lunas</Text>
              <Text style={{color: COLOR.BLACK}}>Ket : Belum keluar gaji</Text>
            </View>
            <View>
              <Text style={{color: COLOR.BLACK}}>Kunjungan : 2</Text>
            </View>
            <Icon
              name="chevron-right"
              size={wp(8)}
              color={COLOR.SECONDARYPRIMARY}
              style={{alignSelf: 'center', right: wp(5)}}
            />
          </TouchableOpacity>
        </ScrollView>
        <View style={{marginTop: wp(5)}}></View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Image: {
    width: wp(18),
    height: wp(18),
    backgroundColor: COLOR.WHITE,
    alignSelf: 'center',
    marginLeft: wp(5),
  },
  ContainerImage: {
    width: wp(100),
    height: wp(25),
    backgroundColor: COLOR.WHITE,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLOR.PRIMARY,
    flexDirection: 'row',
  },
  ContainerContent: {
    width: wp(100),
    height: wp(180),
    backgroundColor: COLOR.WHITE,
    borderWidth: 1,
    borderColor: COLOR.PRIMARY,
    marginTop: wp(2),
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    paddingBottom: wp(5),
  },
  ListNasabah: {
    backgroundColor: COLOR.WHITE,
    width: wp(90),
    height: wp(25),
    marginTop: wp(3),
    alignSelf: 'center',
    borderRadius: wp(5),
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: COLOR.PRIMARY,
    flexDirection: 'row',
  },
});
