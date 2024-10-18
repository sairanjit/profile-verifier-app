export const userProfileTemplates = [
  {
    templateId: "template-1",
    name: "Seat Preference",
    description: "Request a seat preference from the user",
    attributes: ["Seat Choice", "Full Name", "Email"],
  },
  {
    templateId: "template-2",
    name: "Food Preference",
    description: "Request a food preferences from the user",
    attributes: ["Food Choice", "Full Name", "Email"],
  },
  {
    templateId: "template-3",
    name: "Hotel Preference",
    description: "Request a hotel preferences from the user",
    attributes: ["Hotel Preferences", "Full Name", "Email"],
  },
  {
    templateId: "template-4",
    name: "Destination Preference",
    description: "Request a destination preferences from the user",
    attributes: ["Destination Preference", "Full Name", "Email"],
  },
]

export type UserProfileRequestTemplate = {
  templateId: string
  name: string
  description: string
  attributes: string[]
}
