import { View, Text, Modal, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, Pressable, TouchableWithoutFeedback, GestureResponderEvent } from 'react-native'
import React, { RefObject, forwardRef, useImperativeHandle, useState } from 'react'
import {AntDesign, FontAwesome6, FontAwesome5} from '@expo/vector-icons';

import PickServerButton from './PickServerButton'
import { ServerType } from '@src/types';

type AccountTypeModalParams = {
  onChooseServer?: (type: ServerType) => void,
  shown?: boolean
}

export type AccountTypeModalMethods = {
  open: () => void,
  close: () => void
}

const AccountTypeModal = forwardRef<AccountTypeModalMethods, AccountTypeModalParams>(({
  onChooseServer = () => {},
  shown = false
}, ref) => {
  const [visible, setVisible] = useState(shown);

  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true);
    },

    close: () => {
      setVisible(false);
    }
  }))

  function resolveOverlayStyle() {
    let overlayStyle: StyleProp<ViewStyle> = {
      ...styles.overlayContainer
    };

    overlayStyle.display = visible ? 'flex' : 'none';

    return overlayStyle;
  }

  function chooseServer(server: ServerType) {
    setVisible(false);
    onChooseServer(server);
  }

  function closeModal() {
    setVisible(false);
  }

  return (
    <View style={resolveOverlayStyle()}>
      <Modal animationType="slide" transparent={true} visible={visible} style={{ position: 'relative' }}>
        <Pressable onPress={() => closeModal()} style={{ flex: 1 }}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View>
                <View style={styles.titleContainer}>
                  <View></View>
                  <Text style={styles.titleText}>Choose git server</Text>
                  <TouchableOpacity style={styles.closeButton} onPress={() => closeModal()}>
                    <FontAwesome6 name="xmark" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, }}>
                  <PickServerButton icon={<AntDesign name="github" size={42} color="black" />} text="GitHub" onPress={() => chooseServer('GitHub')} />
                  <PickServerButton icon={<AntDesign name="gitlab" size={42} color="#ea580c" />} text="GitLab" onPress={() => chooseServer('GitLab')} />
                  <PickServerButton icon={<FontAwesome5 name="git-alt" size={42} color="#dc2626" />} text="Git" onPress={() => chooseServer('Git')} />
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
  overlayContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },

  modalContainer: {
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    width: '100%',
    height: '20%',
    backgroundColor: 'white',
  },

  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 15,
  },

  titleText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
  },

  closeButton: {
    alignSelf: 'flex-end'
  }
})

export default AccountTypeModal;