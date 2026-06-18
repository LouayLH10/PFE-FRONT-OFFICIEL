"use client";

import { ArrowBigLeftDash, ArrowLeft, ArrowLeftCircle, ArrowLeftFromLine, ArrowRight, MessageCircle, SendIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import SearchBar from "./searchBar";
import { getUserFromToken } from "../auth/pages/login/user";
import { api } from "@/app/api/api";
import { socket } from "@/app/socket";

type User = {
  user:{
    id:number
  lastMessage: string;
  name: string;
},
  unreadCount: number;
lastMessage:{
  id:number,
  content:String
},
conversation:[
  {
    id:number,content:String,senderId:number,recieverId:number,fileUrl:String,dateSent:Date
  }
]
};

function MessagesBar({ open, setOpen }: any) {
  const user = getUserFromToken();
  // 🔹 input search

useEffect(() => {
  if (user?.sub) {
    socket.connect();

    socket.emit("join", user.sub); // 🔥 rejoindre sa room
  }

  return () => {
    socket.disconnect();
  };
}, [user]);
useEffect(() => {

  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }

}, []);
  const [query, setQuery] = useState("");
const [selectedContact, setSelectedContact] = useState<User | null>(null);
 const [contacts, setContacts] = useState<User[]>([]);
const [sentMessage,setSentMessage]=useState("");
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [dragActive, setDragActive] = useState(false);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };
useEffect(() => {

socket.on("newMessage", (message) => {

  // 🔥 notification si conversation fermée
  if (
    !selectedContact ||
    selectedContact.user.id !== message.senderId
  ) {

    // 🔔 browser notification
    if (Notification.permission === "granted") {

      new Notification("New Message", {
        body: message.content || "File received",
      });

    }

    // 🔴 increment unread
    setContacts((prev: any[]) =>
      prev.map((c) => {

        if (c.user.id === message.senderId) {
          return {
            ...c,
            unreadCount: (c.unreadCount || 0) + 1,
          };
        }

        return c;
      })
    );
  }

  // 🔥 UPDATE CONTACTS
  setContacts((prev: any[]) => {

    return prev.map((c) => {

      const isConcerned =
        c.user.id === message.senderId ||
        c.user.id === message.receiverId;

      if (!isConcerned) return c;

      const updatedConversation = [
        ...(c.conversation || []),
        message,
      ];

      return {

        ...c,

        conversation: updatedConversation,

        lastMessage:
          message.content ||
          "Sent a file",

      };

    });

  });

  // 🔥 UPDATE OPEN CONVERSATION
  setSelectedContact((prev: any) => {

    if (!prev) return prev;

    const isCurrentConversation =
      prev.user.id === message.senderId ||
      prev.user.id === message.receiverId;

    if (!isCurrentConversation)
      return prev;

    return {

      ...prev,

      conversation: [
        ...(prev.conversation || []),
        message,
      ],

      lastMessage:
        message.content ||
        "Sent a file",

    };

  });

});

  return () => {
    socket.off("newMessage");
  };

}, []);
useEffect(() => {
  if (!user?.sub) return;

  const loadContacts = async () => {
    const data = await fetchContact(user.sub);
    console.log(data)
    setContacts(data);
  };

  loadContacts();
}, [user?.sub]);

