import { generateUUID } from "@/agent"
import { bleRequestUserData } from "@/agent/bleRequestData"
import { userProfileTemplates } from "@/constants/data"
import {
  useCloseTransportsOnUnmount,
  usePeripheral,
  usePeripheralShutdownOnUnmount,
} from "@animo-id/react-native-ble-didcomm"
import { useAgent } from "@credo-ts/react-hooks"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { View, Text, StyleSheet, Button } from "react-native"
import { ActivityIndicator, useTheme } from "react-native-paper"
import QRCode from "react-native-qrcode-svg"

export default function Screen() {
  const theme = useTheme()
  const router = useRouter()
  const params = useLocalSearchParams()

  const [uuid, setUuid] = useState("")
  const [userConnected, setUserConnected] = useState(false)
  const { peripheral } = usePeripheral()
  const { agent } = useAgent()

  const templateId = params.templateId

  const template = userProfileTemplates.find(
    (template) => template.templateId === templateId
  )
  const onFailure = () => console.error("[PERIPHERAL]: failure")
  const onConnected = () => {
    console.log("[PERIPHERAL]: connected")
    setUserConnected(true)
  }
  const onDisconnected = () => console.log("[PERIPHERAL]: disconnected")

  usePeripheralShutdownOnUnmount()
  useCloseTransportsOnUnmount(agent)

  const requestUserData = (serviceUuid: string) => {
    bleRequestUserData({
      onConnected,
      onDisconnected,
      onFailure,
      peripheral,
      agent,
      serviceUuid,
      userProfileRequestTemplate: template?.attributes,
    }).then((data) => {
      console.log("data", data)
    })
  }

  useEffect(() => {
    const createUUID = async () => {
      const uuid = await generateUUID()
      setUuid(uuid)
      await requestUserData(uuid)
    }
    void createUUID()
  }, [])

  const styles = StyleSheet.create({
    container: {
      position: "relative",
      flex: 1,
      paddingHorizontal: 40,
      paddingVertical: 40,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "flex-start",
    },

    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginVertical: 20,
      textAlign: "center",
    },

    subtitle: {
      fontSize: 20,
      marginBottom: 20,
      textAlign: "center",
    },

    qr: {
      alignItems: "center",
      justifyContent: "center",
      height: 250,
      width: 250,
    },

    icon: {
      color: theme.colors.primary,
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.qr}>
        {userConnected ? (
          <ActivityIndicator size={80} />
        ) : (
          <QRCode
            size={240}
            value={JSON.stringify({ serviceUUID: uuid })}
            backgroundColor="#fff"
          />
        )}
      </View>

      <Text style={styles.title}>
        <Text style={styles.icon}>Show</Text> this QRCode to the user
      </Text>

      <Text style={styles.subtitle}>
        After this QRCode is scanned, user preferences will be requested
      </Text>
    </View>
  )
}
