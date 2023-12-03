import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {COLOR} from '../../../Styles/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL_API} from '../../../../env';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function RekNpl() {
  const [npl, setNpl] = useState({});
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [statistic, setStatistic] = useState({});
  let [isLoading, setIsLoading] = useState(true);
  const [persen, setPersen] = useState({
    persen_kurang_lancar: 0,
    persen_diragukan: 0,
    persen_macet: 0,
  });

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
  const getNpl = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await axios.get(
          `${BASE_URL_API}/v1/debitur/count-all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        console.log('NPL:', response.data.data);
        setNpl(response.data?.data.npl);
        setIsUserLoaded(true);
        setIsLoading(false);
      } else {
        console.log('Token tidak ditemukan.');
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
      if (error.response) {
        console.error('Status Code:', error.response.status);
        console.error('Data:', error.response.data);
      }
    }
  };

  const getUserRekap = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await axios.get(
          `${BASE_URL_API}/v1/debt-collector/rekap`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        console.log('Persen:', response.data);
        setPersen(response.data);
        setIsUserLoaded(true);
        setIsLoading(false);
      } else {
        console.log('Token tidak ditemukan.');
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
      if (error.response) {
        console.error('Status Code:', error.response.status);
        console.error('Data:', error.response.data);
      }
    }
  };

  function formatToRupiah(angka) {
    if (angka !== undefined && angka !== null) {
      const numberString = angka.toString(); // Pastikan angka tidak undefined
      const split = numberString.split('.');
      const sisa = split[0].length % 3;
      let rupiah = split[0].substr(0, sisa);
      const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

      if (ribuan) {
        const separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
      }

      rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
      return 'Rp. ' + rupiah;
    } else {
      return 'Rp. 0'; // Nilai default jika angka tidak valid
    }
  }
  const getUserStatistic = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await axios.get(
          `${BASE_URL_API}/v1/riwayat/statistic`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        console.log('Statistic :', response.data.data);
        setStatistic(response.data?.data);
        setIsUserLoaded(true);
        setIsLoading(false);
      } else {
        console.log('Token tidak ditemukan.');
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
      if (error.response) {
        console.error('Status Code:', error.response.status);
        console.error('Data:', error.response.data);
      }
    }
  };
  useEffect(() => {
    getNpl();
    getUserStatistic();
    getUserRekap();
  }, [refreshing]);
  return (
    <View>
      <View
        style={{
          width: wp(95),
          // backgroundColor: COLOR.PRIMARY,
        }}>
        {rekNPL(
          'hand-o-up',
          'Kurang Lancar',
          formatToRupiah(statistic.npl_kurang_lancar),
          npl['Kurang Lancar'],
        )}
        <View
          style={{
            width: wp(90),
            height: wp(10),
            // backgroundColor: COLOR.WHITE,
            alignSelf: 'center',
          }}>
          <View style={[styles.Persen]}>
            <View
              style={{
                width: `${parseInt(persen.persen_kurang_lancar)}%`,
                height: wp(4.9),
                backgroundColor: COLOR.PRIMARY,
                borderRadius: wp(5),
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: COLOR.BLACK,
                  fontWeight: 'bold',
                  left: wp(2),
                  fontSize: wp(3.5),
                }}>
                {parseInt(persen.persen_kurang_lancar)}%
              </Text>
            </View>
          </View>
        </View>
        {rekNPL(
          'minus',
          'Diragukan',
          formatToRupiah(statistic.npl_diragukan),
          npl['Diragukan'],
        )}
        <View
          style={{
            width: wp(90),
            height: wp(10),
            // backgroundColor: COLOR.WHITE,
            alignSelf: 'center',
          }}>
          <View style={[styles.Persen]}>
            <View
              style={{
                width: `${parseInt(persen.persen_diragukan)}%`,
                height: wp(4.9),
                backgroundColor: COLOR.PRIMARY,
                borderRadius: wp(5),
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: COLOR.BLACK,
                  fontWeight: 'bold',
                  left: wp(2),
                  fontSize: wp(3.5),
                  position: 'absolute',
                }}>
                {persen.persen_diragukan &&
                parseInt(persen.persen_diragukan) !== 0
                  ? `${parseInt(persen.persen_diragukan)}%`
                  : '0%'}
              </Text>
            </View>
          </View>
        </View>
        {rekNPL(
          'bitbucket',
          'Macet',
          formatToRupiah(statistic.npl_macet),
          npl['Macet'],
        )}
        <View
          style={{
            width: wp(90),
            height: wp(10),
            // backgroundColor: COLOR.WHITE,
            alignSelf: 'center',
          }}>
          <View style={[styles.Persen]}>
            <View
              style={{
                width: `${parseInt(persen.persen_macet)}%`,
                height: wp(4.9),
                backgroundColor: COLOR.PRIMARY,
                borderRadius: wp(5),
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: COLOR.BLACK,
                  fontWeight: 'bold',
                  left: wp(2),
                  fontSize: wp(3.5),
                  position: 'absolute',
                }}>
                {persen.persen_macet && parseInt(persen.persen_macet) !== 0
                  ? `${parseInt(persen.persen_macet)}%`
                  : '0%'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View>
        <View
          style={{
            width: wp(95),
            height: wp(10),
            backgroundColor: COLOR.WHITE,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: COLOR.PRIMARY,
            borderRadius: wp(5),
            marginTop: wp(1),
            paddingLeft: wp(3),
          }}>
          <Text
            style={{
              color: COLOR.BLACK,
              fontSize: wp(3.5),
              marginLeft: wp(1.5),
              fontWeight: 'bold',
            }}>
            Total : {formatToRupiah(statistic.npl_total)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  DPKcontent: {
    width: wp(95),
    height: wp(17.5),
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
    alignSelf: 'center',
    paddingRight: wp(3),
  },
  Persen: {
    width: wp(95),
    height: wp(5),
    backgroundColor: COLOR.WHITE,
    borderRadius: wp(5),
    marginVertical: wp(2),
    alignSelf: 'center',
    borderWidth: wp(0.2),
    borderColor: COLOR.PRIMARY,
  },
});
