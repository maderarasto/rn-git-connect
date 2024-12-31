import {useEffect, useRef} from "react";
import {AppState, AppStateStatus} from "react-native";

const useResumeHandler = (callback: Function) => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    }
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      callback();
    }

    appState.current = nextAppState;
  }
}

export default useResumeHandler;