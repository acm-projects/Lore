import { TouchableOpacityProps, TextInputProps } from 'react-native';

export declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?:
      'primaryAccent'
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'outline'
    | 'success'
    | 'danger-outline'
    | 'secondary';
  textVariant?: 'primary' | 'default' | 'secondary' | 'danger' | 'success' | 'secondary';
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export declare interface InputFieldProps extends TextInputProps {
  label: string;
  Icon?: React.ReactNode;
  iconStyle?: string;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  className?: string;
}
