
import React from 'react';
import { Button, Linking, View } from 'react-native';

export default function App() {
  const openURL = () => {
    const url = 'https://tangiblink.io/specific-view';
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <View>
      {/* ...existing code... */}
      <Button title="Open Specific View" onPress={openURL} />
      {/* ...existing code... */}
    </View>
  );
}