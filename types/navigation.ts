import { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  HomeScreen: undefined;
  OrderTabScreen: undefined;
  PaymentScreen: undefined;
  ProfileScreen: undefined;
};

export type RootStackParamList = {
  index: undefined;
  SplashScreen: undefined;
  '(auth)': NavigatorScreenParams<AuthStackParamList>;
  '(services)': NavigatorScreenParams<ServiceStackParamList>;
  '(tabs)': NavigatorScreenParams<TabParamList>;
};

export type AuthStackParamList = {
  WelcomeScreen: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  VerificationScreen: { phone: string };
};

export type ServiceStackParamList = {
  PlumberScreen: undefined;
  ElectricianScreen: undefined;
  ACScreen: undefined;
  MechanicScreen: undefined;
  PainterScreen: undefined;
  CleaningScreen: undefined;
}; 