import { requestPermissions } from "@/agent"
import {
  UserProfileRequestTemplate,
  userProfileTemplates,
} from "@/constants/data"
import { Stack, useRouter } from "expo-router"
import { useEffect } from "react"
import {
  StyleSheet,
  Platform,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  View,
  Text,
} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useTheme } from "react-native-paper"

interface ProfileRequestCardProps {
  onPress: (templateId: string) => void
  template: UserProfileRequestTemplate
}

const ProfileRequestCard: React.FC<ProfileRequestCardProps> = ({
  onPress,
  template,
}) => {
  const theme = useTheme()
  const style = StyleSheet.create({
    card: {
      backgroundColor: "white",
      flexDirection: "row",
      borderRadius: 8,
      padding: 12,
      marginBottom: 10,
    },
    textContainer: {
      flex: 1,
    },
    templateTitle: {
      fontSize: 16,
      marginBottom: 4,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    templateDetails: {
      fontSize: 16,
      marginBottom: 4,
    },
    templateZkpLabel: {
      fontSize: 12,
    },
    iconContainer: {
      alignSelf: "center",
    },
    icon: {
      fontSize: 36,
      color: theme.colors.primary,
    },
  })

  return (
    <TouchableOpacity
      style={style.card}
      onPress={() => onPress(template.templateId)}
    >
      <View style={style.textContainer}>
        <Text style={style.templateTitle} numberOfLines={1}>
          {template.name}
        </Text>
        <Text style={style.templateDetails} numberOfLines={2}>
          {template.description}
        </Text>
      </View>
      <View style={style.iconContainer}>
        <MaterialCommunityIcons style={style.icon} name={"chevron-right"} />
      </View>
    </TouchableOpacity>
  )
}

export default function Screen() {
  const router = useRouter()

  useEffect(() => {
    try {
      if (Platform.OS === "android") {
        requestPermissions().then((check) => console.log("check", check))
      }
    } catch (error) {
      console.log("Error requesting permissions", error)
    }
  }, [])

  const onCLick = (templateId: string) => {
    router.push({
      pathname: "/template-details",
      params: {
        templateId,
      },
    })
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Choose a Template",
        }}
      />
      <SafeAreaView style={style.container}>
        <FlatList
          data={userProfileTemplates}
          keyExtractor={(records) => records.templateId}
          renderItem={({ item }) => {
            return <ProfileRequestCard template={item} onPress={onCLick} />
          }}
        />
      </SafeAreaView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    flexGrow: 1,
    margin: 24,
    elevation: 5,
  },
})
