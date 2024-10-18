import "react-native-get-random-values"
import "fast-text-encoding"
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect, useState } from "react"
import "react-native-reanimated"

import { useColorScheme } from "@/hooks/useColorScheme"
import AgentProvider from "@credo-ts/react-hooks"
import { AppAgent, initializeAppAgent } from "@/agent"
import {
  Peripheral,
  PeripheralProvider,
} from "@animo-id/react-native-ble-didcomm"
import { PaperProvider } from "react-native-paper"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [agent, setAgent] = useState<AppAgent>()
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  })

  // Initialize agent
  useEffect(() => {
    if (agent) return

    const startAgent = async () => {
      try {
        const newAgent = await initializeAppAgent({ walletLabel: "Verifier" })
        if (!newAgent) return
        setAgent(newAgent)
      } catch (error) {
        console.log("Error initializing agent", error)
      }
    }

    void startAgent()
  }, [])

  useEffect(() => {
    if (loaded && agent) {
      SplashScreen.hideAsync()
    }
  }, [loaded, agent])

  if (!loaded || !agent) {
    return null
  }

  return (
    <AgentProvider agent={agent}>
      <PeripheralProvider peripheral={new Peripheral()}>
        <PaperProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack initialRouteName="index">
              <Stack.Screen name="qrcode" options={{ title: "QRCode" }} />
              <Stack.Screen
                name="template-details"
                options={{ title: "Template Details" }}
              />
              <Stack.Screen
                name="user-details"
                options={{ title: "User Preferences" }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
          </ThemeProvider>
        </PaperProvider>
      </PeripheralProvider>
    </AgentProvider>
  )
}