const getColorFromName = (name: string) => {
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
  for (let i = 0; i < name?.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

  // 🔹 filtre
  const filteredContacts = contacts.filter((d) =>
    d.user?.name?.toLowerCase().includes(query.toLowerCase())
  );
const fetchContact = async (userId: number) => {
  try {
    const res = await api.get("http://localhost:3200/users");

    const users = res.data.filter((u: any) => u.id !== userId);

    // 🔥 récupérer conversations pour chaque user
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
        preview: "No messages yet",
      },

      };

    } catch (err) {

      return {

        user: u,

        conversation: [],

        lastMessage: "No messages yet",

      };

    }

  })
);

    return result;
  } catch (error) {
    console.error("Erreur fetch users:", error);
    return [];
  }
};
const sendMessage = async () => {

  if (
    !sentMessage.trim() &&
    !selectedFile
  ) {
    return;
  }

  if (!selectedContact) return;

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

    // 🔥 UPDATE CONTACTS
   /* setContacts((prev: any[]) =>
      prev.map((c) => {

        if (
          c.user.id !==
          selectedContact.user.id
        ) {
          return c;
        }

        return {

          ...c,

          conversation: [
            ...(c.conversation || []),
            res.data,
          ],

          lastMessage:
            res.data.content ||
            "Sent a file",

        };

      })
    );
*/
    // 🔥 UPDATE CHAT
 

    // 🔥 RESET
    setSentMessage("");
    setSelectedFile(null);

  } catch (error) {

    console.error(
      "Send message error:",
      error
    );

  }

};
const handleDrop = (
  e: React.DragEvent<HTMLDivElement>
) => {

  e.preventDefault();
  setDragActive(false);

  if (e.dataTransfer.files?.[0]) {
    setSelectedFile(
      e.dataTransfer.files[0]
    );
  }
};

const handleDragOver = (
  e: React.DragEvent<HTMLDivElement>
) => {

  e.preventDefault();
  setDragActive(true);

};

const handleDragLeave = () => {
  setDragActive(false);
};
  return (
    <div className="flex items-start gap-4">

      {/* 🔥 Toggle Button */}
      <div
        onClick={() => setOpen(!open)}
        className={`fixed top-10 z-50 group flex items-center gap-2 text-blue-600 font-bold rounded-xl p-4 hover:bg-blue-600 cursor-pointer hover:text-white transition-all duration-300 ${
          open ? "right-[26%]" : "right-10"
        }`}
      >
        {open ? <ArrowRight size={30} /> : <MessageCircle size={30} />}

        <span className="opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap">
          {open ? "Hide" : "Messages"}
        </span>
      </div>

      {/* 🔥 Sidebar */}
      <div
        className={`fixed top-0 right-0 bg-white shadow-md h-screen p-4 transition-all duration-300 ${
          open ? "w-1/4 translate-x-0" : "w-1/4 translate-x-full"
        }`}
      >
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-blue-600">Messages</h1>
 
        </div>

        {/* Search */}
  
<div className={`mb-6 flex items-center gap-3 ${selectedContact? "p-4 bg-blue-200 rounded-xl":""}`} >
  {selectedContact ? (
    <>
      <button
    onClick={() => setSelectedContact(null)}
    className="text-sm text-blue-500 mb-2 transition-all duration-300 mr-5   cursor-pointer hover:text-white"
  >
    <ArrowLeft size={30}/>
  </button>
      {/* Avatar */}
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold  ${getColorFromName(selectedContact.user.name)}`}
      >
        {selectedContact.user.name.charAt(0).toUpperCase()}
      </div>

      {/* Name */}
      <h1 className="text-xl font-bold text-blue-600 ">
        {selectedContact.user.name}
      </h1>
    </>
  ) : (
<div className=" flex flex-col w-full">
  <SearchBar
    value={query}
    onChange={setQuery}
    placeholder="Search Contact..."
  />

  <h2 className="text-lg font-bold text-blue-600 mt-4">
    Contacts 
  </h2>
</div>
  )}
</div>

        {/* Contacts */}
<div className="relative h-full overflow-hidden">

  {/* 🔵 CONTACTS */}
  <div
    className={`absolute inset-0 transition-all duration-500 ease-in-out ${
      selectedContact
        ? "-translate-x-full opacity-0"
        : "translate-x-0 opacity-100"
    }`}
  >
  <div className="space-y-3">
  {filteredContacts.map((c, index) => {

    const bgColor = getColorFromName(c.user.name);
    const initial =
      c.user?.name.charAt(0).toUpperCase();

    return (

      <div
        key={index}
        onClick={() => {

          // 🔥 ouvrir conversation
          setSelectedContact(c);

          // 🔥 reset notifications
          setContacts((prev: any[]) =>
            prev.map((contact) => {

              if (
                contact.user.id === c.user.id
              ) {
                return {
                  ...contact,
                  unreadCount: 0,
                };
              }

              return contact;
            })
          );
        }}

        className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-100 cursor-pointer"
      >

        {/* LEFT */}
        <div className="flex items-center gap-3">

          {/* Avatar */}
          <div className="relative">

            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${bgColor}`}
            >
              {initial}
            </div>

            {/* 🔴 BADGE */}
            {c.unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                {c.unreadCount}
              </div>
            )}

          </div>

          {/* Infos */}
          <div>

            <p className="font-semibold">
              {c.user.name}
            </p>

            <p className="text-sm text-gray-500 truncate max-w-[180px]">
{typeof c.lastMessage === "string"
  ? c.lastMessage
  : c.lastMessage?.preview}
            </p>

          </div>

        </div>

      </div>
    );
  })}
