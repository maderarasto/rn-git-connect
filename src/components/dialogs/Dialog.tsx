import { View, Text, Modal, StyleSheet, StyleProp, ViewStyle, TouchableOpacity, TouchableWithoutFeedback, Pressable, ModalProps, Animated, LayoutChangeEvent, Dimensions } from "react-native";
import React, { ReactNode, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {FontAwesome6} from '@expo/vector-icons';

export type DialogMethods = {
  isShown: () => boolean
  show: () => void
  hide: () => void
}

export type DialogProps = ModalProps & {
  title?: string
  backdropStyle?: StyleProp<ViewStyle>
  shown?: boolean
  children?: ReactNode
}

const DEFAULT_BACKDROP_BG_COLOR = 'rgba(0, 0, 0, 0.7)';
const screenDimensions = Dimensions.get('screen');

const Dialog = forwardRef<DialogMethods, DialogProps>(({
  title = 'Dialog',
  backdropStyle = {},
  shown = false,
  children,
  ...modalProps
}, ref) => {
  const [visible, setVisible] = useState(shown);
  
  const animatedOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const animatedTranslate = useRef(
    new Animated.Value(screenDimensions.height)
  ).current;

  useImperativeHandle(ref, () => ({
    isShown: function () {
      return visible;
    },

    show: function () {
      showModal();
    },

    hide: function () {
      closeModal();
    }
  }));

  function resolveBackdropStyle() {
    let style: StyleProp<ViewStyle> = {
      ...styles.backdropContainer,
      ...backdropStyle as object,
      opacity: animatedOpacity,
    };

    return style;
  }

  function resolveDialogBodyStyle() {
    let style: StyleProp<ViewStyle> = {
      ...styles.dialogBody,
      transform: [
        { translateY: animatedTranslate }
      ]
    };
    
    return style;
  }

  function showModal() {
    setVisible(true);
    
    Animated.timing(animatedOpacity, {
      useNativeDriver: true,
      toValue: 1,
      duration: 500,
    }).start();

    Animated.timing(animatedTranslate, {
      useNativeDriver: true,
      toValue: 0,
      duration: 500,
    }).start();
  }

  function closeModal() {
    setTimeout(() => {
      setVisible(false);
    }, 500)

    Animated.timing(animatedOpacity, {
      useNativeDriver: true,
      toValue: 0,
      duration: 500,
    }).start();

    Animated.timing(animatedTranslate, {
      useNativeDriver: true,
      toValue: screenDimensions.height,
      duration: 500,
    }).start();
  }

  function onBackdropPress() {
    closeModal();
  }

  return (
    <Modal 
      {...modalProps}
      animationType="none" 
      transparent={true} 
      visible={visible} 
      statusBarTranslucent={true}
      onRequestClose={() => closeModal()}
    >
      <Pressable style={styles.pressableBackdrop} onPress={onBackdropPress}>
        <Animated.View style={resolveBackdropStyle()}>
          <TouchableWithoutFeedback>
            <Animated.View style={resolveDialogBodyStyle()}>
              {/* Dialog Header */}
              <View style={styles.dialogHeader}>
                <View></View>
                <Text style={styles.dialogTitle}>{title}</Text>
                <TouchableOpacity onPress={() => closeModal()}>
                  <FontAwesome6 name="xmark" size={24} color="black" />
                </TouchableOpacity>
              </View>

              {/* Dialog Content */}
              <View style={styles.dialogContent}>
                {children}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </Pressable>
    </Modal>
  );
});

const styles = StyleSheet.create({
  pressableBackdrop: {
    flex: 1,
  },

  backdropContainer: {
    flex: 1,
    backgroundColor: DEFAULT_BACKDROP_BG_COLOR
  },

  dialogBody: {
    position: 'absolute',
    bottom: 0,
    flex: 1,
    width: '100%',
    height: 'auto',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: 'white',
  },

  dialogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },

  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  dialogCloseButton: {

  },

  dialogContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  }
});

export default Dialog;
