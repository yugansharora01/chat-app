import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ConversationSidebar } from "@/components/ConversationSidebar";
import ChatContainer from "@/components/ChatContainer";
import { type Message, type Conversation, MessageRole } from "@/types";
import { send_message } from "@/API/apiservice";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Welcome Chat",
      lastMessage: "Hello! How can I help you today?",
      timestamp: new Date(),
      messages: [
        {
          id: "1",
          userId: "ai",
          content: "Hello! I'm your AI assistant. How can I help you today?",
          role: MessageRole.AI,
          timeStamp: new Date().toISOString(),
        },
      ],
    },
  ]);
  const [activeConversationId, setActiveConversationId] = useState<string>("1");
  const [isTyping, setIsTyping] = useState(false);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  const handleSendMessage = async (text: string) => {
    if (!activeConversation) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      userId: "user",
      content: text,
      role: MessageRole.USER,
      timeStamp: new Date().toISOString(),
    };

    // Update conversation with new message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversationId
          ? {
              ...conv,
              messages: [...conv.messages, userMessage],
              lastMessage: text,
              timestamp: new Date(),
              title:
                conv.messages.length === 1
                  ? text.slice(0, 30) + (text.length > 30 ? "..." : "")
                  : conv.title,
            }
          : conv
      )
    );

    // Simulate AI response
    setIsTyping(true);

    const response = await send_message(text);
    const aiMessage: Message = response.messages[response.messages.length - 1];

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversationId
          ? {
              ...conv,
              messages: [...conv.messages, aiMessage],
              lastMessage:
                aiMessage.content.slice(0, 50) +
                (aiMessage.content.length > 50 ? "..." : ""),
              timestamp: new Date(),
            }
          : conv
      )
    );
    setIsTyping(false);
  };

  const handleNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      lastMessage: "No messages yet",
      timestamp: new Date(),
      messages: [],
    };
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <ConversationSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
        />
        <div className="flex-1">
          <ChatContainer
            messages={activeConversation?.messages || []}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
