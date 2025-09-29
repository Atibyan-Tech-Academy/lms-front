import ChatBox from "../components/ChatBox";

export default function MessagesPage() {
  // Example: chatting with instructor ID 2
  const otherUserId = 2;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Messages</h1>
      <ChatBox otherUserId={otherUserId} />
    </div>
  );
}
