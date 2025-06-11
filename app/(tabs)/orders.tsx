import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  BellRing,
  Clock,
  Phone,
  RefreshCcw,
  Share,
  Truck,
  UtensilsCrossed
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Demo order data
const demoOrder = {
  restaurantName: "Indiana Burgers",
  restaurantLocation: "Peelamedu, Coimbatore",
  orderId: "ORD123456",
  status: "Preparing",
  deliveryTimeEstimate: "36 mins",
  deliveryStatus: "On time",
  items: [
    {
      id: 1,
      name: "Butter Chicken",
      quantity: 2,
      price: 650.00,
      image: "https://example.com/butter-chicken.jpg"
    },
    {
      id: 2,
      name: "Naan Bread",
      quantity: 4,
      price: 80.00,
      image: "https://example.com/naan.jpg"
    },
    {
      id: 3,
      name: "Mango Lassi",
      quantity: 2,
      price: 150.00,
      image: "https://example.com/lassi.jpg"
    }
  ],
  deliveryAddress: "123 Food Street, Cuisine City",
  totalAmount: 2030.00,
  orderTime: "2:30 PM",
  estimatedDelivery: "3:00 PM",
  cutleryPreference: true,
};

const demoPastOrders = [
  {
    orderId: "ORD987654",
    restaurantName: "Pizza Palace",
    totalAmount: 1200.50,
    status: "Delivered",
    orderTime: "Yesterday",
    items: [
      { name: "Pepperoni Pizza", quantity: 1, price: 800.00 },
      { name: "Coca-Cola", quantity: 2, price: 50.00 },
    ]
  },
  {
    orderId: "ORD789012",
    restaurantName: "Sushi Hub",
    totalAmount: 1800.00,
    status: "Delivered",
    orderTime: "2 days ago",
    items: [
      { name: "Salmon Sushi (6pcs)", quantity: 1, price: 1000.00 },
      { name: "Miso Soup", quantity: 1, price: 200.00 },
      { name: "Green Tea", quantity: 1, price: 100.00 },
    ]
  },
];

