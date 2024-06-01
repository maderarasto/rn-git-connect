import { View, Text, StyleProp, ViewStyle, StyleSheet, Modal, Pressable, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import {FontAwesome6} from '@expo/vector-icons';

import { PropViewStyle } from '@src/types'

export type SlidedModalMethods = {
    show: () => void,
    hide: () => void,
}

export type SlidedModalParams = {
    title?: string
    backdropStyle?: PropViewStyle
    modalStyle?: PropViewStyle
    contentContainerStyle?: PropViewStyle
    shown?: boolean
    children?: React.JSX.Element
}

const SlidedModal = forwardRef<SlidedModalMethods, SlidedModalParams>(({
  title = 'Modal',
  backdropStyle = {},
  modalStyle = {},
  contentContainerStyle = {},
  shown = false,
  children
}, ref) => {
  const [visible, setVisible] = useState(shown);

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true);
    },
    hide: () => {
      setVisible(false);
    }
  }))

  function resolveBackdropStyle() {
    let style: PropViewStyle = {
      ...styles.backdrop,
      ...backdropStyle as object,
    };

    // Below you can change styles
    style.display = visible ? 'flex' : 'none';

    return style;
  }

  function resolveModalStyle() {
    let style: PropViewStyle = {
      ...styles.modal,
      ...modalStyle as object,
    };

    // Below you can change styles

    return style;
  }

  function resolveContentContainerStyle() {
    let style: PropViewStyle = {
      ...styles.contentContainer,
      ...contentContainerStyle as object,
    };

    // Below you can change styles

    return style;
  }

  function closeModal() {
    setVisible(false);
  }

  function onBackdropPress() {
    closeModal();
  }

  return (
    <View style={resolveBackdropStyle()}>
      <Modal animationType="slide" transparent={true} visible={visible}>
        <Pressable style={styles.pressableBackdrop} onPress={onBackdropPress}>
          <View style={resolveModalStyle()}>
            <TouchableWithoutFeedback>
              <View style={styles.modalBody}>
                <View style={styles.modalHeader}>
                  <View></View>
                  <Text style={styles.modalTitle}>{title}</Text>
                  <TouchableOpacity onPress={() => closeModal()}>
                    <FontAwesome6 name="xmark" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <View style={resolveContentContainerStyle()}>
                  {children}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Pressable>
      </Modal>
    </View>
  )
});

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },

  modalContainer: {
    position: 'relative',
  },

  pressableBackdrop: {
    flex: 1,
  },

  modal: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: 'white',
  },

  modalBody: {
    flex: 1,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 15,
  },

  modalTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
  },

  contentContainer: {
    paddingHorizontal: 16,
  }
})

export default SlidedModal