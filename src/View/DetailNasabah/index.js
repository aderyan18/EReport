import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  ImageBackground,
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
import LinearGradient from 'react-native-linear-gradient';

export default function DetailNasabah({navigation, route}) {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tanggalKunjungan, setTanggalKunjungan] = useState(new Date());
  const [tanggalJanjiBayar, setTanggalJanjiBayar] = useState(new Date());
  const keterangan = ['Sudah Bayar', 'Restruct', 'Janji Bayar'];
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
          // Menggunakan tanggalKunjungan atau tanggalJanjiBayar sesuai dengan keterangan
          if (selectedKeterangan === 'Janji Bayar') {
            data.append(
              'tanggal',
              moment(tanggalJanjiBayar).format('YYYY-MM-DD'),
            );
          } else {
            data.append(
              'tanggal',
              moment(tanggalKunjungan).format('YYYY-MM-DD'),
            );
          }
          data.append('kunjungan', kunjungan);
          data.append('ket', selectedKeterangan);

          if (selectedKeterangan === 'Janji Bayar') {
            data.append(
              'janji_bayar',
              moment(tanggalJanjiBayar).format('YYYY-MM-DD'),
            );
          }
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

  // keterangan janji bayar
  const [selectedKeterangan, setSelectedKeterangan] = useState(''); // Menyimpan keterangan yang dipilih

  // Fungsi yang dipanggil saat keterangan dipilih
  const handleKeteranganSelect = selectedItem => {
    setSelectedKeterangan(selectedItem);
  };

  // date time picker
  // Tambah state untuk mengontrol visibility date picker kunjungan dan janji bayar
  const [datePickerVisibleKunjungan, setDatePickerVisibleKunjungan] =
    useState(false);
  const [datePickerVisibleJanjiBayar, setDatePickerVisibleJanjiBayar] =
    useState(false);

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  // Perbarui fungsi showDatePicker untuk menampilkan date picker yang sesuai
  // Perbarui fungsi showDatePicker untuk menampilkan date picker yang sesuai
  const showDatePicker = type => {
    // Set the selectedDate based on the type
    if (type === 'kunjungan') {
      setSelectedDate(tanggalKunjungan);
      setDatePickerVisibleKunjungan(true); // Tampilkan date picker kunjungan
      setDatePickerVisibleJanjiBayar(false); // Sembunyikan date picker janji bayar
    } else if (type === 'janjiBayar') {
      setSelectedDate(tanggalJanjiBayar);
      setDatePickerVisibleKunjungan(false); // Sembunyikan date picker kunjungan
      setDatePickerVisibleJanjiBayar(true); // Tampilkan date picker janji bayar
    }
  };
  const hideDatePicker = () => {
    setDatePickerVisibleKunjungan(false);
    setDatePickerVisibleJanjiBayar(false);
  };

  const handleConfirm = date => {
    if (selectedKeterangan === 'Janji Bayar') {
      setTanggalJanjiBayar(new Date(date)); // Update tanggal janji bayar
    } else {
      setTanggalKunjungan(new Date(date)); // Update tanggal kunjungan
    }
    hideDatePicker();
  };
  return (
    <View style={{flex: 1, backgroundColor: COLOR.WHITE}}>
      <View style={[styles.Header]}>
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
            Laporan
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
      <ScrollView>
        <LinearGradient
          start={{x: 1.0, y: 1.5}}
          end={{x: 1.5, y: 0.6}}
          locations={[0, 0.5, 0.6]}
          colors={[COLOR.PRIMARY, COLOR.WHITE, COLOR.SECONDARYPRIMARY]}
          style={[styles.LinearGradient]}>
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="credit-card" size={wp(12)} color={COLOR.WHITE} />
              {/*           
              <Image
                source={require('../../Assets/brisik.png')}
                style={{width: wp(10), height: wp(10), borderRadius: wp(1)}}
              /> */}
              <Text
                style={[styles.TextBlack, {marginLeft: wp(2)}]}
                numberOfLines={1}>
                {debitur.nama}
              </Text>
            </View>
            <View
              style={{
                alignItems: 'flex-start',
                width: wp(70),
                height: wp(13),
                marginLeft: wp(2),
              }}>
              <Text style={{fontSize: wp(3.5), color: COLOR.WHITE}}>
                No.Rek :
              </Text>
              <Text style={[styles.TextBlack]}>{debitur.no_rekening}</Text>
            </View>
            <View
              style={{
                alignItems: 'flex-start',
                width: wp(80),
                height: wp(17.5),
                marginLeft: wp(2),
              }}>
              <Text style={{fontSize: wp(3.5), color: COLOR.WHITE}}>
                Alamat :
              </Text>
              <Text style={[styles.TextBlack]} numberOfLines={2}>
                {debitur.alamat}
              </Text>
            </View>
          </View>
        </LinearGradient>
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
          onPress={() => showDatePicker('kunjungan')} // Tampilkan date picker kunjungan
          style={[styles.BtnDate]}>
          <Text
            style={{
              fontSize: wp(5),
              color: '#fff',
            }}>
            {moment(tanggalKunjungan).format('L')}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={datePickerVisibleKunjungan}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        {/* DATE FROM */}

        {/* KETERANGAN START */}
        <Text
          style={{
            fontSize: wp(4),
            color: COLOR.BLACK,
            marginLeft: wp(5),
            marginTop: wp(2),
          }}>
          keterangan :
        </Text>
        <SelectDropdown
          data={keterangan}
          itemTextStyle={{color: COLOR.BLACK}}
          itemTextExtractor={item => item}
          buttonStyle={[styles.BtnKet]}
          rowTextStyle={{color: COLOR.PRIMARY}}
          buttonTextStyle={{color: COLOR.WHITE}}
          defaultButtonText="Pilih Keterangan"
          dropdownStyle={{
            width: wp(90),
            alignSelf: 'center',
            backgroundColor: COLOR.WHITE,
            borderRadius: wp(2),
            justifyContent: 'center',
          }}
          onSelect={selectedItem => handleKeteranganSelect(selectedItem)}
        />
        {/* KETERANGAN END */}

        {/* Janji Bayar true start */}
        {/* Tampilkan tanggal jika "Janji Bayar" dipilih */}
        {selectedKeterangan === 'Janji Bayar' && (
          <View style={{marginTop: wp(2)}}>
            <Text
              style={{fontSize: wp(4), color: COLOR.BLACK, marginLeft: wp(5)}}>
              Tanggal Janji Bayar :
            </Text>
            <TouchableOpacity
              onPress={() => showDatePicker('janjiBayar')}
              style={[styles.BtnDate, {marginTop: wp(2)}]}>
              <Text style={{fontSize: wp(5), color: '#fff'}}>
                {moment(tanggalJanjiBayar).format('L')}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={datePickerVisibleJanjiBayar}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
        )}
        {/* Janji Bayar true end*/}
        <TouchableOpacity
          onPress={() => takePicture()}
          style={[styles.BtnPicture]}>
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
        <View style={[styles.ImageCon]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  Header: {
    backgroundColor: COLOR.PRIMARY,
    width: wp(100),
    height: wp(26),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    borderBottomLeftRadius: wp(5),
    borderBottomRightRadius: wp(5),
  },
  LinearGradient: {
    backgroundColor: COLOR.WHITE,
    width: wp(90),
    height: wp(45),
    alignSelf: 'center',
    marginTop: wp(3),
    // justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: wp(3),
    paddingTop: wp(2),
    borderRadius: wp(2),
  },
  TextBlack: {
    color: COLOR.GREY,
    fontSize: wp(4),
    marginTop: wp(1),
    fontWeight: 'bold',
  },
  BtnDate: {
    backgroundColor: COLOR.PRIMARY,
    height: wp(14),
    borderRadius: wp(2),
    justifyContent: 'center',
    width: wp(90),
    alignSelf: 'center',
    paddingLeft: wp(5),
  },
  BtnKet: {
    width: wp(90),
    alignSelf: 'center',
    backgroundColor: COLOR.PRIMARY,
    borderRadius: wp(2),
    marginTop: wp(2),
  },
  BtnPicture: {
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
  },
  ImageCon: {
    width: wp(90),
    height: wp(70),
    backgroundColor: COLOR.WHITE,
    borderColor: COLOR.PRIMARY,
    borderWidth: wp(0.2),
    marginTop: wp(9),
    alignSelf: 'center',
    borderRadius: wp(2),
  },
});
