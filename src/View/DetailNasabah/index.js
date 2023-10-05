import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {COLOR} from '../../Styles/color';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/EvilIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {ScrollView} from 'react-native-gesture-handler';
import SelectDropdown from 'react-native-select-dropdown';
import {ActivityIndicator, Button, TextInput} from 'react-native-paper';
import moment from 'moment/moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import {BASE_URL_API} from '../../../env';

export default function DetailNasabah({navigation, route}) {
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState(new Date());
  const keterangan = ['Belum bayar', 'Lunas'];
  const debitur = route?.params?.item;
  const [kunjungan, setKunjungan] = useState('');

  const options = {
    title: 'Select Image',
    customButtons: [
      {
        name: 'customOptionKey',
        title: 'Choose file from Custom Option',
      },
    ],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  const handleSubmit = async response => {
    if (image.length === 0) {
      Alert.alert('Silahkan ambil gambar!');
    } else {
      await AsyncStorage.getItem('token', async (err, token) => {
        if (token) {
          setLoading(true);
          const data = new FormData();
          data.append('debitur_id', debitur.id);
          data.append('tanggal', moment(dateFrom).format('YYYY-MM-DD'));
          data.append('kunjungan', '1');
          data.append('gambar', {
            uri: response.uri,
            type: response.type,
            name: response.fileName,
          });
          console.log(data);
          const config = {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
              Authorization: 'Bearer ' + token,
            },
            body: data,
          };
          fetch(`${BASE_URL_API}/v1/aktivitas`, config)
            .then(res => {
              console.log('RES AKTIVITAS', res);
              Alert.alert('Berhasil Menambah Aktifitas');
              navigation.navigate('Home');
            })
            .catch(err => {
              console.log(err);
              Alert.alert('Gagal Menambah Aktifitas, Silahkan Coba Lagi');
            })
            .finally(() => {
              setLoading(false);
            });
        } else setLoading(false);
      });
    }
  };

  const [image, setImage] = useState('');

  const selectPicture = () => {
    setTimeout(() => {
      launchImageLibrary(
        {
          mediaType: 'photo',
          includeBase64: true,
          maxHeight: 720,
          maxWidth: 720,
        },
        async res => {
          // console.log('RES URI', res.uri);
          if (res.didCancel) {
            console.log('User cancelled image picker');
          } else if (res.error) {
            console.log('ImagePicker Error: ', res.error);
          } else if (res.customButton) {
            console.log('User tapped custom button: ', res.customButton);
            // alert(res.customButton);
          } else {
            setImage(res.assets[0]);
          }
        },
      );
    }, 500);
  };

  const takePicture = () => {
    launchCamera(
      {mediaType: 'photo', includeBase64: true, maxHeight: 720, maxWidth: 720},
      async res => {
        if (res.didCancel) {
          console.log('User cancelled image picker');
        } else if (res.error) {
          console.log('ImagePicker Error: ', res.error);
        } else if (res.customButton) {
          console.log('User tapped custom button: ', res.customButton);
          // alert(res.customButton);
        } else {
          setImage(res.assets[0]);
        }
      },
    );
  };

  // date time picker
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = date => {
    console.warn('A date has been picked: ', date);
    setDateFrom(new Date(date));
    hideDatePicker();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLOR.WHITE}}>
      <ScrollView>
        <View
          style={{
            backgroundColor: COLOR.BLUE,
            width: wp(100),
            height: wp(20),
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: wp(70),
              height: wp(20),
              // backgroundColor: COLOR.GREY,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{fontSize: wp(5), color: COLOR.WHITE, fontWeight: 'bold'}}>
              Laporan Aktivitas
            </Text>
            <Text
              style={{
                color: COLOR.WHITE,
                fontStyle: 'italic',
                fontSize: wp(4),
              }}>
              Kunjungan ke - {debitur.kunjungan}
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: COLOR.WHITE,
            width: wp(90),
            height: wp(30),
            alignSelf: 'center',
            marginTop: wp(5),
            borderRadius: wp(5),
            borderWidth: 1,
            borderColor: COLOR.PRIMARY,
            justifyContent: 'center',
          }}>
          <View>
            <Text
              style={{
                color: COLOR.BLACK,
                fontSize: wp(4),
                marginLeft: wp(5),
              }}>
              <Text style={{fontWeight: 'bold'}}>Nama Nasabah :</Text>{' '}
              {debitur.nama}
            </Text>
            <Text
              style={{
                color: COLOR.BLACK,
                fontSize: wp(4),
                marginLeft: wp(5),
                marginTop: wp(1),
              }}>
              <Text style={{fontWeight: 'bold'}}>Alamat :</Text>{' '}
              {debitur.alamat}
            </Text>

            <Text
              style={{
                color: COLOR.BLACK,
                fontSize: wp(4),
                marginLeft: wp(5),
                marginTop: wp(1),
              }}>
              <Text style={{fontWeight: 'bold'}}>No. Rekening :</Text>{' '}
              {debitur.no_rekening}
            </Text>
          </View>
        </View>
        {/* <View style={{marginTop: wp(5)}}>
          <Text
            style={{
              color: COLOR.BLACK,
              fontSize: wp(4),
              marginLeft: wp(5),
            }}>
            Kunjungan ke :
          </Text>
          <TextInput
            value={setKunjungan}
            mode="flat"
            theme={{colors: {primary: COLOR.BLUE}}}
            keyboardType="number-pad"
            style={{
              height: wp(10),
              width: wp(90),
              borderRadius: wp(2),
              fontSize: wp(5),
              borderColor: COLOR.PRIMARY,
              backgroundColor: COLOR.WHITE,
              alignSelf: 'center',
            }}
          />
        </View> */}
        {/* DATE FROM */}
        <Text
          style={{
            fontSize: wp(4),
            marginBottom: wp(2),
            color: COLOR.BLACK,
            marginLeft: wp(5),
            marginTop: wp(5),
          }}>
          Tanggal Kunjungan :
        </Text>
        <TouchableOpacity
          onPress={() => showDatePicker()}
          style={{
            backgroundColor: COLOR.SECONDARYPRIMARY,
            height: wp(14),
            borderRadius: wp(2),
            justifyContent: 'center',
            width: wp(90),
            alignSelf: 'center',
            paddingLeft: wp(5),
          }}>
          <Text
            style={{
              fontSize: wp(5),
              color: '#fff',
            }}>
            {moment(dateFrom).format('L')}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={datePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        {/* DATE FROM */}
        <TouchableOpacity
          onPress={() => takePicture()}
          style={{
            height: wp(14),
            backgroundColor: '#fff',
            elevation: 5,
            top: wp(7),
            paddingHorizontal: wp(5),
            borderRadius: wp(2),
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: wp(90),
            alignSelf: 'center',
          }}>
          <Text style={{fontSize: wp(5), color: COLOR.BLACK}}>
            Ambil Gambar
          </Text>
          <Image
            source={{
              uri: 'https://cdn1.iconfinder.com/data/icons/ios-11-glyphs/30/camera-256.png',
            }}
            style={{height: wp(7), width: wp(7)}}
          />
        </TouchableOpacity>

        <View
          style={{
            width: wp(90),
            height: wp(70),
            backgroundColor: COLOR.WHITE,
            borderColor: COLOR.SECONDARYPRIMARY,
            borderWidth: wp(0.2),
            marginTop: wp(9),
            alignSelf: 'center',
            borderRadius: wp(2),
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              width: wp(80),
              height: wp(55),
              position: 'absolute',
              // backgroundColor: COLOR.BLACK,
            }}>
            <Icon
              name="exclamation"
              size={wp(20)}
              color={COLOR.RED}
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                top: wp(5),
              }}
            />
          </View>
          {loading ? (
            <View
              style={{
                height: wp(80),
                width: wp(55),
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size={'large'} color={COLOR.PRIMARY} />
            </View>
          ) : (
            <Image
              source={{
                uri: !image ? image.uri : image.uri,
              }}
              style={{
                width: wp(80),
                height: wp(60),
                aspectRatio: 1,
                alignSelf: 'center',
                resizeMode: 'contain',
                top: wp(5),
              }}
            />
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: hp(3),
          }}>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={{backgroundColor: COLOR.RED, width: wp(40)}}>
            Batal
          </Button>
          <Button
            mode="contained"
            onPress={() => handleSubmit(image)}
            style={{backgroundColor: COLOR.PRIMARY, width: wp(40)}}>
            Konfirmasi
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
