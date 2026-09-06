import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { ArrowLeft, Phone, User, Zap, Info } from 'lucide-react-native';
import { Button, Card } from '../../componentsui';
import { PhoneInput } from '../../componentsforms';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, IconSize, BorderRadius } from '../../constants/spacing';
import { useAuthStore } from '../../stores/authStore';

// Phone auth is not wired up in this prototype — the demo account is the
// supported way in, so it stays visible in release builds too.
const DEMO_MODE = true;

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const { login } = useAuthStore();

  // Sign in with the demo parent account (no real authentication behind this)
  const handleDevSkip = () => {
    Alert.alert(
      'Demo Account',
      'This signs you in as a demo parent account. No real authentication happens in this prototype. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            // Create a mock user for development
            const mockUser = {
              id: 'dev-user-123',
              phone: '+1234567890',
              name: 'Test User',
              language: 'en' as const,
              role: 'parent' as const,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            login(mockUser, 'dev-token-123');
            router.replace('/(onboarding)/segmentation');
          },
        },
      ]
    );
  };

  const handleSendOTP = async () => {
    // Clean and validate phone number
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    if (cleanedNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setError(undefined);
    setIsLoading(true);

    if (DEMO_MODE) {
      setIsLoading(false);
      Alert.alert(
        'Phone Sign-In Not Available',
        'Phone authentication is not set up in this prototype build. Use "Explore the demo" above to try the app.',
        [{ text: 'OK' }]
      );
      return;
    }

    // TODO: In production, implement proper phone auth with React Native Firebase
    // See: https://rnfirebase.io/auth/phone-auth
    setIsLoading(false);
    setError('Phone authentication is being configured. Please try again later.');
  };

  const handleGoogleSignIn = () => {
    Alert.alert('Coming Soon', 'Google Sign In will be available soon.');
  };

  const handleProviderLogin = () => {
    router.push('/provider/login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={IconSize.md} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Title Section */}
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500 }}
            style={styles.titleSection}
          >
            <View style={styles.iconContainer}>
              <Phone size={IconSize['2xl']} color={Colors.primary[600]} />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in with your phone number to continue
            </Text>
          </MotiView>

          {/* Demo account entry — the supported way in for this prototype */}
          {DEMO_MODE && (
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 500, delay: 100 }}
              style={styles.devProminent}
            >
              <TouchableOpacity
                style={styles.devButtonLarge}
                onPress={handleDevSkip}
                activeOpacity={0.7}
              >
                <View style={styles.devIconContainer}>
                  <Zap size={IconSize.lg} color={Colors.primary[600]} />
                </View>
                <View style={styles.devTextContainer}>
                  <Text style={styles.devTitle}>Explore the demo</Text>
                  <Text style={styles.devDescription}>
                    Try the app as a demo parent account
                  </Text>
                </View>
              </TouchableOpacity>
            </MotiView>
          )}

          {/* Phone Input Section */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 200 }}
            style={styles.inputSection}
          >
            <PhoneInput
              label="Phone Number"
              value={phoneNumber}
              onChange={setPhoneNumber}
              error={error}
              placeholder="(555) 123-4567"
            />

            <Button
              title="Send OTP"
              onPress={handleSendOTP}
              loading={isLoading}
              fullWidth
              style={styles.sendButton}
            />
          </MotiView>

          {/* Divider */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 500, delay: 400 }}
            style={styles.dividerContainer}
          >
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </MotiView>

          {/* Google Sign In */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 500 }}
          >
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              activeOpacity={0.7}
            >
              <View style={styles.googleIcon}>
                <Text style={styles.googleIconText}>G</Text>
              </View>
              <Text style={styles.googleText}>Sign in with Google</Text>
            </TouchableOpacity>
          </MotiView>

          {/* Provider Link */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 500, delay: 600 }}
            style={styles.providerSection}
          >
            <Card
              variant="outlined"
              padding="medium"
              onPress={handleProviderLogin}
              style={styles.providerCard}
            >
              <View style={styles.providerContent}>
                <View style={styles.providerIcon}>
                  <User size={IconSize.md} color={Colors.primary[600]} />
                </View>
                <View style={styles.providerTextContainer}>
                  <Text style={styles.providerTitle}>Are you a provider?</Text>
                  <Text style={styles.providerSubtitle}>
                    Therapists, counselors, and educators
                  </Text>
                </View>
              </View>
            </Card>
          </MotiView>

          {/* Terms */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 500, delay: 700 }}
            style={styles.termsSection}
          >
            <Text style={styles.termsText}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing['2xl'],
  },
  header: {
    paddingVertical: Spacing.base,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h2,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  devProminent: {
    marginBottom: Spacing.xl,
  },
  devButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[50],
    borderWidth: 2,
    borderColor: Colors.primary[300],
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderStyle: 'dashed',
  },
  devIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  devTextContainer: {
    flex: 1,
  },
  devTitle: {
    ...Typography.h5,
    color: Colors.primary[700],
    marginBottom: 2,
  },
  devDescription: {
    ...Typography.bodySmall,
    color: Colors.primary[600],
  },
  inputSection: {
    marginBottom: Spacing.xl,
  },
  sendButton: {
    marginTop: Spacing.sm,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.light,
  },
  dividerText: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    paddingHorizontal: Spacing.base,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: BorderRadius.base,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    backgroundColor: Colors.white,
    gap: Spacing.md,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  googleIconText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4285F4',
  },
  googleText: {
    ...Typography.button,
    color: Colors.text.primary,
  },
  providerSection: {
    marginTop: Spacing['2xl'],
  },
  providerCard: {
    borderColor: Colors.primary[200],
    backgroundColor: Colors.primary[50],
  },
  providerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  providerTextContainer: {
    flex: 1,
  },
  providerTitle: {
    ...Typography.label,
    color: Colors.primary[700],
    marginBottom: 2,
  },
  providerSubtitle: {
    ...Typography.caption,
    color: Colors.primary[600],
  },
  termsSection: {
    marginTop: Spacing['2xl'],
    paddingHorizontal: Spacing.base,
  },
  termsText: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.primary[600],
    fontWeight: '600',
  },
});
