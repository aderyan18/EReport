import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {COLOR} from '../../../Styles/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL_API} from '../../../../env';

export default function RekDpk() {
  const [dpk, setDpk] = useState([]);
  const [persen, setPersen] = useState({
    persen_dpk_1: 0,
    persen_dpk_2: 0,
    persen_dpk_3: 0,
  });
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [statistic, setStatistic] = useState({});
  let [isLoading, setIsLoading] = useState(true);
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
  const getDpk = async () => {
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
        console.log('DPK:', response.data.data);
        setDpk(response.data?.data.dpk);
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
  function rekdpk(angka, orang, jumlah) {
    return (
      <View style={[styles.DPKcontent]}>
        <View style={[styles.Circle]}>
          <Text style={{color: COLOR.WHITE, fontSize: wp(6)}}>{angka}</Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            // backgroundColor: COLOR.RED,
            width: wp(27),
            height: wp(13),
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: COLOR.BLACK,
              fontSize: wp(4.5),
              marginLeft: wp(3),
            }}
            numberOfLines={1}>
            {orang} Orang
          </Text>
        </View>
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
  useEffect(() => {
    getDpk();
    getUserStatistic();
    getUserRekap();
    console.log('persen1 :', persen.persen_dpk_1);
  }, [refreshing]);
  return (
    <View>
      {rekdpk(1, dpk[1], formatToRupiah(statistic.dpk_1))}
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
              width: `${parseInt(persen.persen_dpk_1)}%`,
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
              {persen.persen_dpk_1 && parseInt(persen.persen_dpk_1) !== 0
                ? `${parseInt(persen.persen_dpk_1)}%`
                : '0%'}
            </Text>
          </View>
        </View>
      </View>
      {rekdpk(2, dpk[2], formatToRupiah(statistic.dpk_2))}
      <View style={[styles.Persen]}>
        <View
          style={{
            width: `${parseInt(persen.persen_dpk_2)}%`,
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
            {persen.persen_dpk_2 && parseInt(persen.persen_dpk_2) !== 0
              ? `${parseInt(persen.persen_dpk_2)}%`
              : '0%'}
          </Text>
        </View>
      </View>
      {rekdpk(3, dpk[3], formatToRupiah(statistic.dpk_3))}
      <View style={[styles.Persen]}>
        <View
          style={{
            width: `${parseInt(persen.persen_dpk_3)}%`,
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
            {persen.persen_dpk_3 && parseInt(persen.persen_dpk_3) !== 0
              ? `${parseInt(persen.persen_dpk_3)}%`
              : '0%'}
          </Text>
        </View>
      </View>
      <View>
        <View style={[styles.DPKcontent, {height: wp(10), paddingLeft: wp(3)}]}>
          <Text
            style={{
              color: COLOR.BLACK,
              fontSize: wp(3.5),
              marginLeft: wp(1.5),
              fontWeight: 'bold',
            }}>
            Total : {formatToRupiah(statistic.dpk_total)}
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
