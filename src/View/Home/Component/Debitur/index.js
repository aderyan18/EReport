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
import {COLOR} from '../../../../Styles/color';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Searchbar} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL_API} from '../../../env';
import {CommonActions} from '@react-navigation/native';

export default function Debitur({navigation}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => setSearchQuery(query);
  const [debitur, setDebitur] = useState([]);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  const getDebitur = async () => {
    await AsyncStorage.getItem('token', async (err, token) => {
      if (token) {
        // console.log(token);
        await axios
          .get(`http://brisik.andexcargo.com/api/v1/debitur`, {
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

  useEffect(() => {
    getDebitur();
    console.log('debitur :', debitur);
  }, []);
  return (
    <View>
      {debitur.map((item, index) => {
        return (
          <View key={index}>
            <TouchableOpacity
              style={[styles.ListNasabah]}
              onPress={() => navigation.navigate('DetailNasabah', {item})}>
              <Image
                style={[styles.Image]}
                source={require('../../../../Assets/book.png')}
              />
              <View>
                <Text style={{color: COLOR.BLACK, fontSize: wp(4.5)}}>
                  {item.nama}
                </Text>
                <Text style={{color: COLOR.BLACK}}>Alamat : {item.alamat}</Text>
                <Text style={{color: COLOR.BLACK}}>
                  Rekening : {item.no_rekening}
                </Text>
              </View>

              <Icon
                name="chevron-right"
                size={wp(8)}
                color={COLOR.SECONDARYPRIMARY}
                style={{
                  alignSelf: 'center',
                  right: wp(5),
                  position: 'absolute',
                }}
              />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
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
