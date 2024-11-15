import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { serialize, unserialize } from "@src/utils/functions";
import { Serializable } from "@src/types";

export type LocalStorageEntry<T extends Serializable> = [
  T|null,
  (item: T|null) => Promise<void>,
  () => Promise<void>
]

const useLocalStorage = <T extends Serializable,>(key: string): LocalStorageEntry<T> => {
  const [value, setValue] = useState<T|null>(null);

  useEffect(() => {
    const loadItem = async () => {
      const serialized = await AsyncStorage.getItem(key);
      
      if (serialized === null) {
        return;
      }
      
      setValue(unserialize<T>(serialized));
    }

    loadItem();
  }, []);

  const setItem = async (item: T|null) => {
    if (item === null) {
      removeItem();
      return; 
    }
    
    const serialized = serialize(item);
    await AsyncStorage.setItem(key, serialized);
    
    setValue(item);
  }

  const removeItem = async () => {
    await AsyncStorage.removeItem(key);
    setValue(null);
  }

  return [value, setItem, removeItem];
};

export default useLocalStorage;