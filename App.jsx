import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';

export default function App() {
  // 郵便番号を保存しておくstate
  const [postalCode, setPostalCode] = useState('');

  // 送信ボタンを押した時に実行される関数
  function handlePress() {
    // 一旦、入力した番号をAlertで表示する内容としています。
    Alert.alert('入力された内容', postalCode);
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
  }
});
