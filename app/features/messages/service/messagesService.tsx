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
      "/message",
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
export const fetchContact = async (userId: number) => {
  console.log(
    "fetchContact called:",
    userId,
    new Date().toISOString()
  );

  try {
    const res = await api.get("/users");

    console.log("Users response:", res.data);

    if (!Array.isArray(res.data)) {
      console.error(
        "Expected array from /users but received:",
        res.data
      );
      return [];
    }

    const users = res.data.filter(
      (u: any) => u.id !== userId
    );

    const result = await Promise.all(
      users.map(async (u: any) => {
        try {
          const convRes = await api.get(
            `/message/conversation?user1Id=${userId}&user2Id=${u.id}`
          );

          console.log(
            `Conversation with ${u.id}:`,
            convRes.data
          );

          const conversation = Array.isArray(convRes.data)
            ? convRes.data
            : Array.isArray(convRes.data?.data)
            ? convRes.data.data
            : [];

          const last =
            conversation.length > 0
              ? conversation[conversation.length - 1]
              : null;

          return {
            user: u,
            conversation,
            lastMessage: last
              ? {
                  ...last,
                  preview:
                    last.content || "Sent a file",
                }
              : {
                  preview: "No messages yet",
                },
          };
        } catch (err: any) {
          console.error(
            `Conversation error with user ${u.id}`
          );
          console.error("Message:", err.message);
          console.error("Code:", err.code);
          console.error("Status:", err.response?.status);
          console.error("Response:", err.response?.data);
          console.error("Config:", err.config);

          return {
            user: u,
            conversation: [],
            lastMessage: {
              preview: "No messages yet",
            },
          };
        }
      })
    );

    console.log("Contacts loaded:", result);

    return result;
  } catch (err: any) {
    console.error("Fetch users error");
    console.error("Message:", err.message);
    console.error("Code:", err.code);
    console.error("Status:", err.response?.status);
    console.error("Response:", err.response?.data);
    console.error("Config:", err.config);

    return [];
  }
};
export const deleteMessage = async (
  messageId: number
) => {
  try {
    const res = await api.delete(
      `/message/${messageId}`
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
export const fetchUnreadCount = async (
   userId:number
)=>{
console.log(userId);
console.log(typeof userId);
console.log(`/message/unread-count?userId=${userId}`);
   const res = await api.get(
      `/message/unread-count?userId=${userId}`
   );

   return res.data;
}
export  const  markConversationAsRead = async (
  senderId: number,
  receiverId: number
) => {
  await api.patch(
    `/message/read?senderId=${senderId}&receiverId=${receiverId}`
  );
};