import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore.js";
import ChatHeader from "./ChatHeader.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import MessageInput from "./MessageInput.jsx";

const ChatContainer = () => {
  const { isMessagesLoading, messages, selectedUser, getMessages } =
    useChatStore();

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

  if (isMessagesLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader />
      <p>messages...</p>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
