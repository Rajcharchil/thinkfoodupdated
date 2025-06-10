import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CreditCard, Smartphone, Banknote, X, Check } from 'lucide-react-native';

interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
  description: string;
  color: string;
}

interface PaymentMethodsProps {
  visible: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess: (method: string) => void;
  onPaymentError: (error: string) => void;
}

export default function PaymentMethods({
  visible,
  onClose,
  amount,
  onPaymentSuccess,
  onPaymentError,
}: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: Smartphone,
      description: 'Pay using Google Pay, PhonePe, Paytm, or any UPI app',
      color: '#FF6B35',
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay cards accepted',
      color: '#4A90E2',
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: Banknote,
      description: 'Pay when your order arrives',
      color: '#34A853',
    },
  ];

  const handlePayment = async (methodId: string) => {
    setLoading(true);
    setSelectedMethod(methodId);

    try {
      switch (methodId) {
        case 'upi':
          await handleUpiPayment();
          break;
        case 'card':
          await handleCardPayment();
          break;
        case 'cod':
          await handleCodPayment();
          break;
        default:
          throw new Error('Invalid payment method');
      }
    } catch (error: any) {
      onPaymentError(error.message || 'Payment failed');
    } finally {
      setLoading(false);
      setSelectedMethod(null);
    }
  };

  const handleUpiPayment = async () => {
    // Simulate UPI payment process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, you would integrate with UPI payment gateway
    const success = Math.random() > 0.2; // 80% success rate for demo
    
    if (success) {
      onPaymentSuccess('UPI');
      onClose();
    } else {
      throw new Error('UPI payment failed. Please try again.');
    }
  };

  const handleCardPayment = async () => {
    // Simulate card payment process
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // In a real app, you would integrate with payment gateway like Razorpay, Stripe
    const success = Math.random() > 0.15; // 85% success rate for demo
    
    if (success) {
      onPaymentSuccess('Card');
      onClose();
    } else {
      throw new Error('Card payment failed. Please check your card details.');
    }
  };

  const handleCodPayment = async () => {
    // COD is always successful
    await new Promise(resolve => setTimeout(resolve, 1000));
    onPaymentSuccess('Cash on Delivery');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Payment Methods</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount to Pay</Text>
            <Text style={styles.amountValue}>₹{amount.toFixed(2)}</Text>
          </View>

          <View style={styles.methodsContainer}>
            <Text style={styles.sectionTitle}>Select Payment Method</Text>
            
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              const isSelected = selectedMethod === method.id;
              const isLoading = loading && isSelected;
              
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodCard,
                    isSelected && styles.methodCardSelected,
                  ]}
                  onPress={() => handlePayment(method.id)}
                  disabled={loading}
                >
                  <View style={styles.methodContent}>
                    <View style={[styles.iconContainer, { backgroundColor: method.color }]}>
                      <IconComponent size={24} color="#fff" />
                    </View>
                    
                    <View style={styles.methodInfo}>
                      <Text style={styles.methodName}>{method.name}</Text>
                      <Text style={styles.methodDescription}>{method.description}</Text>
                    </View>
                    
                    <View style={styles.methodAction}>
                      {isLoading ? (
                        <ActivityIndicator size="small\" color={method.color} />
                      ) : isSelected ? (
                        <View style={[styles.checkIcon, { backgroundColor: method.color }]}>
                          <Check size={16} color="#fff" />
                        </View>
                      ) : (
                        <View style={styles.radioButton} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.securityInfo}>
            <Text style={styles.securityTitle}>🔒 Secure Payment</Text>
            <Text style={styles.securityText}>
              Your payment information is encrypted and secure. We don't store your card details.
            </Text>
          </View>

          <View style={styles.supportInfo}>
            <Text style={styles.supportTitle}>Need Help?</Text>
            <Text style={styles.supportText}>
              Contact our support team if you face any issues with payment.
            </Text>
            <TouchableOpacity style={styles.supportButton}>
              <Text style={styles.supportButtonText}>Contact Support</Text>
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
  amountContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  amountLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  methodsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  methodCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  methodCardSelected: {
    borderColor: '#FF6B35',
    borderWidth: 2,
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  methodAction: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  securityInfo: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    color: '#2e7d32',
    lineHeight: 20,
  },
  supportInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  supportButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  supportButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});