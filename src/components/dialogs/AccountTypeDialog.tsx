import { View, Text } from "react-native";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import {AntDesign} from '@expo/vector-icons';

import Dialog, { DialogMethods, DialogProps } from "./Dialog";
import ActionButton from "../buttons/ActionButton";
import { AccountType } from "@src/api/types";

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
          <ActionButton 
            icon={<AntDesign name="github" size={42} color="#1e293b" />} 
            text="GitHub" 
            onPress={() => chooseAccountType('Github')} />
          <ActionButton 
            icon={<AntDesign name="gitlab" size={42} color="#ea580c" />} 
            text="GitLab" 
            onPress={() => chooseAccountType('Gitlab')} />
        </View>
      </Dialog>
    );
  }
);

export default AccountTypeDialog;