import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ConversationSidebar } from "@/components/ConversationSidebar";
import ChatContainer from "@/components/ChatContainer";
import { type Message, type Conversation, MessageRole } from "@/types";
import {
  get_all_conversations,
  get_all_messages,
  send_message,
} from "@/API/apiservice";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>("1");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextCursor, setNextCursor] = useState("");

  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  const handleSendMessage = async (text: string) => {
    if (!activeConversationId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      userId: "user",
      content: text,
      role: MessageRole.USER,
      timeStamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => {
      return [...prevMessages, userMessage];
    });

    // Simulate AI response
    setIsTyping(true);
    const conversation_id = activeConversation?.is_temporary
      ? ""
      : activeConversationId;
    const response = await send_message(text, conversation_id);
    setMessages((prevMessages) => {
      prevMessages.pop(); // Remove the last user message added optimistically
      return [...prevMessages, ...response.messages];
    });

    setIsTyping(false);
  };

  const handleNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      lastMessage: "No messages yet",
      is_temporary: true,
      created_at: new Date().toISOString(),
    };
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const fetchMessages = async () => {
    const response = await get_all_messages(activeConversationId, nextCursor);
    if (nextCursor) {
      setMessages((prevMessages) => [...response.messages, ...prevMessages]);
    } else {
      setMessages(response.messages);
    }
    setNextCursor(response.meta.next_cursor);
  };

  const fetchConversations = async () => {
    // Fetch conversations from server
    const response = await get_all_conversations();
    setConversations(response.conversations);
    if (response.conversations.length > 0) {
      setActiveConversationId(response.conversations[0].id);
    }
  };

  useEffect(() => {
    if (activeConversationId && conversations.length > 0) {
      fetchMessages();
    }
  }, [activeConversationId]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }

    if (!loading && user) {
      // Fetch conversations from server
      fetchConversations();
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
            messages={messages || []}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
