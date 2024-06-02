import { View, Text, StyleSheet, Button } from "react-native";
import React from "react";
import PrimaryButton from "@src/components/buttons/PrimaryButton";
import BulletList from "@src/components/BulletList";
import { FontAwesome } from "@expo/vector-icons";
import TextBold from "@src/components/TextBold";
import { useRouter } from "expo-router";

const AuthPATGitHubTemplate = () => {
  const router = useRouter();

  return (
    <>
      <Text style={{ ...styles.paragraph, marginBottom: 10 }}>
        Personal access tokens are an alternative to using passwords for
        authentication when using GitHub outside of browser.
      </Text>
      <View style={styles.instructions}>
        <Text style={styles.paragraph}>
          You can obtain personal access token in the following steps:
        </Text>
        <BulletList
          type="ordered"
          options={{
            bulletIcon: (
              <FontAwesome name="angle-right" size={16} color="black" />
            ),
            bulletStyle: { marginTop: 4 }
          }}
        >
          <Text style={styles.instructionsBulletItem}>
            In the left sidebar of your profile, click on{" "}
            <TextBold>Developer settings</TextBold>.
          </Text>
          <Text style={styles.instructionsBulletItem}>
            In the left sidebar, under{" "}
            <TextBold>Personal access tokens</TextBold>, click on{" "}
            <TextBold>Tokens (classic)</TextBold>.
          </Text>
          <Text style={styles.instructionsBulletItem}>
            Select Generate new token, then click{" "}
            <TextBold>Generate new token (classic)</TextBold>.
          </Text>
          <Text style={styles.instructionsBulletItem}>
            In the <TextBold>Note</TextBold> field give your PAT descriptive
            name and in the field <TextBold>Expiration</TextBold> how long do
            you want to be signed in.
          </Text>
          <Text style={styles.instructionsBulletItem}>
            In part <TextBold>Select scopes</TextBold> select following scopes{" "}
            <TextBold>repo</TextBold>, <TextBold>admin:org</TextBold>,{" "}
            <TextBold>gist</TextBold>, <TextBold>notifications</TextBold>,{" "}
            <TextBold>user</TextBold>, <TextBold>delete_repo</TextBold>,{" "}
            <TextBold>write:discussion</TextBold> and{" "}
            <TextBold>project</TextBold>.
          </Text>
          <Text style={styles.instructionsBulletItem}>
            You can copy and paste newly generated token to app.
          </Text>
        </BulletList>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 16
  },

  instructions: {
    marginBottom: 20
  },

  instructionsBulletItem: {
    fontSize: 16
  }
});

export default AuthPATGitHubTemplate;
