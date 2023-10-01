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

  // const fetchData = async () => {
  //   if (isLoading) {
  //     return;
  //   }
  //   setIsLoading(true);

  //   try {
  //     const userToken = await AsyncStorage.getItem('token');

  //     if (userToken) {
  //       const response = await axios.get(`${BASE_URL_API}/v1/debitur`, {
  //         headers: {
  //           Authorization: `Bearer ${userToken}`,
  //           'Content-Type': 'application/json',
  //         },
  //         params: {
  //           page: currentPage,
  //         },
  //       });

  //       const newData = response.data.data;

  //       if (newData.length > 0) {
  //         setDebitur(prevData => [...prevData, ...newData]);
  //         setCurrentPage(currentPage + 1);
  //       } else {
  //         setHasMoreData(false);
  //       }
  //     } else {
  //       setHasMoreData(false);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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

  const handleLoadMore = () => {
    fetchData();
  };

  // Memfilter data debitur berdasarkan searchQuery
  const filteredDebitur = debitur.filter(item =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const renderListItem = ({item}) => (
    <TouchableOpacity
      style={styles.ListNasabah}
      onPress={() => navigation.navigate('DetailNasabah', {item})}>
      <Image
        style={styles.Image}
        source={require('../../../../Assets/book.png')}
      />
      <View style={styles.ListContent}>
        <Text style={styles.Nama}>{item.nama}</Text>
        <Text style={styles.BlackText} numberOfLines={1}>
          <Text style={styles.BoldText}>Alamat:</Text> {item.alamat}
        </Text>
        <Text style={styles.BlackText}>
          <Text style={styles.BoldText}>Rekening :</Text> {item.no_rekening}
        </Text>
      </View>
      <Icon
        name="chevron-right"
        size={wp(7)}
        color={COLOR.SECONDARYPRIMARY}
        style={styles.Icon}
      />
    </TouchableOpacity>
  );
  return (
    <View style={{flex: 1}}>
      {filteredDebitur.length === 0 && !isLoading ? (
        <View style={styles.NoDataContainer}>
          <Image
            source={require('../../../../Assets/search.png')}
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
    width: wp(13),
    height: wp(13),
    backgroundColor: COLOR.WHITE,
    alignSelf: 'center',
    marginLeft: wp(3),
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
    height: wp(24),
    marginTop: wp(4.5),
    alignSelf: 'center',
    borderRadius: wp(5),
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: COLOR.PRIMARY,
    flexDirection: 'row',
  },
  ListContent: {
    width: wp(65),
    height: wp(22),
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  Nama: {
    color: COLOR.SECONDARYPRIMARY,
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
    right: wp(1),
    position: 'absolute',
  },
  NoDataContainer: {
    alignItems: 'center',
    marginTop: hp(20),
  },
  NoDataImage: {
    alignSelf: 'center',
    width: wp(30),
    height: wp(30),
  },
  NoDataText: {
    color: COLOR.BLACK,
    fontSize: wp(4.5),
    alignSelf: 'center',
    marginTop: hp(2),
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
