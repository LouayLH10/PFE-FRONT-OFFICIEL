"use client";

import React, { useEffect, useState } from "react";
import SearchBar from "../../components/searchBar";
import { socket } from "@/app/socket";
import { getUserFromToken } from "../../auth/pages/login/user";
import {
  deleteMessage,
  fetchContact,
  sendMessage,
} from "../service/messagesService";
import { File, MessageCircleIcon, Paperclip, SendHorizonalIcon, SendIcon, Trash2, UploadCloud } from "lucide-react";

type Message = {
  id: number;
  content: string | null;
  fileUrl: string | null;
  senderId: number;
  receiverId: number;
  sentDate: string;
};

type ContactType = {
  user: {
    id: number;
    name: string;
    email: string;
  };

  conversation: Message[];

  lastMessage: {
    preview: string;
  };
};

function MessagesPage() {
  const user = getUserFromToken();

  const [query, setQuery] = useState("");

  const [selectedContact, setSelectedContact] =
    useState<ContactType | null>(null);

  const [contacts, setContacts] = useState<
    ContactType[]
  >([]);

  const [sentMessage, setSentMessage] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
const handleDeleteMessage = async () => {
  if (!messageToDelete) return;

  try {
    await deleteMessage(messageToDelete);

    // Mise à jour du chat ouvert
    setSelectedContact((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        conversation: prev.conversation.filter(
          (msg) => msg.id !== messageToDelete
        ),
      };
    });

    // Mise à jour de la liste des contacts
    setContacts((prev) =>
      prev.map((contact) => ({
        ...contact,
        conversation: contact.conversation.filter(
          (msg) => msg.id !== messageToDelete
        ),
      }))
    );

    // Fermeture du popup
    setShowDeleteModal(false);
    setMessageToDelete(null);

  } catch (error) {
    console.error(
      "Erreur lors de la suppression du message :",
      error
    );
  }
};
  // 🔥 SEND MESSAGE
  const handleSendMessage = async () => {
    try {
      const newMessage = await sendMessage({
        sentMessage,
        selectedFile,
        selectedContact,
        user,
      });

      if (!newMessage) return;

      // 🔥 UPDATE OPENED CHAT
setSelectedContact((prev) => {
  if (!prev) return prev;

  return {
    ...prev,
    conversation: [
      ...(prev.conversation || []),
      newMessage,
    ],
  };
});

      // 🔥 UPDATE SIDEBAR
      setContacts((prev: any[]) =>
        prev.map((c) => {
          if (
            c.user.id !==
            selectedContact?.user.id
          ) {
            return c;
          }

          return {
            ...c,

            conversation: [
              ...c.conversation,
              newMessage,
            ],

            lastMessage: {
              preview:
                newMessage.content ||
                "Sent a file",
            },
          };
        })
      );

      // 🔥 RESET
      setSentMessage("");
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 SOCKET CONNECT
  useEffect(() => {
    if (user?.sub) {
      socket.connect();

      socket.emit("join", user.sub);
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // 🔥 NOTIFICATION PERMISSION
  useEffect(() => {
    if (
      typeof Notification !== "undefined" &&
      Notification.permission !== "granted"
    ) {
      Notification.requestPermission();
    }
  }, []);

// 🔥 RECEIVE REALTIME MESSAGE
useEffect(() => {
  const handleReceiveMessage = (
    newMessage: Message
  ) => {

    // 🔥 éviter les doublons de mes propres messages
    if (
      newMessage.senderId === user?.sub
    ) {
      return;
    }

    // 🔥 UPDATE CONTACTS
    setContacts((prev) =>
      prev.map((contact) => {

        const isConversation =
          contact.user.id ===
            newMessage.senderId ||
          contact.user.id ===
            newMessage.receiverId;

        if (!isConversation) {
          return contact;
        }

        return {
          ...contact,

          conversation: [
            ...(contact.conversation || []),
            newMessage,
          ],

          lastMessage: {
            preview:
              newMessage.content ||
              "Sent a file",
          },
        };
      })
    );

    // 🔥 UPDATE OPENED CHAT
    setSelectedContact((prev) => {

      if (!prev) return prev;

      const isCurrentChat =
        prev.user.id ===
          newMessage.senderId ||
        prev.user.id ===
          newMessage.receiverId;

      if (!isCurrentChat) {
        return prev;
      }

      const alreadyExists =
        prev.conversation?.some(
          (msg) =>
            msg.id === newMessage.id
        );

      if (alreadyExists) {
        return prev;
      }

      return {
        ...prev,

        conversation: [
          ...(prev.conversation || []),
          newMessage,
        ],

        lastMessage: {
          preview:
            newMessage.content ||
            "Sent a file",
        },
      };
    });

    // 🔥 Browser Notification
    if (
      typeof Notification !==
        "undefined" &&
      Notification.permission ===
        "granted"
    ) {
      new Notification(
        "New message",
        {
          body:
            newMessage.content ||
            "Sent a file",
        }
      );
    }
  };

  socket.on(
    "receiveMessage",
    handleReceiveMessage
  );

  return () => {
    socket.off(
      "receiveMessage",
      handleReceiveMessage
    );
  };
}, [user?.sub]);
  // 🔥 FETCH CONTACTS
  useEffect(() => {
    const loadContacts = async () => {
      if (!user?.sub) return;

      const data = await fetchContact(
        user.sub
      );

      setContacts(data);
    };

    loadContacts();
  }, [user]);

  // 🔥 FILTER
  const filteredContacts = contacts.filter(
    (c) =>
      c.user?.name
        ?.toLowerCase()
        .includes(query.toLowerCase())
  );

  // 🔥 RANDOM AVATAR COLOR
  const getColorFromName = (
    name: string
  ) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];

    let hash = 0;

    for (let i = 0; i < name.length; i++) {
      hash =
        name.charCodeAt(i) +
        ((hash << 5) - hash);
    }

    return (
      colors[Math.abs(hash) % colors.length]
    );
  };

  return (
<div className="h-full flex overflow-hidden rounded-[30px] bg-white shadow-xl">

  {/* 🔵 SIDEBAR */}
  <div className="w-[340px] bg-[#fafafa] border-r border-gray-200 flex flex-col">

    {/* HEADER */}
    <div className="px-6 pt-6 pb-5">

      <h1 className="text-3xl font-bold text-[#6C4DFF]">
        Messages
      </h1>

      {/* SEARCH */}
      <div className="mt-6 relative">
        <input
          type="text"
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder="Search contact..."
          className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-[#6C4DFF]"
        />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>

    {/* CONTACTS */}
    <div className="flex-1 overflow-y-auto px-4 pb-5">

      <p className="text-gray-500 text-sm font-semibold px-2 mb-4 uppercase tracking-wider">
        Contacts
      </p>

      <div className="space-y-3">

        {filteredContacts.map((c, index) => {

          const bgColor =
            getColorFromName(
              c.user.name
            );

          const initial =
            c.user.name
              .charAt(0)
              .toUpperCase();

          const isSelected =
            selectedContact?.user.id ===
            c.user.id;

          return (
            <div
              key={index}
              onClick={() =>
                setSelectedContact(c)
              }
              className={`flex items-center gap-4 p-4 rounded-3xl cursor-pointer transition-all duration-300 border ${
                isSelected
                  ? "bg-[#F3F0FF] border-[#6C4DFF]"
                  : "bg-white border-transparent hover:border-gray-200 hover:shadow-md"
              }`}
            >

              {/* AVATAR */}
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md ${bgColor}`}
              >
                {initial}
              </div>

              {/* INFO */}
              <div className="flex-1 overflow-hidden">

                <div className="flex items-center justify-between">

                  <p className="font-semibold text-gray-800 truncate">
                    {c.user.name}
                  </p>

                </div>

                <p className="text-sm text-gray-500 truncate mt-1">
                  {
                    c.lastMessage
                      ?.preview
                  }
                </p>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>

  {/* 🟢 CHAT */}
  <div className="flex-1 flex flex-col bg-[#f5f5f7]">

    {selectedContact ? (
      <>
        {/* HEADER */}
        <div className="bg-white px-8 py-5 border-b border-gray-200 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md ${getColorFromName(
                selectedContact.user.name
              )}`}
            >
              {selectedContact.user.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <h2 className="font-bold text-xl text-gray-800">
                {
                  selectedContact.user
                    .name
                }
              </h2>


            </div>
          </div>

          {/* ACTIONS */}

        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">

          {selectedContact.conversation.map(
            (msg) => {

              const isMine =
                msg.senderId ===
                user?.sub;

              return (
<div
  key={msg.id}
  className={`flex items-center gap-2 ${
    isMine
      ? "justify-end"
      : "justify-start"
  }`}
>

  {/* Trash à gauche pour mes messages */}
  {isMine && (
<button
  onClick={() => {
    setMessageToDelete(msg.id);
    setShowDeleteModal(true);
  }}
  className="text-gray-400 hover:text-red-500 cursor-pointer transition"
>
  <Trash2 size={18} />
</button>
  )}

  {/* Message */}
  <div
    className={`max-w-[65%] px-5 py-4 rounded-[24px] shadow-sm ${
      isMine
        ? "bg-[#6C4DFF] text-white rounded-br-md"
        : "bg-white text-gray-800 rounded-bl-md"
    }`}
  >
    {msg.content && (
      <p className="leading-relaxed">
        {msg.content}
      </p>
    )}

    {msg.fileUrl && (
      <a
        href={`http://localhost:3200${msg.fileUrl}`}
        target="_blank"
        rel="noreferrer"
        className={`block mt-2 underline text-sm ${
          isMine
            ? "text-white"
            : "text-[#6C4DFF]"
        }`}
      >
        📄 Open File
      </a>
    )}

    <p
      className={`text-[11px] mt-3 ${
        isMine
          ? "text-purple-200"
          : "text-gray-400"
      }`}
    >
      {new Date(
        msg.sentDate
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </p>
  </div>

  {/* Trash à droite pour les messages reçus */}

</div>
              );
            }
          )}
        </div>

        {/* INPUT */}
{/* INPUT */}
<div className="bg-white border-t border-gray-200 px-6 py-5">

  <div
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => {
      e.preventDefault();

      if (e.dataTransfer.files?.[0]) {
        setSelectedFile(
          e.dataTransfer.files[0]
        );
      }
    }}
    className={`flex items-center gap-4 rounded-3xl px-5 py-3 border-2 transition-all duration-300 ${
      selectedFile
        ? "border-[#6C4DFF] bg-[#F3F0FF]"
        : "border-transparent bg-[#f5f5f7]"
    }`}
  >

    {/* INPUT MESSAGE */}
    <input
      type="text"
      value={sentMessage}
      onChange={(e) =>
        setSentMessage(
          e.target.value
        )
      }
      placeholder="Type a message..."
      className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
    />

    {/* FILE NAME */}
    {selectedFile && (
      <div className="text-sm text-[#6C4DFF] font-medium truncate max-w-[150px]">
        {selectedFile.name}
      </div>
    )}

    {/* FILE PICKER */}
    <label className="cursor-pointer text-gray-500 hover:text-[#6C4DFF] transition flex items-center gap-2">

      {selectedFile ? (
        <UploadCloud size={20} />
      ) : (
        <Paperclip size={20} />
      )}

      <input
        type="file"
        hidden
        onChange={(e) =>
          setSelectedFile(
            e.target.files?.[0] || null
          )
        }
      />
    </label>

    {/* SEND */}
    <button
      onClick={handleSendMessage}
      className="w-12 h-12 rounded-full bg-[#6C4DFF] hover:bg-[#5a3df0] text-white flex items-center justify-center shadow-lg transition-all duration-300"
    >
      ➤
    </button>
  </div>

  {/* DRAG TEXT */}
  <p className="text-xs text-gray-400 mt-2 ml-2">
    Drag & drop a file here or click the attachment icon
  </p>
</div>
      </>
    ) : (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400">

        <div className="text-8xl mb-5">
          <MessageCircleIcon size={150}/>
        </div>

        <h2 className="text-3xl font-bold text-gray-700">
          Your Messages
        </h2>

        <p className="mt-3 text-gray-500">
          Select a conversation and start chatting
        </p>
      </div>
    )}
  </div>
  {showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

    <div className="w-[420px] bg-white rounded-3xl shadow-2xl overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between p-6">

        <h2 className="text-2xl font-bold text-gray-900">
          Delete message?
        </h2>

        <button
          onClick={() => {
            setShowDeleteModal(false);
            setMessageToDelete(null);
          }}
          className="text-gray-500 hover:text-gray-800 transition"
        >
          ✕
        </button>

      </div>

      {/* Body */}
      <div className="px-6 pb-6">

        <p className="text-gray-600 leading-relaxed">
          Are you sure you want to delete this message?
        </p>

        <p className="text-gray-500 mt-2">
          Once deleted, this action cannot be undone.
        </p>

      </div>

      {/* Footer */}
      <div className="bg-red-50 p-5 flex justify-between items-center">

        <button
         onClick={handleDeleteMessage}
          className="flex items-center gap-2 cursor-pointer  text-red-600 font-semibold hover:text-red-700 transition"
        >
          <Trash2 size={18} />
          Yes, Delete
        </button>

      </div>

    </div>

  </div>
)}
</div>
  );
}

export default MessagesPage;