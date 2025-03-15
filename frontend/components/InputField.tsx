import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TextInput,
  Platform,
  Keyboard,
} from 'react-native';
import React from 'react';
import { InputFieldProps } from '../types/type';

/**
 * A reusable input field component
 * @param {string} label - The label displayed above the input field
 * @param {string} [labelStyle] - The style of the label
 * @param {React.ComponentType<any>} [Icon] - The icon that is displayed as the left accessory
 * @param {string} [iconStyle] - The style of the icon
 * @param {boolean} [secureTextEntry] - If true, the input field will be a password field
 * @param {string} [containerStyle] - The style of the outer container of the input field
 * @param {string} [inputStyle] - The style of the input field
 * @param {string} [className] - The class name of the component
 * @param {TextInputProps} [props] - Any additional props that can be passed to the TextInput component
 * @returns {JSX.Element} The rendered component
 */
const InputField = ({
  label,
  labelStyle,
  Icon,
  iconStyle,
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  className,
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-2 w-full">
          {label && (
            <Text className={`mb-3 text-lg font-semibold text-gray-500 ${labelStyle}`}>
              {label}
            </Text>
          )}
          <View
            className={`relative flex flex-row items-center justify-start rounded-full border border-black bg-black focus:border-white ${containerStyle} `}>
            {Icon}
            <TextInput
              className={`flex-1 rounded-full p-4 text-[15px] font-semibold text-white ${inputStyle} text-left`}
              secureTextEntry={secureTextEntry}
              placeholderTextColor={'#4b5563'}
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
