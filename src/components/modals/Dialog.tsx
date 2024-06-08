import { View, Text, Modal, StyleSheet, StyleProp, ViewStyle, TouchableOpacity, TouchableWithoutFeedback, Pressable, ModalProps } from "react-native";
import React, { ReactNode, forwardRef, useImperativeHandle, useState } from "react";
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

const Dialog = forwardRef<DialogMethods, DialogProps>(({
  title = 'Dialog',
  backdropStyle = {},
  shown = false,
  children,
  ...modalProps
}, ref) => {
  const [visible, setVisible] = useState(shown);

  useImperativeHandle(ref, () => ({
    isShown: function () {
      return visible;
    },

    show: function () {
      setVisible(true);
    },

    hide: function () {
      setVisible(false);
    }
  }));

  function resolveBackdropStyle() {
    let style: StyleProp<ViewStyle> = {
      ...styles.backdropContainer,
      ...backdropStyle as object,
    };

    return style;
  }

  function closeModal() {
    setVisible(false);
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
        <View style={resolveBackdropStyle()}>
          <TouchableWithoutFeedback>
            <View style={styles.dialogBody}>
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
            </View>
          </TouchableWithoutFeedback>
        </View>
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
