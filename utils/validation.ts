export const validateAddress = (address: {
  label: string;
  address: string;
  details?: string;
  location: { latitude: number; longitude: number } | null;
}) => {
  const errors: { [key: string]: string } = {};

  if (!address.label) {
    errors.label = 'Label is required';
  }

  if (!address.address || address.address.trim().length < 5) {
    errors.address = 'Address must be at least 5 characters long';
  }

  if (!address.location) {
    errors.location = 'Location coordinates are required';
  }

  if (address.details && address.details.length > 100) {
    errors.details = 'Details must not exceed 100 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 