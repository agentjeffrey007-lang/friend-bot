import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function ColoringScreen({ route }) {
  const { book } = route.params;
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState('#FF6B9D');

  const colors = ['#FF6B9D', '#FFD700', '#00CED1', '#32CD32', '#FF8C00', '#8B00FF'];

  const handleNextPage = () => {
    if (currentPageIdx < book.images.length - 1) {
      setCurrentPageIdx(currentPageIdx + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIdx > 0) {
      setCurrentPageIdx(currentPageIdx - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: book.images[currentPageIdx] }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.colorPaletteContainer}>
        <Text style={styles.paletteLabel}>Colors:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorScroll}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                selectedColor === color && styles.colorSelected,
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentPageIdx === 0 && styles.navButtonDisabled]}
          onPress={handlePrevPage}
          disabled={currentPageIdx === 0}
        >
          <Text style={styles.navButtonText}>← Previous</Text>
        </TouchableOpacity>
        <Text style={styles.pageIndicator}>
          Page {currentPageIdx + 1} of {book.images.length}
        </Text>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentPageIdx === book.images.length - 1 && styles.navButtonDisabled,
          ]}
          onPress={handleNextPage}
          disabled={currentPageIdx === book.images.length - 1}
        >
          <Text style={styles.navButtonText}>Next →</Text>
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
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  colorPaletteContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  paletteLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  colorScroll: {
    marginBottom: 10,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  colorSelected: {
    borderColor: '#333',
    borderWidth: 3,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FF6B9D',
    borderRadius: 8,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  pageIndicator: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
});
