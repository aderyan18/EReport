import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLOR} from '../../Styles/color';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/EvilIcons';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function DetailNasabah({navigation}) {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLOR.WHITE}}>
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
          <Text style={{color: COLOR.WHITE}}>22 - 08 - 2023</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
