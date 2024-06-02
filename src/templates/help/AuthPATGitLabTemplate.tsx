import { View, Text, StyleSheet, Button } from "react-native";
import React from "react";
import PrimaryButton from "@src/components/buttons/PrimaryButton";
import BulletList from "@src/components/BulletList";
import { FontAwesome } from "@expo/vector-icons";
import TextBold from "@src/components/TextBold";
import { useRouter } from "expo-router";

const AuthPATGitLabTemplate = () => {
  const router = useRouter();

  return (
    <>
      <Text style={{ ...styles.paragraph, marginBottom: 10 }}>
        Personal access tokens are an alternative to using passwords for
        authentication when using GitLab outside of browser.
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
					<Text>In the left sidebar, click on <TextBold>Access Tokens</TextBold>.</Text>
					<Text>Then click on <TextBold>Add new token</TextBold>.</Text>
					<Text>
						In the field <TextBold>Token name</TextBold> give your PAT descriptive name and in the field <TextBold>Expiration date</TextBold> how long do you want to be signed in.
					</Text>
					<Text>
						In part <TextBold>Select scopes</TextBold> select following scopes <TextBold>api</TextBold>, <TextBold>read_api</TextBold>, <TextBold>read_user</TextBold>, <TextBold>read_repository</TextBold> and <TextBold>write_repository</TextBold>.
					</Text>
					<Text>You can copy and paste newly generated token to app.</Text>
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

export default AuthPATGitLabTemplate;
