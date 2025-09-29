export default function ConversationList({ conversations, onSelect, selectedId }) {
  return (
    <div className="w-1/3 border-r h-full overflow-y-auto">
      <h2 className="text-lg font-bold p-2 border-b">Conversations</h2>
      {conversations.map((c) => (
        <div
          key={c.userId}
          onClick={() => onSelect(c.userId)}
          className={`p-3 cursor-pointer hover:bg-gray-100 ${
            selectedId === c.userId ? "bg-blue-100" : ""
          }`}
        >
          <p className="font-semibold">User {c.userId}</p>
          <p className="text-sm text-gray-600 truncate">{c.lastMessage}</p>
        </div>
      ))}
    </div>
  );
}
