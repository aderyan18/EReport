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

export default function DaftarNasabah({navigation}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => setSearchQuery(query);
  const [userInfo, setUserInfo] = useState({});
  let [isLoading, setIsLoading] = useState(true);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [debitur, setDebitur] = useState([]);

  let [tambah, setTambah] = useState(false);

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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    getUserInfo();
    getDebitur();
  }, [refreshing]);
  return isLoading ? (
    <ActivityIndicator
      size="large"
      color={COLOR.PRIMARY}
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
    />
  ) : (
    <SafeAreaView style={{backgroundColor: COLOR.PRIMARY}}>
      <View style={[styles.ContainerImage]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            right: wp(22),
          }}>
          <Icon name="chevron-left" size={wp(5)} color={COLOR.WHITE} />
        </TouchableOpacity>

        <Text
          style={{
            color: COLOR.WHITE,
            fontSize: wp(5.5),
            // fontWeight: 'bold',
            // fontStyle: 'italic',
          }}>
          Daftar Nasabah
        </Text>
      </View>
      <View style={[styles.ContainerContent]}>
        <View style={{marginTop: wp(3)}}>
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
              width: wp(95),
              alignSelf: 'center',
              backgroundColor: COLOR.WHITE,
              borderColor: COLOR.PRIMARY,
              borderWidth: wp(0.2),
              height: wp(14),
            }}
          />
        </View>

        <Debitur navigation={navigation} searchQuery={searchQuery} />
        {/* </ScrollView> */}
        <View style={{marginTop: wp(5)}}></View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ContainerImage: {
    width: wp(100),
    height: wp(15),
    backgroundColor: COLOR.PRIMARY,
    alignItems: 'center',
    borderColor: COLOR.PRIMARY,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ContainerContent: {
    width: wp(100),
    height: wp(185),
    backgroundColor: COLOR.WHITE,
    borderWidth: 1,
    borderColor: COLOR.PRIMARY,
    marginTop: wp(2),
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    // paddingBottom: wp(5),
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

// kurang lancar, diragukan, macet
