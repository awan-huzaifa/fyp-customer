const handleSendVerificationCode = async () => {
  // ... validation checks ...

  try {
    const response = await ApiService.post('/users/send-verification-code', { 
      phone: phoneNumber 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send verification code');
    }

    // After successful verification code storage, navigate to verification screen
    router.push({
      pathname: '/VerificationScreen',
      params: { 
        name, 
        phoneNumber, 
        password, 
        location,
        role: 'vendor',
        serviceArea,
        vendorCategoryId: parseInt(vendorCategory),
        hasSmartphone,
        phoneForCalls: hasSmartphone ? phoneNumber : phoneForCalls
      }
    });

  } catch (error) {
    Alert.alert('Error', 'An error occurred while sending the verification code. Please try again.');
    console.error('Error details:', error);
  }
}; 