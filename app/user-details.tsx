import React from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import {
  Avatar,
  Card,
  Title,
  Text,
  List,
  Divider,
  useTheme,
  Switch,
} from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useLocalSearchParams } from "expo-router"
import { formatDisplayText } from "@/utils"

type UserKeys =
  | "Profile"
  | "Seat Choice"
  | "Food Preference"
  | "Hotel Preference"
  | "Destination Preference"

export default function Screen() {
  const { colors } = useTheme()
  const params = useLocalSearchParams()

  const user = JSON.parse(params.userData as any)

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.header}>
        <View style={styles.avatarContainer}>
          <Avatar.Image size={120} source={{ uri: user.avatar }} />
          <Title style={styles.name}>{user.name}</Title>
          <Text style={styles.location}>{user.location}</Text>
        </View>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Title>Contact Information</Title>
          <List.Item
            title="Email"
            description={user.email}
            left={(props) => (
              <MaterialCommunityIcons
                {...props}
                name="email"
                size={24}
                color={colors.primary}
              />
            )}
          />
        </Card.Content>
      </Card>

      {Object.entries(user).map(([mainKey, value]) => {
        const excludedKeys = [
          "name",
          "email",
          "phone",
          "avatar",
          "location",
          "socialLinks",
          "bio",
          // Default keys
          "displayIcon",
          "displayPicture",
        ]

        if (excludedKeys.includes(mainKey)) {
          return null
        }

        const section = user[mainKey as UserKeys]

        return (
          <Card key={mainKey} style={styles.section}>
            <Card.Content>
              <Title>{formatDisplayText(mainKey)}</Title>
              {Object.entries(section).map(([subKey, value], index) => {
                const isLastItem = index === Object.entries(section).length - 1

                if (typeof value === "boolean") {
                  return (
                    <View key={`${mainKey}-${subKey}`}>
                      <List.Item
                        title={formatDisplayText(subKey)}
                        description={""}
                        left={(props) => (
                          <MaterialCommunityIcons
                            {...props}
                            name="information-outline"
                            size={24}
                            color={colors.primary}
                          />
                        )}
                        right={() => (
                          <Switch value={value} color={colors.primary} />
                        )}
                      />
                      {!isLastItem && <Divider />}
                    </View>
                  )
                }

                return (
                  <View key={`${mainKey}-${subKey}`}>
                    <List.Item
                      title={formatDisplayText(subKey)}
                      description={value}
                      left={(props) => (
                        <MaterialCommunityIcons
                          {...props}
                          name="information-outline"
                          size={24}
                          color={colors.primary}
                        />
                      )}
                    />
                    {!isLastItem && <Divider />}
                  </View>
                )
              })}
            </Card.Content>
          </Card>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    margin: 16,
    elevation: 4,
  },
  avatarContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 12,
  },
  location: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  editButton: {
    margin: 16,
  },
  section: {
    margin: 16,
    elevation: 3,
  },
  lastSection: {
    marginBottom: 16,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  interestChip: {
    margin: 4,
  },
  interestLabel: {
    fontSize: 12,
  },
})
