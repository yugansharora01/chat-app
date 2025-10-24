import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ConversationSidebar } from "@/components/ConversationSidebar";
import ChatContainer from "@/components/ChatContainer";
import type { Message } from "@/components/ChatContainer";

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

const Index = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Welcome Chat",
      lastMessage: "Hello! How can I help you today?",
      timestamp: new Date(),
      messages: [
        {
          id: "1",
          text: "Hello! I'm your AI assistant. How can I help you today?",
          isUser: false,
          timestamp: new Date(),
        },
      ],
    },
  ]);
  const [activeConversationId, setActiveConversationId] = useState<string>("1");
  const [isTyping, setIsTyping] = useState(false);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  const handleSendMessage = (text: string) => {
    if (!activeConversation) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
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
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "This is a simulated response. Connect your AI backend here to get real responses!",
        isUser: false,
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversationId
            ? {
                ...conv,
                messages: [...conv.messages, aiMessage],
                lastMessage:
                  aiMessage.text.slice(0, 50) +
                  (aiMessage.text.length > 50 ? "..." : ""),
                timestamp: new Date(),
              }
            : conv
        )
      );
      setIsTyping(false);
    }, 1500);
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
