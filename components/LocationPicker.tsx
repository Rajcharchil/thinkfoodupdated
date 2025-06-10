import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native';
import * as Location from 'expo-location';
import { MapPin, Navigation, Search, X } from 'lucide-react-native';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void;
  visible: boolean;
  onClose: () => void;
}

export default function LocationPicker({ onLocationSelect, visible, onClose }: LocationPickerProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<LocationData[]>([
    {
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'Connaught Place, New Delhi, Delhi, India',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      postalCode: '110001',
    },
    {
      latitude: 19.0760,
      longitude: 72.8777,
      address: 'Marine Drive, Mumbai, Maharashtra, India',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400020',
    },
  ]);

  useEffect(() => {
    if (visible) {
      getCurrentLocation();
    }
  }, [visible]);

  const getCurrentLocation = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(location);

      // Get address from coordinates
      const [addressResult] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addressResult) {
        const formattedAddress = formatAddress(addressResult);
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setErrorMsg('Failed to get current location');
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (addressResult: Location.LocationGeocodedAddress) => {
    const parts = [
      addressResult.street,
      addressResult.city,
      addressResult.region,
      addressResult.country,
    ].filter(Boolean);
    return parts.join(', ');
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const results = await Location.geocodeAsync(searchQuery);
      if (results.length > 0) {
        const result = results[0];
        const [addressResult] = await Location.reverseGeocodeAsync({
          latitude: result.latitude,
          longitude: result.longitude,
        });

        if (addressResult) {
          const locationData: LocationData = {
            latitude: result.latitude,
            longitude: result.longitude,
            address: formatAddress(addressResult),
            city: addressResult.city || undefined,
            state: addressResult.region || undefined,
            country: addressResult.country || undefined,
            postalCode: addressResult.postalCode || undefined,
          };
          
          onLocationSelect(locationData);
          onClose();
        }
      } else {
        Alert.alert('Location not found', 'Please try a different search term');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      Alert.alert('Error', 'Failed to search location');
    } finally {
      setLoading(false);
    }
  };

  const selectCurrentLocation = () => {
    if (location && address) {
      const locationData: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: address,
      };
      onLocationSelect(locationData);
      onClose();
    }
  };

  const selectSavedAddress = (savedAddress: LocationData) => {
    onLocationSelect(savedAddress);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Location</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Search Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Location</Text>
            <View style={styles.searchContainer}>
              <Search size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for area, street name..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#999"
                onSubmitEditing={searchLocation}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={searchLocation}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small\" color="#FF6B35" />
                ) : (
                  <Text style={styles.searchButtonText}>Search</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Current Location Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Location</Text>
            {errorMsg ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMsg}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={getCurrentLocation}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.locationCard}
                onPress={selectCurrentLocation}
                disabled={!location || loading}
              >
                <View style={styles.locationCardContent}>
                  <Navigation size={24} color="#FF6B35" />
                  <View style={styles.locationInfo}>
                    {loading ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#FF6B35" />
                        <Text style={styles.loadingText}>Getting location...</Text>
                      </View>
                    ) : (
                      <>
                        <Text style={styles.locationTitle}>Use Current Location</Text>
                        <Text style={styles.locationAddress} numberOfLines={2}>
                          {address || 'Tap to get current location'}
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Saved Addresses Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Saved Addresses</Text>
            {savedAddresses.map((savedAddress, index) => (
              <TouchableOpacity
                key={index}
                style={styles.locationCard}
                onPress={() => selectSavedAddress(savedAddress)}
              >
                <View style={styles.locationCardContent}>
                  <MapPin size={24} color="#666" />
                  <View style={styles.locationInfo}>
                    <Text style={styles.locationTitle}>
                      {savedAddress.city || 'Saved Location'}
                    </Text>
                    <Text style={styles.locationAddress} numberOfLines={2}>
                      {savedAddress.address}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Manual Entry Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Enter Manually</Text>
            <TouchableOpacity
              style={styles.manualEntryButton}
              onPress={() => {
                // You can implement a manual address entry form here
                Alert.alert('Manual Entry', 'Manual address entry feature coming soon!');
              }}
            >
              <MapPin size={20} color="#FF6B35" />
              <Text style={styles.manualEntryText}>Enter address manually</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    marginLeft: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  locationCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fdf2f2',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginBottom: 8,
  },
  retryButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  manualEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 12,
  },
  manualEntryText: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '500',
  },
});