import { useEffect } from "react";
import { BackHandler } from "react-native";

export type BackHandlerCallback = () => void;

export default function useBackHandler(callback: BackHandlerCallback) {
  useEffect(() => {
    const onBack = () => {
      callback();
      return true;
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => backHandler.remove();
  }, []);
};