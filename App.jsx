import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

import { weatherAPIKey } from './env';

// 郵便番号検索APIのURL
const zipcloudURL = 'https://zipcloud.ibsnet.co.jp/api/search';

// OpenWeatherAPIのURL
const weatherURL = 'http://api.openweathermap.org/data/2.5/weather';

export default function App() {
  // 各種値を保存しておくstate
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [weather, setWeather] = useState('');

  // axiosのGETメソッドを使った住所検索
  const fetchAddress = async () => {
    try {
      const response = await axios.get(`${zipcloudURL}?zipcode=${postalCode}`);
      const { data } = response;
      if (!data.results) {
        return '該当する住所はありませんでした。';
      }
      switch (data.status) {
        case 200:
          // 今回はテストなので、同じ郵便番号で2件以上存在する場合は除きます
          return `${data.results[0].address1}${data.results[0].address2}${data.results[0].address3}`;
        case 400:
          return data.message;
        case 500:
          return data.message;
        default:
          return '予期しない動作です';
      }
    } catch (error) {
      return '検索失敗';
    }
  };

  // axiosのGETメソッドを使った天気情報取得
  const fetchWeather = async () => {
    try {
      const postalCode1 = postalCode.substr(0, 3);
      const postalCode2 = postalCode.substr(3, 4);
      const response = await axios.get(
        `${weatherURL}?zip=${postalCode1}-${postalCode2},JP&lang=ja&appid=${weatherAPIKey}`
      );
      const { data } = response;
      return data.weather[0].description;
    } catch (error) {
      return '天気情報の取得に失敗しました。';
    }
  };

  // 送信ボタンを押した時に実行される関数
  async function handlePress() {
    // 7桁の数字を正規表現で置きます
    const pattern = /^[0-9]{7}$/;
    if (pattern.test(postalCode)) {
      const searchedAddress = await fetchAddress();
      setAddress(searchedAddress);
      const currentWeather = await fetchWeather();
      setWeather(currentWeather);
    } else {
      // 想定していない文字列の場合
      Alert.alert('正しい郵便番号ではありません', 'もう一度入力してください');
    }
  }

  // アプリに描画する内容
  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        郵便番号を入力してください
        {'\n'}
        (ハイフンなし7桁)
      </Text>
      <TextInput
        value={postalCode}
        style={styles.inputPostalCode}
        onChangeText={(text) => {
          setPostalCode(text);
        }}
        maxLength={7}
        keyboardType="numeric"
        placeholder="郵便番号"
      />
      <Button title="送信" color="#AAAAAA" onPress={handlePress} />
      {address.length > 0 && (
        <View style={styles.addressContainer}>
          <View style={styles.addressLabel}>
            <Text style={styles.addressLabelText}>住所</Text>
          </View>
          <View style={styles.address}>
            <Text style={styles.addressText}>{address}</Text>
          </View>
        </View>
      )}
      {weather.length > 0 && (
        <View style={styles.weatherContainer}>
          <View style={styles.weatherLabel}>
            <Text style={styles.weatherLabelText}>現在の天気</Text>
          </View>
          <View style={styles.weather}>
            <Text style={styles.weatherText}>{weather}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

// 各要素のスタイル
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: 18,
    color: '#666666',
    paddingBottom: 10,
  },
  inputPostalCode: {
    textAlignVertical: 'center',
    width: 120,
    fontSize: 24,
    marginBottom: 10,
    paddingLeft: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  addressContainer: {
    paddingVertical: 10,
    width: 280,
  },
  addressLabel: {
    paddingBottom: 10,
  },
  addressLabelText: {
    fontSize: 18,
    color: '#666666',
  },
  address: {
    paddingLeft: 5,
  },
  addressText: {
    fontSize: 16,
    color: '#000000',
  },
  weatherContainer: {
    paddingVertical: 10,
    width: 280,
  },
  weatherLabel: {
    paddingBottom: 10,
  },
  weatherLabelText: {
    fontSize: 18,
    color: '#666666',
  },
  weather: {
    paddingLeft: 5,
  },
  weatherText: {
    fontSize: 16,
    color: '#000000',
  },
});
