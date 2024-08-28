import { View, Text, StyleSheet } from "react-native";
import {AntDesign, FontAwesome6} from '@expo/vector-icons';
import { Connection } from "@src/types";

type ConnectionHeaderProps = {
  connection: Connection,
  active?: boolean
}

const ConnectionHeader = ({
  connection,
  active = false,
}: ConnectionHeaderProps) => {
  function resolveIcon() {
    let iconEl = <AntDesign name="question" size={56} color="black" />

    if (connection.type === 'GitHub') {
      iconEl = <AntDesign name="github" size={56} color="#1e293b" />
    } else if (connection.type === 'GitLab') {
      iconEl = <AntDesign name="gitlab" size={56} color="#ea580c" />
    }

    return iconEl;
  }

  function resolveConnectionDetails() {
    return (
      <View style={{  }}>
        <Text style={styles.textUsername}>{connection.username}</Text>
        <Text style={styles.textDisplayName}>{connection.email}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {resolveIcon()}
      {resolveConnectionDetails()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center', 
    gap: 24, 
    paddingHorizontal: 8, 
    paddingVertical: 8,
  },

  textUsername: {
    flex: 0,
    marginBottom: -4,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },

  textDisplayName: {
    fontSize: 16,
    color: 'gray',
  }
})

export default ConnectionHeader;
