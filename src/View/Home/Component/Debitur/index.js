import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {COLOR} from '../../../../Styles/color';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL_API} from '../../../../../env';

export default function Debitur({navigation, searchQuery}) {
  // const onChangeSearch = query => setSearchQuery(query);
  const [debitur, setDebitur] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const fetchData = async () => {
    if (!isLoading && hasMoreData) {
      setIsLoading(true);
      try {
        const userToken = await AsyncStorage.getItem('token');
        if (userToken) {
          const response = await axios.get(`${BASE_URL_API}/v1/debitur`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
              'Content-Type': 'application/json',
            },
            params: {
              page: currentPage,
            },
          });

          const newData = response.data.data;

          if (newData.length > 0) {
            setDebitur([...debitur, ...newData]);
            setCurrentPage(currentPage + 1);
          } else {
            // Tidak ada data tambahan yang ditemukan
            setHasMoreData(false);
          }
        } else {
          // Tidak ada token
          setHasMoreData(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Memfilter data debitur berdasarkan searchQuery
  const filteredDebitur = debitur.filter(item =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const renderListItem = ({item, index}) => (
    <TouchableOpacity
      style={styles.ListNasabah}
      onPress={() => navigation.navigate('DetailNasabah', {item})}>
      <View style={styles.Image}>
        <Text
          style={{color: COLOR.WHITE, fontSize: wp(4.5), fontWeight: 'bold'}}>
          {index + 1}
        </Text>
      </View>
      <View style={styles.ListContent}>
        <Text style={styles.Nama}>{item.nama}</Text>
        {/* <Text style={styles.BlackText} numberOfLines={1}>
          <Text style={styles.BoldText}>Alamat:</Text> {item.alamat}
        </Text> */}
        <Text style={styles.BlackText}>
          <Text style={styles.BoldText}>Rek :</Text> {item.no_rekening}
        </Text>
      </View>
      <Icon
        name="chevron-right"
        size={wp(7)}
        color={COLOR.PRIMARY}
        style={styles.Icon}
      />
    </TouchableOpacity>
  );
  return (
    <View style={{flex: 1}}>
      {filteredDebitur.length === 0 && !isLoading ? (
        <View style={styles.NoDataContainer}>
          <Image
            source={require('../../../../Assets/debt.png')}
            style={styles.NoDataImage}
          />
          <Text style={styles.NoDataText}>Data Tidak Ditemukan</Text>
        </View>
      ) : (
        <FlatList
          data={filteredDebitur}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderListItem}
          onEndReached={fetchData}
          windowSize={10}
          onEndReachedThreshold={0.5} // Ubah nilai ini sesuai preferensi Anda
          ListFooterComponent={() => (
            <View style={styles.FooterContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color={COLOR.PRIMARY} />
              ) : !hasMoreData ? (
                <Text style={styles.FooterText}>Tidak ada data tambahan</Text>
              ) : null}
            </View>
          )}
        />
      )}
      {/* Tampilkan pesan jika tidak ada data cocok dengan pencarian */}
      {!isLoading && filteredDebitur.length === 0 && (
        <View style={styles.NoDataMessage}>
          <Text style={styles.NoDataMessageText}>
            Tidak ada data yang cocok.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  Image: {
    width: wp(15),
    height: wp(15),
    backgroundColor: COLOR.PRIMARY,
    alignSelf: 'center',
    marginLeft: wp(3),
    borderRadius: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ListNasabah: {
    backgroundColor: COLOR.WHITE,
    width: wp(95),
    height: wp(20),
    marginTop: wp(3),
    alignSelf: 'center',
    borderRadius: wp(5),
    justifyContent: 'flex-start',
    borderWidth: wp(0.2),
    borderColor: COLOR.PRIMARY,
    flexDirection: 'row',
  },
  ListContent: {
    width: wp(65),
    height: wp(22),
    justifyContent: 'center',
    alignSelf: 'center',
    marginLeft: wp(1.5),
  },
  Nama: {
    color: COLOR.BLACK,
    fontSize: wp(4.5),
  },
  BlackText: {
    color: COLOR.BLACK,
  },
  BoldText: {
    fontWeight: 'bold',
  },
  Icon: {
    alignSelf: 'center',
    right: wp(4.5),
    position: 'absolute',
  },
  NoDataContainer: {
    alignItems: 'center',
    marginTop: hp(20),
  },
  NoDataImage: {
    alignSelf: 'center',
    width: wp(40),
    height: wp(40),
  },
  NoDataText: {
    color: COLOR.BLACK,
    fontSize: wp(4.5),
    alignSelf: 'center',
  },
  FooterText: {
    textAlign: 'center',
    marginVertical: 10,
    color: COLOR.BLACK,
  },
  NoDataMessage: {
    alignItems: 'center',
    marginVertical: 20,
  },
  NoDataMessageText: {
    color: 'white',
  },
  FooterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: wp(2),
  },
});
