import { api } from "../../../api/api";


export const sendMessage = async ({
  sentMessage,
  selectedFile,
  selectedContact,
  user,
}: {
  sentMessage: string;
  selectedFile: File | null;
  selectedContact: any;
  user: any;
}) => {

  if (
    !sentMessage.trim() &&
    !selectedFile
  ) {
    return null;
  }

  if (!selectedContact) return null;

  try {

    const formData = new FormData();

    formData.append(
      "senderId",
      String(user?.sub)
    );

    formData.append(
      "receiverId",
      String(selectedContact.user.id)
    );

    // 🔥 message texte
    if (sentMessage.trim()) {

      formData.append(
        "content",
        sentMessage
      );

    }

    // 🔥 fichier
    if (selectedFile) {

      formData.append(
        "file",
        selectedFile
      );

    }

    const res = await api.post(
      "http://localhost:3200/message",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return res.data;

  } catch (error) {

    console.error(
      "Send message error:",
      error
    );

    throw error;
  }
};
export const fetchContact = async (
  userId: number
) => {

  try {

    const res = await api.get(
      "http://localhost:3200/users"
    );

    const users = res.data.filter(
      (u: any) => u.id !== userId
    );

    // 🔥 récupérer conversations
    const result = await Promise.all(

      users.map(async (u: any) => {

        try {

          const convRes = await api.get(
            `http://localhost:3200/message/conversation?user1Id=${userId}&user2Id=${u.id}`
          );

          const last =
            convRes.data[
              convRes.data.length - 1
            ];

          return {

            user: u,

            conversation: convRes.data,

            lastMessage: last
              ? {
                  ...last,
                  preview: last.content
                    ? last.content
                    : "Sent a file",
                }
              : {
                  preview:
                    "No messages yet",
                },

          };

        } catch (err) {

          return {

            user: u,

            conversation: [],

            lastMessage: {
              preview:
                "No messages yet",
            },

          };

        }

      })

    );

    return result;

  } catch (error) {

    console.error(
      "Erreur fetch users:",
      error
    );

    return [];

  }

};
export const deleteMessage = async (
  messageId: number
) => {
  try {
    const res = await api.delete(
      `http://localhost:3200/message/${messageId}`
    );

    return res.data;
  } catch (error) {
    console.error(
      "Erreur suppression message:",
      error
    );
    throw error;
  }
};