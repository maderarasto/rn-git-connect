import GitApiProvider from "@src/providers/GitApiProvider";
import { Slot, Stack } from "expo-router";

const RootLayout = () => {
  return (
    <GitApiProvider>
      <Slot />
    </GitApiProvider>
  );
}

export default RootLayout;