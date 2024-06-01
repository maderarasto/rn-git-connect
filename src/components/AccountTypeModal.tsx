import { View, Text, Modal, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, Pressable, TouchableWithoutFeedback, GestureResponderEvent } from 'react-native'
import React, { RefObject, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import {AntDesign, FontAwesome6, FontAwesome5} from '@expo/vector-icons';

import PickServerButton from './PickServerButton'
import { AccountType } from '@src/types';
import SlidedModal, { SlidedModalMethods, SlidedModalParams } from './SlidedModal';

export type AccountTypeModalMethods = SlidedModalMethods & {

}

export type AccountTypeModalParams = SlidedModalParams & {
  onTypeChoose?: (type: AccountType) => void, 
}

const AccountTypeModal = forwardRef<AccountTypeModalMethods, AccountTypeModalParams>(({
  onTypeChoose = () => {},
  ...modalProps
}, ref) => {
  const modalRef = useRef<SlidedModalMethods>(null);

  useImperativeHandle(ref, () => ({
    show: () => {
      if (!modalRef.current) {
        return;
      }

      modalRef.current.show();
    },

    hide: () => {
      if (!modalRef.current) {
        return;
      }

      modalRef.current.hide();
    }
  }))

  function chooseAccountType(accountType: AccountType) {
    onTypeChoose(accountType);
  }

  return (
    <SlidedModal ref={modalRef} {...modalProps}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, }}>
        <PickServerButton icon={<AntDesign name="github" size={42} color="black" />} text="GitHub" onPress={() => chooseAccountType('GitHub')} />
        <PickServerButton icon={<AntDesign name="gitlab" size={42} color="#ea580c" />} text="GitLab" onPress={() => chooseAccountType('GitLab')} />
        <PickServerButton icon={<FontAwesome5 name="git-alt" size={42} color="#dc2626" />} text="Git" onPress={() => chooseAccountType('Git')} />
      </View> 
    </SlidedModal>
  )
})

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