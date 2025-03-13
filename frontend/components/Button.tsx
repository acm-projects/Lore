import { ButtonProps } from '../types/type';
import { Icon } from 'lucide-react-native';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

const getBgVariantStyle = (variant: ButtonProps['bgVariant']) => {
  switch (variant) {
    case 'primary':
      return 'bg-primary';
    case 'success':
      return 'bg-success-500';
    case 'danger':
      return 'bg-danger-500';
    case 'danger-outline':
      return 'bg-transparent border border-danger-500';
    case 'outline':
      return 'bg-transparent border border-white';
    case 'secondary':
      return 'bg-secondary';
    default:
      return 'bg-primary';
  }
};

const getTextVariantStyle = (variant: ButtonProps['textVariant']) => {
  switch (variant) {
    case 'primary':
      return 'text-white';
    case 'success':
      return 'text-green-100';
    case 'danger':
      return 'text-red-100';
    case 'secondary':
      return 'text-black';
    default:
      return 'text-white';
  }
};

/**
 * A custom button component that wraps TouchableOpacity and accepts various
 * props to customize its appearance and behavior.
 *
 * @param {() => void} onPress - The function to call when the button is pressed.
 * @param {string} title - The button title.
 * @param {ButtonProps["bgVariant"]} [bgVariant=primary] - The background color variant.
 * @param {ButtonProps["textVariant"]} [textVariant=default] - The text color variant.
 * @param {React.ComponentType<any>} [IconLeft] - The left icon component.
 * @param {React.ComponentType<any>} [IconRight] - The right icon component.
 * @param {string} [className] - Additional CSS classes for the button.
 * @param {boolean} [isLoading=false] - Whether the button is in a loading state.
 * @param {boolean} [disabled=false] - Whether the button is disabled.
 */
const Button = ({
  onPress,
  title,
  bgVariant = 'primary',
  textVariant = 'default',
  IconLeft,
  IconRight,
  className,
  isLoading,
  disabled = false,
  ...props
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex flex-row items-center justify-center rounded-full ${getBgVariantStyle(bgVariant)} ${className}`}
      disabled={disabled}>
      {IconLeft && <IconLeft />}
      {title &&
        (isLoading ? (
          <ActivityIndicator color="white" className="my-3" />
        ) : (
          <Text className={`my-3 text-lg font-bold ${getTextVariantStyle(textVariant)}`}>
            {title}
          </Text>
        ))}
      {IconRight && <IconRight />}
    </TouchableOpacity>
  );
};

export default Button;
