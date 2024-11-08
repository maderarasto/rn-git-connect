import { Text, ViewStyle, TouchableOpacity } from 'react-native'
import React from 'react'

export type ActionButtonProps = {
  icon: React.JSX.Element
  text: string
  disabled?: boolean
  onPress?: () => void
}

const ActionButton = ({
  icon,
  text,
  disabled,
  onPress
}: ActionButtonProps) => {
  const resolveButtonStyle = () => {
    let buttonStyle: ViewStyle = {
      gap: 4,
      paddingHorizontal: 16,
      paddingVertical: 8
    };

    buttonStyle.opacity = disabled ? 0.6 : 1;

    return buttonStyle;
  }

  return (
    <TouchableOpacity style={resolveButtonStyle()} disabled={disabled} onPress={onPress}>
      {icon}
      <Text style={{ textAlign: 'center'}}>{text}</Text>
    </TouchableOpacity>
  )
}

export default ActionButton