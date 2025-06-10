import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { CreditCard, FileText, CircleHelp as HelpCircle, Info, LogOut, MapPin, Moon, Settings, Sun, User } from 'lucide-react-native';
import React from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const { user, userProfile, logout } = useAuth();
  const { isDark, toggleTheme, colors } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/signup');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const menuItems = [
    {
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      icon: User,
      onPress: () => {},
    },
    {
      title: 'Delivery Addresses',
      subtitle: 'Manage your saved addresses',
      icon: MapPin,
      onPress: () => {},
    },
    {
      title: 'Payment Methods',
      subtitle: 'Manage your payment options',
      icon: CreditCard,
      onPress: () => {},
    },
    {
      title: 'App Settings',
      subtitle: 'Notifications, language, and more',
      icon: Settings,
      onPress: () => {},
    },
    {
      title: 'Help Center',
      subtitle: 'Get help and support',
      icon: HelpCircle,
      onPress: () => {},
    },
    {
      title: 'Terms & Conditions',
      subtitle: 'Read our terms and privacy policy',
      icon: FileText,
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        </View>

        <View style={[styles.profileSection, { backgroundColor: colors.card }]}>
          <View style={styles.avatarContainer}>
            {userProfile?.picture ? (
              <Image
                source={{ uri: userProfile.picture }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarText}>
                  {user?.displayName?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.name, { color: colors.text }]}>
            {user?.displayName || 'User'}
          </Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>
            {user?.email || 'No email available'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
          
          {menuItems.slice(0, 3).map((item, index) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity 
                key={index} 
                style={[styles.menuItem, { backgroundColor: colors.card }]} 
                onPress={item.onPress}
              >
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.menuItemIcon, { backgroundColor: colors.gray[100] }]}>
                      <IconComponent size={20} color={colors.primary} />
                    </View>
                    <View style={styles.menuItemText}>
                      <Text style={[styles.menuItemTitle, { color: colors.text }]}>{item.title}</Text>
                      <Text style={[styles.menuItemSubtitle, { color: colors.gray[600] }]}>{item.subtitle}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
          
          {menuItems.slice(3).map((item, index) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity 
                key={index} 
                style={[styles.menuItem, { backgroundColor: colors.card }]} 
                onPress={item.onPress}
              >
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.menuItemIcon, { backgroundColor: colors.gray[100] }]}>
                      <IconComponent size={20} color={colors.primary} />
                    </View>
                    <View style={styles.menuItemText}>
                      <Text style={[styles.menuItemTitle, { color: colors.text }]}>{item.title}</Text>
                      <Text style={[styles.menuItemSubtitle, { color: colors.gray[600] }]}>{item.subtitle}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={toggleTheme}
        >
          <View style={styles.menuItemLeft}>
            {isDark ? (
              <Sun size={24} color={colors.text} />
            ) : (
              <Moon size={24} color={colors.text} />
            )}
            <Text style={[styles.menuItemText, { color: colors.text }]}>
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
          <View style={styles.menuItemLeft}>
            <Info size={24} color={colors.text} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>
              Version 1.0
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.card }]} 
          onPress={handleLogout}
        >
          <LogOut size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileSection: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});