import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CameraViews = () => {
  return (
    <View style={styles.container}>
      <View style={styles.tab}>
        <Text>Front Camera</Text>
      </View>
      <View style={[styles.tab, styles.offlineTab]}>
        <Text>Back Camera</Text>
        <Text style={styles.offlineText}>Currently Offline</Text>
      </View>
      <View style={[styles.tab, styles.offlineTab]}>
        <Text>Side 1</Text>
        <Text style={styles.offlineText}>Currently Offline</Text>
      </View>
      <View style={[styles.tab, styles.offlineTab]}>
        <Text>Side 2</Text>
        <Text style={styles.offlineText}>Currently Offline</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tab: {
    padding: 20,
    margin: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    borderRadius: 5,
  },
  offlineTab: {
    backgroundColor: '#a9a9a9',
  },
  offlineText: {
    color: 'red',
    fontSize: 12,
  },
});

export default CameraViews;
