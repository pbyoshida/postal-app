import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

// 郵便番号検索APIのURL
const zipcloudURL = 'https://zipcloud.ibsnet.co.jp/api/search';

export default function App() {
  // 郵便番号を保存しておくstate
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');

  // axiosのGETメソッドを使った住所検索
  const fetchAddress = async () => {
    try {
      const response = await axios.get(`${zipcloudURL}?zipcode=${postalCode}`);
      const data = response.data;
      if ( !data.results ) {
        return '該当する住所はありませんでした。'
      }
      switch (data.status) {
        case 200:
          // 今回はテストなので、同じ郵便番号で2件以上存在する場合は除きます
          return `${data.results[0].address1}${data.results[0].address2}${data.results[0].address3}`;
        case 400:
          return data.message;
        case 500:
          return data.message;
      }
    } catch (error) {
       return '検索失敗';
    }
  }

  // 送信ボタンを押した時に実行される関数
  async function handlePress() {
    // 7桁の数字を正規表現で置きます
    const pattern = /^[0-9]{7}$/;
    if (pattern.test(postalCode)){
      const address = await fetchAddress();
      setAddress(address);
    } else {
      // 想定していない文字列の場合
      Alert.alert('正しい郵便番号ではありません', 'もう一度入力してください');
    }
  }

  // アプリに描画する内容
  return (
    <View style={styles.container}>
      <Text style={styles.description}>郵便番号を入力してください{"\n"}(ハイフンなし7桁)</Text>
      <TextInput
        value={postalCode}
        style={styles.inputPostalCode}
        onChangeText={(text) =>{
          setPostalCode(text);
        }}
        maxLength={7}
        keyboardType={"numeric"}
        placeholder={"郵便番号"}
      />
      <Button
        title="送信"
        color="#AAAAAA"
        onPress={handlePress}
      />
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
});
