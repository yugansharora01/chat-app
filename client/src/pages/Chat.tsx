import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Fetch conversations
  const { data: conversationsData } = useQuery({
    queryKey: ["conversations"],
    queryFn: get_all_conversations,
    enabled: !!user,
  });

  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  // Fetch messages for the active conversation
  const { data: messagesData } = useQuery({
    queryKey: ["messages", activeConversationId],
    queryFn: () => get_all_messages(activeConversationId),
    enabled: !!activeConversationId,
  });

  // Mutation to send message
  const sendMessageMutation = useMutation({
    mutationFn: ({
      text,
      conversationId,
    }: {
      text: string;
      conversationId: string;
    }) => send_message(text, conversationId),
    onMutate: async ({ text }) => {
      setIsTyping(true);
      // Optimistic update
      queryClient.setQueryData(
        ["messages", activeConversationId],
        (oldData: any) => ({
          messages: [
            ...(oldData?.messages || []),
            {
              id: Date.now().toString(),
              userId: "user",
              content: text,
              role: MessageRole.user,
              timeStamp: new Date().toISOString(),
              isTemporary: true,
            },
          ],
        })
      );
    },
    onSuccess: (response) => {
      const prevMessages = messages;
      if(messages.length > 0 && messages[messages.length -1].isTemporary){
        prevMessages.pop();
      }
      queryClient.setQueryData(["messages", activeConversationId], {
        messages: [...prevMessages, ...response.messages],
      });
      setIsTyping(false);
    },
  });

  const handleSendMessage = (text: string) => {
    if (!activeConversationId) return;
    const conversation_id = activeConversation?.is_temporary
      ? ""
      : activeConversationId;
    sendMessageMutation.mutate({ text, conversationId: conversation_id });
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
    //setMessages([]);
    setActiveConversationId(newConversation.id);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  useEffect(() => {
    if (messagesData?.messages?.length) {
      setMessages(messagesData?.messages);
    }
  }, [messagesData]);

  useEffect(() => {
    if (conversationsData?.length && !activeConversationId) {
      setActiveConversationId(conversationsData[0].id);
      setConversations(conversationsData);
    }
  }, [conversationsData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-65px)]">
      <div className="flex flex-1 overflow-hidden">
        <ConversationSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
        />
        <div className="flex-1">
          <ChatContainer
            messages={messages}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
