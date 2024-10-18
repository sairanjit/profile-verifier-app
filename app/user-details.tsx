import React from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import {
  Avatar,
  Card,
  Title,
  Text,
  List,
  Divider,
  Button,
  useTheme,
} from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const user = {
  Profile: {
    "Full Name": "Sai Ranjit",
    Email: "sairanjit@gmail.com",
    Phone: "+91 (984) 879-5083",
    Place: "Pune, India",
    Avatar: "https://avatars.githubusercontent.com/u/34263716?v=4",
  },
  "Seat Choice": {
    "Seat Type": "Business Class",
    "Seat Location": "Window",
  },
  "Food Preference": {
    "Food Choice": "Italian",
  },
  "Hotel Preference": {
    "Hotel Preferences": "Hotel A",
  },
  "Destination Preference": {
    "Destination Preference": "New York",
  },
}

type UserKeys =
  | "Profile"
  | "Seat Choice"
  | "Food Preference"
  | "Hotel Preference"
  | "Destination Preference"

export default function Screen() {
  const { colors } = useTheme()

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.header}>
        <View style={styles.avatarContainer}>
          <Avatar.Image size={120} source={{ uri: user.Profile.Avatar }} />
          <Title style={styles.name}>{user.Profile["Full Name"]}</Title>
          <Text style={styles.location}>{user.Profile.Place}</Text>
        </View>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Title>Contact Information</Title>
          <List.Item
            title="Email"
            description={user.Profile.Email}
            left={(props) => (
              <MaterialCommunityIcons
                {...props}
                name="email"
                size={24}
                color={colors.primary}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Phone"
            description={user.Profile.Phone}
            left={(props) => (
              <MaterialCommunityIcons
                {...props}
                name="phone"
                size={24}
                color={colors.primary}
              />
            )}
          />
        </Card.Content>
      </Card>

      {Object.entries(user).map(([mainKey, value]) => {
        if (mainKey === "Profile") return null

        const section = user[mainKey as UserKeys]

        return (
          <Card style={styles.section}>
            <Card.Content>
              <Title>{mainKey}</Title>
              {Object.entries(section).map(([subKey, value], index) => {
                const isLastItem = index === Object.entries(section).length - 1
                return (
                  <>
                    <List.Item
                      title={subKey}
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
                  </>
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
