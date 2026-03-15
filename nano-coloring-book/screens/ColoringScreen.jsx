/**
 * Coloring Screen MVP — Interactive Palette Selection
 * 
 * For MVP: Images are pre-generated with color variants during book creation.
 * User can switch between palettes instantly (no regeneration).
 * 
 * Phase 2: Add Skia canvas for actual drawing on top of images
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');

export default function ColoringScreen({ route, navigation }) {
  const { book, pageIndex: initialPageIndex = 0 } = route.params;
  const [currentPageIndex, setCurrentPageIndex] = useState(initialPageIndex);
  const [currentPaletteIndex, setCurrentPaletteIndex] = useState(0);
  const [saveLoading, setSaveLoading] = useState(false);
  const [drawing, setDrawing] = useState(null);

  // Color palettes for display
  const COLOR_PALETTES = [
    {
      name: 'Default',
      displayName: '🎨 Default',
      colors: ['#FF6B9D', '#FFD700', '#00CED1', '#32CD32', '#FF8C00', '#8B00FF'],
    },
    {
      name: 'Pastel',
      displayName: '🌸 Pastel',
      colors: ['#FFB3BA', '#FFCCCB', '#FFFFBA', '#BAE1FF', '#BAC2FF', '#E0BBE4'],
    },
    {
      name: 'Vibrant',
      displayName: '⚡ Vibrant',
      colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#FF1493'],
    },
    {
      name: 'Ocean',
      displayName: '🌊 Ocean',
      colors: ['#001F3F', '#0074D9', '#007EFF', '#B6E3FF', '#004E89', '#4DA6D6'],
    },
    {
      name: 'Sunset',
      displayName: '🌅 Sunset',
      colors: ['#FF6B35', '#F7931E', '#FDB833', '#F37335', '#FF4500', '#EE964B'],
    },
    {
      name: 'Forest',
      displayName: '🌲 Forest',
      colors: ['#134E5E', '#1B998B', '#2ECC71', '#27AE60', '#117A65', '#52B788'],
    },
  ];

  const currentPage = book.pages[currentPageIndex];
  const currentImage = currentPage?.colorVariants?.[currentPaletteIndex] || currentPage?.baseImage;

  useEffect(() => {
    loadPageState();
  }, [currentPageIndex]);

  const loadPageState = async () => {
    try {
      const key = `coloring_${book.id}_page_${currentPageIndex}`;
      const state = await AsyncStorage.getItem(key);
      if (state) {
        setDrawing(JSON.parse(state));
      }
    } catch (error) {
      console.error('Error loading page state:', error);
    }
  };

  const savePageState = async () => {
    try {
      setSaveLoading(true);
      const key = `coloring_${book.id}_page_${currentPageIndex}`;
      const state = {
        pageIndex: currentPageIndex,
        paletteIndex: currentPaletteIndex,
        drawing: drawing,
        timestamp: new Date().toISOString(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(state));
      
      // Also mark book as edited
      const bookData = JSON.parse(await AsyncStorage.getItem(`book_${book.id}`));
      if (bookData) {
        bookData.lastEdited = new Date().toISOString();
        bookData.coloredPages = Math.max(bookData.coloredPages || 0, currentPageIndex + 1);
        await AsyncStorage.setItem(`book_${book.id}`, JSON.stringify(bookData));
      }
      
      setSaveLoading(false);
    } catch (error) {
      console.error('Error saving page:', error);
      setSaveLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < book.pages.length - 1) {
      savePageState();
      setCurrentPageIndex(currentPageIndex + 1);
      setCurrentPaletteIndex(0); // Reset palette on new page
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      savePageState();
      setCurrentPageIndex(currentPageIndex - 1);
      setCurrentPaletteIndex(0);
    }
  };

  const handleSwitchPalette = (paletteIdx) => {
    setCurrentPaletteIndex(paletteIdx);
    // INSTANT: No regeneration needed because variants were pre-generated during book creation
  };

  const handleFinishColoring = async () => {
    await savePageState();
    Alert.alert(
      'Coloring Session Saved',
      'Your progress has been saved. You can continue coloring anytime!',
      [
        {
          text: 'Continue',
          onPress: () => {}, // Stay on screen
        },
        {
          text: 'Back to Books',
          onPress: () => navigation.goBack(),
        },
        {
          text: 'Go to Checkout',
          onPress: () => {
            navigation.navigate('Checkout', { book });
          },
        },
      ]
    );
  };

  const handleClear = () => {
    Alert.alert('Clear Drawing?', 'This will erase your work on this page.', [
      { text: 'Cancel' },
      {
        text: 'Clear',
        onPress: () => setDrawing(null),
        style: 'destructive',
      },
    ]);
  };

  const palette = COLOR_PALETTES[currentPaletteIndex];

  return (
    <View style={styles.container}>
      {/* Image Display */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: currentImage }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Palette Selection Section */}
      <View style={styles.paletteSection}>
        <Text style={styles.sectionTitle}>Choose a color palette:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.palettesScroll}>
          {COLOR_PALETTES.map((p, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.paletteCard,
                currentPaletteIndex === idx && styles.paletteCardActive,
              ]}
              onPress={() => handleSwitchPalette(idx)}
              activeOpacity={0.7}
            >
              <View style={styles.paletteColorGrid}>
                {p.colors.map((color, cidx) => (
                  <View
                    key={cidx}
                    style={[
                      styles.paletteColorDot,
                      { backgroundColor: color },
                    ]}
                  />
                ))}
              </View>
              <Text style={[
                styles.paletteName,
                currentPaletteIndex === idx && styles.paletteNameActive,
              ]}>
                {p.displayName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Colors Available for Selected Palette */}
      <View style={styles.colorsSection}>
        <Text style={styles.sectionTitle}>Colors to use:</Text>
        <View style={styles.colorsGrid}>
          {palette.colors.map((color, idx) => (
            <View key={idx} style={[styles.colorSwatch, { backgroundColor: color }]} />
          ))}
        </View>
        <Text style={styles.colorNote}>💡 Tap any color in the palette above to select it</Text>
      </View>

      {/* Page Navigation */}
      <View style={styles.navigationSection}>
        <TouchableOpacity
          style={[styles.navButton, currentPageIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrevPage}
          disabled={currentPageIndex === 0}
        >
          <Text style={styles.navButtonText}>← Prev</Text>
        </TouchableOpacity>

        <View style={styles.pageInfo}>
          <Text style={styles.pageIndicator}>
            Page {currentPageIndex + 1} of {book.pages.length}
          </Text>
          <Text style={styles.paletteIndicator}>
            Palette: {palette.name}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentPageIndex === book.pages.length - 1 && styles.navButtonDisabled,
          ]}
          onPress={handleNextPage}
          disabled={currentPageIndex === book.pages.length - 1}
        >
          <Text style={styles.navButtonText}>Next →</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[styles.actionButton, styles.clearButton]}
          onPress={handleClear}
        >
          <Text style={styles.clearButtonText}>🧹 Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={handleFinishColoring}
          disabled={saveLoading}
        >
          {saveLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>✅ Save Progress</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Note */}
      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          ℹ️ All color palettes are pre-loaded for instant switching. Your drawing progress is auto-saved.
        </Text>
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
    height: screenWidth * 0.6,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  image: {
    width: screenWidth - 20,
    height: '100%',
  },

  paletteSection: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  palettesScroll: {
    marginBottom: 5,
  },
  paletteCard: {
    marginRight: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    alignItems: 'center',
  },
  paletteCardActive: {
    borderColor: '#FF6B9D',
    backgroundColor: '#FFF5F8',
  },
  paletteColorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 70,
    gap: 3,
    marginBottom: 6,
  },
  paletteColorDot: {
    width: 13,
    height: 13,
    borderRadius: 2,
  },
  paletteName: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666',
  },
  paletteNameActive: {
    color: '#FF6B9D',
    fontWeight: '700',
  },

  colorsSection: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  colorSwatch: {
    width: (screenWidth - 50) / 4,
    height: (screenWidth - 50) / 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  colorNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  navigationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FF6B9D',
    borderRadius: 6,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  pageInfo: {
    alignItems: 'center',
  },
  pageIndicator: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  paletteIndicator: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },

  actionSection: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  clearButtonText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#FF6B9D',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  noteBox: {
    marginHorizontal: 15,
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#F0F7FF',
    borderLeftWidth: 3,
    borderLeftColor: '#0074D9',
    borderRadius: 4,
  },
  noteText: {
    fontSize: 11,
    color: '#333',
    fontStyle: 'italic',
  },
});
