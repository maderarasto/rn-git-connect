import { View, Text, Modal, StyleSheet, ViewStyle, TouchableOpacity, TouchableWithoutFeedback, Pressable, ModalProps, Animated, LayoutChangeEvent, Dimensions } from "react-native";
import React, { ReactNode, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import {FontAwesome6} from '@expo/vector-icons';

export type DialogMethods = {
  isShown: () => boolean
  show: () => void
  hide: () => void
}

export type DialogProps = ModalProps & {
  title?: string
  backdropStyle?: ViewStyle
  animationDuration?: number
  shown?: boolean
  onHide?: () => void
  children?: ReactNode
}

const DEFAULT_BACKDROP_BG_COLOR = 'rgba(0, 0, 0, 0.7)';
const screenDimensions = Dimensions.get('screen');

const Dialog = forwardRef<DialogMethods, DialogProps>(({
  title = 'Dialog',
  backdropStyle = {},
  animationDuration = 500,
  shown = false,
  onHide = () => {},
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

  useEffect(() => {
    if (visible) {
      animateValue(animatedOpacity, 1, animationDuration);
      animateValue(animatedTranslate, 0, animationDuration);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      animateValue(animatedOpacity, 1, animationDuration);
      animateValue(animatedTranslate, 0, animationDuration);
    }
  }, [visible])

  useImperativeHandle(ref, () => ({
    isShown: function () {
      return visible;
    },

    show: function () {
      showDialog();
    },

    hide: function () {
      hideDialog();
    }
  }));

  function resolveBackdropStyle() {
    let style: ViewStyle = {
      ...styles.backdropContainer,
      ...backdropStyle as object,
      opacity: animatedOpacity,
    };

    return style;
  }

  function resolveDialogBodyStyle() {
    let style: ViewStyle = {
      ...styles.dialogBody,
      transform: [
        { translateY: animatedTranslate }
      ]
    };
    
    return style;
  }

  function animateValue(value: Animated.Value, toValue: number, duration: number) {
    Animated.timing(value, {
      useNativeDriver: true,
      toValue,
      duration,
    }).start();
  }

  function showDialog() {
    setVisible(true);
  }

  function hideDialog() {
    setTimeout(() => {
      setVisible(false);
    }, animationDuration)

    animateValue(animatedOpacity, 0, animationDuration);
    animateValue(animatedTranslate, screenDimensions.height, animationDuration);

    onHide();
  }

  function onBackdropPress() {
    hideDialog();
  }

  return (
    <Modal 
      {...modalProps}
      animationType="none" 
      transparent={true} 
      visible={visible} 
      statusBarTranslucent={true}
      onRequestClose={() => hideDialog()}
    >
      <Pressable style={styles.pressableBackdrop} onPress={onBackdropPress}>
        <Animated.View style={resolveBackdropStyle()}>
          <TouchableWithoutFeedback>
            <Animated.View style={resolveDialogBodyStyle()}>
              {/* Dialog Header */}
              <View style={styles.dialogHeader}>
                <View></View>
                <Text style={styles.dialogTitle}>{title}</Text>
                <TouchableOpacity onPress={() => hideDialog()}>
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