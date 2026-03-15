import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  PinchGestureHandler,
  Animated,
} from 'react-native';

export default function PreviewScreen({ route, navigation }) {
  const { images, prompt } = route.params;
  const [scale] = useState(new Animated.Value(1));
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  const onPinch = (event) => {
    const newScale = Math.max(1, Math.min(3, event.nativeEvent.scale));
    Animated.timing(scale, {
      toValue: newScale,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  // Handle both old image format (array of URLs) and new format (with variants)
  const currentImage = images[selectedImageIdx];
  const displayImage = typeof currentImage === 'string' ? currentImage : currentImage?.base || currentImage;
  const isColorVariantEnabled = currentImage?.variants ? true : false;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainImageContainer}>
        <Animated.Image
          source={{ uri: displayImage }}
          style={[
            styles.mainImage,
            { transform: [{ scale }] },
          ]}
          resizeMode="contain"
        />
        {isColorVariantEnabled && (
          <Text style={styles.variantBadge}>
            ✓ {currentImage.paletteNames?.length || 6} color variants ready
          </Text>
        )}
      </ScrollView>

      <ScrollView
        horizontal
        style={styles.thumbnailContainer}
        showsHorizontalScrollIndicator={false}
      >
        {images.map((img, idx) => {
          const thumbnailSrc = typeof img === 'string' ? img : img?.base || img;
          return (
            <TouchableOpacity
              key={idx}
              onPress={() => setSelectedImageIdx(idx)}
              style={[
                styles.thumbnail,
                selectedImageIdx === idx && styles.thumbnailActive,
              ]}
            >
              <Image source={{ uri: thumbnailSrc }} style={styles.thumbnailImage} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('Checkout', { images, prompt })}
        >
          <Text style={styles.buttonText}>💳 Proceed to Checkout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  mainImage: {
    width: '90%',
    height: 400,
  },
  thumbnailContainer: {
    height: 100,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  thumbnail: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  thumbnailActive: {
    borderColor: '#FF6B9D',
    borderWidth: 3,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#FF6B9D',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  variantBadge: {
    marginTop: 10,
    fontSize: 12,
    color: '#27AE60',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 15,
  },
});
