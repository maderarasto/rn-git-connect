import { View, Text, TextStyle } from 'react-native'
import React, { PropsWithChildren } from 'react'

export type TextBoldProps = {
  children?: React.ReactNode
  style?: TextStyle
}

const TextBold = ({children, style = {}}: TextBoldProps) => {  
  const resolveStyle = () => {
    return {
      fontWeight: 'bold',
      ...style,
    } satisfies TextStyle;
  }

  return (
    <Text style={resolveStyle()}>{children}</Text>
  )
}

export default TextBold