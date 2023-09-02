import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
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
import {Button} from 'react-native-paper';
import moment from 'moment/moment';

export default function DetailNasabah({navigation}) {
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState(new Date());
  const keterangan = ['Belum bayar', 'Lunas'];

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
  const bbbb = async response => {
    if (image.length === 0) {
      Alert.alert('Silahkan ambil gambar!');
    } else {
      await AsyncStorage.getItem('token', async (err, token) => {
        if (token) {
          setLoading(true);
          const data = new FormData();
          data.append('name', 'avatar');
          data.append('avatar', {
            uri: response.uri,
            type: response.type,
            name: response.fileName,
          });
          const config = {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
              Authorization: 'Bearer ' + token,
            },
            body: data,
          };
          fetch(`${API_BASE_URL}/Admin/images/avatar`, config)
            .then(res => {
              // console.log('RES PROFILE', res);
              setLoading(false);
              Alert.alert('Berhasil Mengubah Avatar');
              navigation.navigate('MainScreen');
            })
            .catch(err => {
              setLoading(false);
              // console.log(err);
              Alert.alert('Gagal Mengubah Avatar, Silahkan Coba Lagi');
            });
        } else setLoading(false);
      });
    }
  };

  // const {profilePicture} = route?.params;
  const [image, setImage] = useState('');

  // const selectPicture = () => {
  //   setTimeout(() => {
  //     launchImageLibrary(
  //       {
  //         mediaType: 'photo',
  //         includeBase64: true,
  //         maxHeight: 720,
  //         maxWidth: 720,
  //       },
  //       async res => {
  //         // console.log('RES URI', res.uri);
  //         if (res.didCancel) {
  //           console.log('User cancelled image picker');
  //         } else if (res.error) {
  //           console.log('ImagePicker Error: ', res.error);
  //         } else if (res.customButton) {
  //           console.log('User tapped custom button: ', res.customButton);
  //           // alert(res.customButton);
  //         } else {
  //           setImage(res.assets[0]);
  //         }
  //       },
  //     );
  //   }, 500);
  // };

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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="arrow-left"
              size={wp(10)}
              color={COLOR.WHITE}
              style={{alignSelf: 'flex-start'}}
            />
          </TouchableOpacity>
          <View
            style={{
              width: wp(70),
              height: wp(20),
              // backgroundColor: COLOR.GREY,
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: wp(5), color: COLOR.WHITE}}>
              Create a new report
            </Text>
            <Text style={{color: COLOR.WHITE}}>
              {' '}
              {moment(dateFrom).format('L')}
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
              Nama Nasabah : Ade Ryan
            </Text>
            <Text
              style={{
                color: COLOR.BLACK,
                fontSize: wp(4),
                marginLeft: wp(5),
                marginTop: wp(2),
              }}>
              Alamat : Jl. Raya Bogor
            </Text>

            <Text
              style={{
                color: COLOR.BLACK,
                fontSize: wp(4),
                marginLeft: wp(5),
                marginTop: wp(2),
              }}>
              No. Rekening : 123456789
            </Text>
          </View>
        </View>
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
            height: wp(60),
            backgroundColor: COLOR.WHITE,
            borderColor: COLOR.SECONDARYPRIMARY,
            borderWidth: wp(0.2),
            marginTop: wp(9),
            alignSelf: 'center',
            borderRadius: wp(2),
          }}>
          {/* {loading ? (
          <View
            style={{
              height: wp(30),
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size={'large'} color={'#FFF'} />
          </View>
        ) : (
          <Image
            source={{
              uri: !image && profilePicture ? profilePicture : image.uri,
            }}
            style={{
              height: wp(30),
              aspectRatio: 1,
              alignSelf: 'center',
              resizeMode: 'contain',
            }}
          />
        )} */}
        </View>
        <SelectDropdown
          defaultButtonText="Pilih Keterangan Nasabah ..."
          renderDropdownIcon={() => (
            <Image
              style={{height: wp(4), width: wp(4)}}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/32/32195.png',
              }}
            />
          )}
          buttonStyle={{
            height: wp(14),
            borderWidth: wp(0.2),
            borderRadius: wp(2),
            paddingHorizontal: wp(2),
            fontSize: wp(5),
            marginTop: wp(4),
            borderColor: COLOR.PRIMARY,
            backgroundColor: '#fff',
            width: wp(90),
            alignSelf: 'center',
          }}
          data={keterangan}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item;
          }}
        />
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
            // onPress={() => handleSubmit()}
            style={{backgroundColor: COLOR.PRIMARY, width: wp(40)}}>
            Konfirmasi
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
