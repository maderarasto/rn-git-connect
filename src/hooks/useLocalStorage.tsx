import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { serialize, unserialize } from "@src/utils/functions";
import { Serializable } from "@src/types";

export type LocalStorageEntry<T extends Serializable> = {
  data: T|null
  isLoading: boolean
  setData: (data: T|null) => void
  refreshData: () => void
  remove: () => void
}

const useLocalStorage = <T extends Serializable,>(key: string): LocalStorageEntry<T> => {
  const [value, setValue] = useState<T|null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  useEffect(() => {
    if (isLoading) {
      loadItem();
    }
  }, [isLoading]);

  const loadItem = async () => {
    const serialized = await AsyncStorage.getItem(key);
    setIsLoading(false);

    if (serialized === null) {
      return;
    }

    setValue(unserialize<T>(serialized));
  }

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

  return {
    data: value,
    isLoading,
    setData: setItem,
    refreshData: () => {
      setIsLoading(true);
    },
    remove: removeItem,
  };
};

export default useLocalStorage;