</div>
  </div>

  {/* 🟢 CHAT */}
  <div
    className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${
      selectedContact
        ? "translate-x-0 opacity-100"
        : "translate-x-full opacity-0"
    }`}
  >
    {/* Messages */}
<div className="flex-1  space-y-3 pr-2 pb-24  ">
  <div className="overflow-y-auto  h-150  ">
  {selectedContact?.conversation.map((message, index) => (
    <div
      key={index}
      className={`mt-1 ${
        message?.senderId === user?.sub
          ? "bg-blue-600 text-white p-3 rounded-lg w-fit ml-auto"
          : "bg-gray-200 p-3 rounded-lg w-fit"
      }`}
    >
   <div className="flex flex-col gap-2">

  {message.content && (
    <p>{message.content}</p>
  )}

  {message.fileUrl && (

    <a
      href={`http://localhost:3200${message.fileUrl}`}
      target="_blank"
      className="underline text-sm"
    >
      📎 Download File
    </a>

  )}

</div>
  <p>{message?.dateSent}</p>
    </div>
  
  ))}
  
  </div>
<div
  onDrop={handleDrop}
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  className={`
    fixed bottom-40 left-0 w-full
    bg-white border-t p-3
    flex items-center gap-2
    transition-all
    ${dragActive ? "bg-blue-50 border-blue-400" : ""}
  `}
>

  {/* Upload */}
  <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 p-3 rounded-xl">

    📎

    <input
      type="file"
      hidden
      onChange={(e) => {

        if (e.target.files?.[0]) {
          setSelectedFile(
            e.target.files[0]
          );
        }

      }}
    />

  </label>

  {/* Input */}
  <input
    type="text"
    placeholder="Type a message..."
    className="flex-1 border rounded-xl p-3"
    value={sentMessage}
    onChange={(e) =>
      setSentMessage(e.target.value)
    }
    onKeyDown={(e) => {

      if (e.key === "Enter") {
        sendMessage();
      }

    }}
  />

  {/* File preview */}
  {selectedFile && (

    <div className="bg-blue-100 px-3 py-2 rounded-lg text-sm max-w-[150px] truncate">
      {selectedFile.name}
    </div>

  )}

  {/* Send */}
  <button
    disabled={
      !sentMessage.trim() &&
      !selectedFile
    }
    onClick={sendMessage}
    className={`
      text-white px-4 py-3 rounded-xl
      ${
        !sentMessage.trim() &&
        !selectedFile
          ? "bg-gray-300"
          : "bg-blue-500 hover:bg-blue-700"
      }
    `}
  >
    <SendIcon size={20} />
  </button>

</div>
</div>



    </div>

    {/* Input FIXED en bas */}

  </div>

</div>

      </div>
  );
}

export default MessagesBar;