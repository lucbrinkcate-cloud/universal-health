import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS } from '../../constants';

const { height } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={require('../../../assets/digital-twin-3d-v4.html')}
        style={styles.webview}
        scrollEnabled={false}
        bounces={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        startInLoadingState={true}
        overScrollMode="never"
        scalesPageToFit={true}
        useWebKit={true}
        mixedContentMode="always"
        setSupportMultipleWindows={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  webview: {
    flex: 1,
    height: height,
    backgroundColor: COLORS.background,
  },
});

export default HomeScreen;