export default function OrdersScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [couponTimeLeft, setCouponTimeLeft] = useState(4 * 60 + 57); // 4 minutes 57 seconds

  // Basic timer for coupons (for demo purposes)
  useEffect(() => {
    const timer = setInterval(() => {
      setCouponTimeLeft((prevTime: number) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  const handleBack = () => {
    // Implement navigation back or to home
    Alert.alert("Navigation", "Go back or to home");
  };

  const handleShare = () => {
    Alert.alert("Share", "Share order details");
  };

  const handleRefresh = () => {
    Alert.alert("Refresh", "Refresh order status");
  };

  const handleClaimCoupon = () => {
    Alert.alert("Coupon Claimed", "You have claimed the coupon!");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        colors={['#4CAF50', '#66BB6A']}
        style={styles.headerGradient}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.restaurantNameHeader}>{demoOrder.restaurantName}</Text>
          <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
            <Share size={20} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.orderTitle}>Preparing your order</Text>
        <View style={styles.deliveryStatusContainer}>
          <Text style={styles.deliveryTime}>{demoOrder.deliveryTimeEstimate}</Text>
          <Clock size={16} color="white" style={{ marginLeft: 8 }} />
          <Text style={styles.deliveryOnTime}>{demoOrder.deliveryStatus}</Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <RefreshCcw size={16} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Coupons Section */}
      <View style={[styles.couponsContainer, { backgroundColor: colors.card, ...styles.cardShadow }]}>
        <BellRing size={20} color={colors.primary} />
        <Text style={[styles.couponText, { color: colors.textSecondary }]}>
          Woo-hoo! We found 3 hidden coupons. Grab them before time runs out
        </Text>
        <View style={styles.couponTimer}>
          <Text style={{ color: colors.text }}>{formatTime(couponTimeLeft)}</Text>
        </View>
        <TouchableOpacity style={styles.claimCouponButton} onPress={handleClaimCoupon}>
          <Text style={styles.claimCouponButtonText}>Tap to claim</Text>
        </TouchableOpacity>
      </View>

      {/* Map Section */}
      <View style={[styles.mapContainer, styles.cardShadow]}>
        <Image 
          source={require('../../assets/images/mapimage.jpg')} 
          style={styles.mapImage} 
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.trackOrderButton}>
          <Truck size={16} color="white" />
          <Text style={styles.trackOrderButtonText}>Track order</Text>
        </TouchableOpacity>
      </View>

      {/* Restaurant Info */}
      <View style={[styles.restaurantInfoCard, { backgroundColor: colors.card, ...styles.cardShadow }]}>
        <Image source={{ uri: "https://via.placeholder.com/40" }} style={styles.restaurantLogo} />
        <View style={styles.restaurantTextContainer}>
          <Text style={[styles.restaurantTitle, { color: colors.text }]}>{demoOrder.restaurantName}</Text>
          <Text style={[styles.restaurantLocation, { color: colors.textSecondary }]}>{demoOrder.restaurantLocation}</Text>
          <View style={[styles.orderProgressBar, { backgroundColor: colors.border }]}>
            <View style={[styles.orderProgress, { backgroundColor: colors.primary }]} />
          </View>
          <Text style={[styles.orderStatusText, { color: colors.primary }]}>Your order is being prepared</Text>
        </View>
        <TouchableOpacity onPress={() => Alert.alert("Call", "Calling restaurant...")}>
          <Phone size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Cutlery Preference */}
      {demoOrder.cutleryPreference && (
        <View style={[styles.section, { backgroundColor: colors.card, ...styles.cardShadow }]}>
          <View style={styles.infoRow}>
            <UtensilsCrossed size={20} color={colors.textSecondary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              We've asked the restaurant to not send cutlery
            </Text>
          </View>
        </View>
      )}

      {/* Order Details Section */}
      <View style={[styles.section, { backgroundColor: colors.card, ...styles.cardShadow }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Order details</Text>
        {demoOrder.items.map((item) => (
          <View key={item.id} style={styles.orderItem}>
            <Text style={[styles.itemQuantity, { color: colors.text }]}>{item.quantity}x</Text>
            <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.itemPrice, { color: colors.textSecondary }]}>{formatPrice(item.price)}</Text>
          </View>
        ))}
        <View style={[styles.totalContainer, { borderTopColor: colors.border }]}>
          <Text style={[styles.totalText, { color: colors.text }]}>Total Paid</Text>
          <Text style={[styles.totalAmount, { color: colors.text }]}>
            {formatPrice(demoOrder.totalAmount)}
          </Text>
        </View>
      </View>

      {/* Past Orders Section */}
      <View style={[styles.section, { backgroundColor: colors.card, ...styles.cardShadow }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Past Orders</Text>
        {demoPastOrders.map((order) => (
          <TouchableOpacity key={order.orderId} style={[styles.pastOrderItem, {borderBottomColor: colors.border}]}>
            <View style={styles.pastOrderHeader}>
              <Text style={[styles.pastOrderRestaurant, { color: colors.text }]}>{order.restaurantName}</Text>
              <Text style={[styles.pastOrderStatus, { color: colors.primary }]}>{order.status}</Text>
            </View>
            <Text style={[styles.pastOrderTime, { color: colors.textSecondary }]}>{order.orderTime}</Text>
            <View style={styles.pastOrderDetails}>
              {order.items.map((item, idx) => (
                <Text key={idx} style={[styles.pastOrderItemText, { color: colors.textSecondary }]}>
                  {item.quantity}x {item.name}
                </Text>
              ))}
            </View>
            <Text style={[styles.pastOrderTotal, { color: colors.text }]}>Total: {formatPrice(order.totalAmount)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dummy space for scrolling */}
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    padding: 16,
    paddingTop: 48, // Adjust for status bar
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconButton: {
    padding: 8,
  },
  restaurantNameHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  orderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  deliveryStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  deliveryTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  deliveryOnTime: {
    fontSize: 16,
    color: 'white',
    marginLeft: 4,
  },
  refreshButton: {
    marginLeft: 12,
    padding: 4,
  },
  couponsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  couponText: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
    fontSize: 14,
  },
  couponTimer: {
    backgroundColor: '#E0FFE0', // Light green background for timer
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  claimCouponButton: {
    backgroundColor: '#FF0000', // Red color for demo
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 10,
  },
  claimCouponButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mapContainer: {
    height: 200,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  trackOrderButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  trackOrderButtonText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
  },
  restaurantInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  restaurantLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  restaurantTextContainer: {
    flex: 1,
  },
  restaurantTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  restaurantLocation: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  orderProgressBar: {
    height: 4,
    borderRadius: 2,
    width: '100%',
    marginBottom: 4,
  },
  orderProgress: {
    height: '100%',
    width: '50%', // Demo progress
    borderRadius: 2,
  },
  orderStatusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  itemQuantity: {
    fontSize: 15,
    fontWeight: '600',
    marginRight: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 15,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pastOrderItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  pastOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  pastOrderRestaurant: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pastOrderStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  pastOrderTime: {
    fontSize: 12,
    color: '#777',
    marginBottom: 8,
  },
  pastOrderDetails: {
    marginBottom: 4,
  },
  pastOrderItemText: {
    fontSize: 14,
  },
  pastOrderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 8,
  },

  // Reusable shadow style for card-like components
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});