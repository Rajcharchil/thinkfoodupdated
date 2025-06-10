import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, MapPin, CreditCard, CreditCard as Edit } from 'lucide-react-native';
import LocationPicker from '@/components/LocationPicker';
import PaymentMethods from '@/components/PaymentMethods';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export default function OrderSummaryScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData>({
    latitude: 28.6139,
    longitude: 77.2090,
    address: '123 Main Street, New Delhi, Delhi, India',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    postalCode: '110001',
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Cash on Delivery');
  
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();

  const deliveryFee = 49;
  const tax = getTotalPrice() * 0.08;
  const finalTotal = getTotalPrice() + deliveryFee + tax;

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);
  };

  const handlePaymentSuccess = (method: string) => {
    setSelectedPaymentMethod(method);
    handlePlaceOrder(method);
  };

  const handlePaymentError = (error: string) => {
    setError(error);
  };

  const handlePlaceOrder = async (paymentMethod?: string) => {
    if (!user) {
      setError('Please log in to place an order');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: finalTotal,
        deliveryAddress: selectedLocation,
        paymentMethod: paymentMethod || selectedPaymentMethod,
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      clearCart();
      
      Alert.alert(
        'Order Placed Successfully! 🎉',
        `Your order has been placed and will be delivered to ${selectedLocation.address}. You can track it in the Orders tab.`,
        [
          {
            text: 'View Orders',
            onPress: () => router.replace('/(tabs)/orders'),
          },
        ]
      );
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
      </View>
      <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Order Summary</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setShowLocationPicker(true)}
            >
              <Edit size={16} color="#FF6B35" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.addressCard}>
            <MapPin size={20} color="#666" />
            <View style={styles.addressInfo}>
              <Text style={styles.addressText}>{selectedLocation.address}</Text>
              {selectedLocation.city && (
                <Text style={styles.addressSubtext}>
                  {selectedLocation.city}, {selectedLocation.state} {selectedLocation.postalCode}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setShowPaymentMethods(true)}
            >
              <Edit size={16} color="#FF6B35" />
              <Text style={styles.editButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.paymentCard}>
            <CreditCard size={20} color="#666" />
            <Text style={styles.paymentText}>{selectedPaymentMethod}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <View style={styles.orderList}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={renderOrderItem}
              scrollEnabled={false}
            />
          </View>
        </View>

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>₹{getTotalPrice().toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Delivery Fee:</Text>
            <Text style={styles.totalValue}>₹{deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax (8%):</Text>
            <Text style={styles.totalValue}>₹{tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={styles.finalTotalLabel}>Total:</Text>
            <Text style={styles.finalTotalValue}>₹{finalTotal.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.placeOrderButton, loading && styles.buttonDisabled]}
          onPress={() => setShowPaymentMethods(true)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.placeOrderText}>Place Order - ₹{finalTotal.toFixed(2)}</Text>
          )}
        </TouchableOpacity>
      </View>

      <LocationPicker
        visible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onLocationSelect={handleLocationSelect}
      />

      <PaymentMethods
        visible={showPaymentMethods}
        onClose={() => setShowPaymentMethods(false)}
        amount={finalTotal}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editButtonText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 12,
  },
  addressInfo: {
    flex: 1,
  },
  addressText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
    lineHeight: 22,
  },
  addressSubtext: {
    fontSize: 14,
    color: '#666',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 12,
  },
  paymentText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  orderList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
  },
  totalSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  finalTotal: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    marginBottom: 0,
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  finalTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  placeOrderButton: {
    backgroundColor: '#FF6B35',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fdf2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    textAlign: 'center',
  },
});