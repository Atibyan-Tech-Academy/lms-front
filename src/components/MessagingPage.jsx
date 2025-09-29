import { useState } from "react";
import useConversations from "../hooks/useConversations";
import ChatBox from "./ChatBox";
import ConversationList from "./ConversationList";

export default function MessagingPage({ currentUserId }) {
  const { conversations } = useConversations(currentUserId);
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex h-[600px] border rounded-lg">
      <ConversationList
        conversations={conversations}
        onSelect={setSelectedUser}
        selectedId={selectedUser}
      />
      <div className="flex-1">
        {selectedUser ? (
          <ChatBox currentUserId={currentUserId} otherUserId={selectedUser} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
