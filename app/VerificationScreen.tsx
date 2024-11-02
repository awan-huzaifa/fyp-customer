import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function VerificationScreen() {
  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const navigation = useNavigation();
  const route = useRoute();
  const { name, phoneNumber, password, location } = route.params;
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleVerifyCode = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 4) {
      Alert.alert('Invalid Code', 'Please enter a 4-digit code');
      return;
    }

  

    try {
      // Change the URL to the correct one for verification
      const response = await fetch('https://40d5-2400-adc1-411-de00-00-2.ngrok-free.app/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, verificationCode }),
      });
    
      if (response.ok) {
        Alert.alert('Success', 'Code verified. Proceeding to registration.');
    
        // Send registration details to the backend
        const registrationResponse = await fetch('https://your-backend-url.com/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, phoneNumber, password, location }),
        });
    
        if (registrationResponse.ok) {
          Alert.alert('Success', 'Registration details sent successfully.');
          navigation.navigate('HomeScreen');
        } else {
          Alert.alert('Error', 'Failed to send registration details.');
        }
      } else {
        Alert.alert('Error', 'Invalid verification code');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during verification');
    }
  };

  const handleResendCode = async () => {
    try {
      //change the url to the correct one
      const response = await fetch('https://40d5-2400-adc1-411-de00-00-2.ngrok-free.app/users/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Verification code resent');
        setTimer(60);
      } else {
        Alert.alert('Error', 'Failed to resend verification code');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while resending the verification code');
    }
  };

 
  const handleInputChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Automatically focus the next input
    if (text && index < 3) {
      const nextInput = inputRefs.current[index + 1];
      nextInput?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Verification Code</Text>
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(input) => (inputRefs.current[index] = input)}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleInputChange(text, index)}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyCode}>
        <Text style={styles.verifyButtonText}>Verify Code</Text>
      </TouchableOpacity>
      {timer === 0 ? (
        <TouchableOpacity onPress={handleResendCode}>
          <Text style={styles.resendText}>Resend Code</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.timerText}>Resend code in {timer} seconds</Text>
      )}
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 36,
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  input: {
    width: 50,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
  },
  verifyButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 20,
    borderRadius: 16,
    marginBottom: 16,
    marginTop: 24,
    width: '60%',
    alignSelf: 'center',
  },
  verifyButtonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
  resendText: {
    color: '#1E90FF',
    textAlign: 'center',
  },
  timerText: {
    textAlign: 'center',
  },
  proceedButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 16,
  },
  proceedButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});