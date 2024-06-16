import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle, ToastAndroid } from "react-native";
import React, { RefObject, useRef, useState } from "react";
import LabeledTextInput from "./LabeledTextInput";
import PrimaryButton from "./buttons/PrimaryButton";
import { FontAwesome } from "@expo/vector-icons";
import Dialog, { DialogMethods } from "./dialogs/Dialog";
import { FilterTag, SortBy } from "@src/types";
import FilterSection from "./FilterSection";
import { ProgrammingLanguages, SortByItems } from "@src/structures";
import TagPicker, { Tag } from "./TagPicker";

export type RepositoryFilterData = {
  languages: string[]
  sortBy: SortBy
}

export type RepositoryFilterProps = {
  onChange?: (data: RepositoryFilterData) => void
}

const RepositoryFilter = ({
  onChange = () => {},
}: RepositoryFilterProps) => {
  const [languages, setLanguages] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>('Last updated');

  const dialogRef = useRef<DialogMethods>(null);

  function onFiltersButtonPress() {
    dialogRef.current?.show();
  }

  function onLanguageTagsChanged(languageTags: Tag[]) {
    setLanguages(languageTags.map((tag) => tag.label));
  }

  function onSortByTagPick(sortByTag: Tag) {
    setSortBy(sortByTag.label as SortBy);
  }

  function onDialogHide() {
    onChange({
      languages,
      sortBy,
    });
  }

  return (
    <View>
      <View style={styles.filterRow}>
        <LabeledTextInput
          placeholder="Find a repository"
          style={styles.searchInput}
        />
        <PrimaryButton onPress={onFiltersButtonPress}>
          <FontAwesome name="sliders" size={20} color="white" />
        </PrimaryButton>
      </View>
      <Dialog ref={dialogRef} title="Filter repositories" onHide={onDialogHide}>
        <FilterSection 
          label="Filter by language" 
          contentStyle={styles.tagPicker}
        >
          <TagPicker 
            items={ProgrammingLanguages} 
            onChange={onLanguageTagsChanged} 
            multiple />
        </FilterSection>
        <FilterSection 
          label="Sort by"
          contentStyle={styles.tagPicker}>
          <TagPicker 
            items={[...SortByItems]} 
            onPick={onSortByTagPick} />
        </FilterSection>
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#666',
    backgroundColor: '#dedede'
  },

  searchInput: {
    flex: 1,
  },

   tagPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  filterTag: {
    
  },
});

export default RepositoryFilter;
