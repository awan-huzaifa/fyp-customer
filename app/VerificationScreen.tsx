export default function VerificationScreen() {
  // ... other code ...

  const handleVerifyCode = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 4) {
      Alert.alert('Invalid Code', 'Please enter a 4-digit code');
      return;
    }

    setIsLoading(true);

    try {
      const API_URL = 'http://192.168.18.171:3000';
      
      const requestData = { 
        name, 
        phone: phoneNumber, 
        password, 
        location,
        role, 
        code: verificationCode,
        serviceArea,
        vendorCategoryId,
        hasSmartphone: route.params?.hasSmartphone ?? true,
        phoneForCalls: route.params?.phoneForCalls || phoneNumber
      };

      console.log('Sending verification request with data:', requestData);

      const response = await fetch(`${API_URL}/api/users/verify-code-and-create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      // ... rest of the code ...
    } catch (error) {
      // ... error handling ...
    }
  };

  // ... rest of the component ...
} 