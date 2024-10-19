export const userProfileTemplates = [
  {
    templateId: "template-1",
    name: "Seat Preference",
    description: "Request a seat preference from the user",
    attributes: ["seat", "name", "email", "avatar", "location"],
  },
  {
    templateId: "template-2",
    name: "Food Preference",
    description: "Request a food preferences from the user",
    attributes: ["food", "name", "email", "avatar", "location"],
  },
  {
    templateId: "template-3",
    name: "Accommodation Preference",
    description: "Request a accommodation preferences from the user",
    attributes: ["accommodation", "name", "email", "avatar", "location"],
  },
  {
    templateId: "template-4",
    name: "Travel Preference",
    description: "Request a travel preferences from the user",
    attributes: ["travel", "name", "email", "avatar", "location"],
  },
]

export type UserProfileRequestTemplate = {
  templateId: string
  name: string
  description: string
  attributes: string[]
}
