import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import React from "react";
import {useRouter} from "expo-router";
import SearchHeader from "@src/components/headers/SearchHeader";
import UnfocusView from "@src/components/views/UnfocusView";
import TagPicker from "@src/components/TagPicker";
import {ProgrammingLanguages} from "@src/utils/structs";
import {Tag} from "@src/types";

const SearchRepositoriesScreen = () => {
  const router = useRouter();

  const onBackPress = () => {
    router.back();
  }

  const onSearchTextChange = (text: string) => {
    console.log('value:', text);
  }

  const onSearchTextClear = () => {
    console.log('clear');
  }

  const onPickLanguage = (tag: Tag) => {
    router.push(`/(search)/repositories/list?language=${tag.label}`);
  }

  return (
    <UnfocusView style={styles.container}>
      <SearchHeader
        onChangeText={onSearchTextChange}
        onClearText={onSearchTextClear}
        options={{
          titleStyle: { flex: 1, },
          headerLeft: () => (
            <TouchableOpacity onPress={onBackPress}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
          title: 'Search repositories',
        }}
      />
      <View style={styles.content}>
        <Text style={{ marginBottom: 8, fontSize: 14, color: 'gray' }}>List your repositories by language</Text>
        <TagPicker items={ProgrammingLanguages} onPick={onPickLanguage} />
      </View>
    </UnfocusView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  }
})

export default SearchRepositoriesScreen;