import BaseHeader, {BaseHeaderProps} from "@src/components/headers/BaseHeader";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import React, {useRef, useState} from "react";
import TextEdit, {TextEditMethods} from "@src/components/inputs/TextEdit";
import {AntDesign} from "@expo/vector-icons";

export type SearchHeaderProps = BaseHeaderProps & {
  onChangeText?: (text: string) => void
  onClearText?: () => void
};

const SearchHeader = ({
  onChangeText,
  onClearText,
  ...baseHeaderProps
}: SearchHeaderProps) => {
  const [showClear, setShowClear] = useState(false);
  const searchTextRef = useRef<TextEditMethods>(null);

  const onSearchTextChange = (text: string) => {
    if (onChangeText) {
      onChangeText(text);
    }

    setShowClear(text.length > 0);
  }

  const onClearButtonPress = () => {
    if (searchTextRef.current) {
      searchTextRef.current.clearText();
    }

    if (onClearText) {
      onClearText();
    }
  }

  return (
    <>
      <BaseHeader {...baseHeaderProps} />
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextEdit
            ref={searchTextRef}
            containerStyle={{ flex: 1}}
            icon={<AntDesign name="search1" size={20} color="gray" />}
            onChangeText={onSearchTextChange}/>
          {showClear ? (
            <TouchableOpacity style={styles.clearIcon} onPress={onClearButtonPress}>
              <AntDesign name="close" size={20} color="gray" />
            </TouchableOpacity>
          ) : ''}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: '#dedede',
  },

  searchBar: {
    position: 'relative',
    flexDirection: 'row',
  },

  clearIcon: {
    position: 'absolute',
    alignSelf: 'center',
    right: 12,
  }
});

export default SearchHeader;