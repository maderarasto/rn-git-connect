import { View, Text } from "react-native";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import {AntDesign} from '@expo/vector-icons';

import Dialog, { DialogMethods, DialogProps } from "./Dialog";
import { AccountType } from "@src/types";
import PickServerButton from "../buttons/PickServerButton";

export type AccountTypeDialogProps = DialogProps & {
  onTypeChoose: (accountType: AccountType) => void
};

const AccountTypeDialog = forwardRef<DialogMethods, AccountTypeDialogProps>(({
  onTypeChoose = () => {},
  ...dialogProps
}, ref) => {
    const dialogRef = useRef<DialogMethods>(null);

    useImperativeHandle(ref, () => ({
      isShown: function () {
        return dialogRef.current?.isShown() ?? false;
      },

      show: function () {
        dialogRef.current?.show();
      },

      hide: function () {
        dialogRef.current?.hide();
      }
    }))

    function chooseAccountType(accountType: AccountType) {
        onTypeChoose(accountType);
    }

    return (
      <Dialog {...dialogProps} ref={dialogRef}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, }}>
          <PickServerButton 
            icon={<AntDesign name="github" size={42} color="#1e293b" />} 
            text="GitHub" 
            onPress={() => chooseAccountType('GitHub')} />
          <PickServerButton 
            icon={<AntDesign name="gitlab" size={42} color="#ea580c" />} 
            text="GitLab" 
            onPress={() => chooseAccountType('GitLab')} />
        </View>
      </Dialog>
    );
  }
);

export default AccountTypeDialog;
