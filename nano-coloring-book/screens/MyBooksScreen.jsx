import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  AsyncStorage,
} from 'react-native';

export default function MyBooksScreen({ navigation }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const saved = await AsyncStorage.getItem('savedBooks');
      if (saved) {
        setBooks(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  const renderBook = ({ item, index }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => navigation.navigate('Coloring', { book: item })}
    >
      <Image source={{ uri: item.images[0] }} style={styles.bookThumbnail} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title || `Book ${index + 1}`}</Text>
        <Text style={styles.bookDescription}>{item.description || item.prompt}</Text>
        <Text style={styles.bookMeta}>{item.images.length} pages</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {books.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No books yet</Text>
          <Text style={styles.emptySubtext}>Create your first coloring book!</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          renderItem={renderBook}
          keyExtractor={(_, idx) => idx.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  listContainer: {
    padding: 15,
  },
  bookCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  bookThumbnail: {
    width: 80,
    height: 100,
  },
  bookInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  bookDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  bookMeta: {
    fontSize: 11,
    color: '#999',
  },
});
