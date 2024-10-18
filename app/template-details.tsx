import { userProfileTemplates } from "@/constants/data"
import { useLocalSearchParams, useRouter } from "expo-router"
import { StyleSheet, SafeAreaView, View, Text } from "react-native"
import { Button, useTheme } from "react-native-paper"

export default function Screen() {
  const theme = useTheme()
  const router = useRouter()
  const params = useLocalSearchParams()

  const templateId = params.templateId

  const template = userProfileTemplates.find(
    (template) => template.templateId === templateId
  )

  if (!template) {
    return <View />
  }

  const onClick = () => {
    router.push({
      pathname: "/qrcode",
      params: {
        templateId,
      },
    })
  }

  const style = StyleSheet.create({
    container: {
      flexGrow: 1,
      margin: 24,
      elevation: 5,
    },
    templateTitle: {
      fontSize: 26,
      marginBottom: 4,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    templateDetails: {
      fontSize: 20,
      marginBottom: 4,
    },
    attributeContainer: {
      backgroundColor: "white",
      marginBottom: 4,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
      borderRadius: 8,
      padding: 8,
      marginTop: 20,
    },
    attribute: {
      fontSize: 18,
      marginVertical: 4,
    },
    buttonContainer: {
      marginTop: 20,
    },
  })

  return (
    <>
      <SafeAreaView style={style.container}>
        <View>
          <Text style={style.templateTitle} numberOfLines={1}>
            {template.name}
          </Text>
          <Text style={style.templateDetails} numberOfLines={2}>
            {template.description}
          </Text>
          <View style={style.attributeContainer}>
            {template.attributes.map((attribute) => (
              <Text key={attribute} style={style.attribute}>
                {" "}
                {`\u2022`} {attribute}
              </Text>
            ))}
          </View>
        </View>

        <Button
          mode="contained"
          onPress={onClick}
          style={style.buttonContainer}
        >
          Use this Template
        </Button>
      </SafeAreaView>
    </>
  )
}
