import { View, Text, StyleSheet } from "react-native";
import React, { RefObject } from "react";
import LabeledTextInput from "./LabeledTextInput";
import PrimaryButton from "./buttons/PrimaryButton";
import { FontAwesome } from "@expo/vector-icons";
import SlidedModal, { SlidedModalMethods } from "./dialogs/SlidedModal";

export type RepositoryFilterProps = {
  modalRef?: RefObject<SlidedModalMethods>
}

const RepositoryFilter = ({
  modalRef
}: RepositoryFilterProps) => {
  function onButtonPress() {
    if (!modalRef?.current) {
      return;
    }

    modalRef.current.show();
  }

  return (
    <View style={styles.filterRow}>
      <LabeledTextInput
        placeholder="Find a repository"
        style={styles.searchInput}
      />
      <PrimaryButton onPress={onButtonPress}>
        <FontAwesome name="sliders" size={20} color="white" />
      </PrimaryButton>
    </View>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: "row",
    gap: 8
  },

  searchInput: {
    flex: 1
  }
});

export default RepositoryFilter;
