import { View, Text, StyleSheet } from "react-native";
import {AntDesign, FontAwesome6} from '@expo/vector-icons';
import { Connection } from "@src/hooks/useConnections";

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

    if (connection.service === 'Github') {
      iconEl = <AntDesign name="github" size={56} color="#1e293b" />
    } else if (connection.service === 'Gitlab') {
      iconEl = <AntDesign name="gitlab" size={56} color="#ea580c" />
    }

    return iconEl;
  }

  function resolveConnectionDetails() {
    return (
      <View style={{  }}>
        <Text style={styles.textFullname}>{connection.fullname}</Text>
        <Text style={styles.textUsername}>{connection.username}</Text>
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

  textFullname: {
    flex: 0,
    marginBottom: -4,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },

  textUsername: {
    fontSize: 16,
    color: 'gray',
  }
})

export default ConnectionHeader;
