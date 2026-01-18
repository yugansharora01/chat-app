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
import { useSidebar } from "@/context/SidebarContext";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { isMobile, open, setOpen } = useSidebar();
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
      files,
      conversationId,
    }: {
      text: string;
      files?: File[];
      conversationId: string;
    }) => send_message(text, conversationId, files),

    onMutate: async ({ text, files }) => {
      setIsTyping(true);

      const newMessage = {
        id: Date.now().toString(),
        userId: "user",
        content: text || "",
        role: MessageRole.user,
        timeStamp: new Date().toISOString(),
        isTemporary: true,
        files: files
          ? files.map((file) => ({
              file_name: file.name,
              file_url: URL.createObjectURL(file),
            }))
          : null, // for temporary UI
      };

      queryClient.setQueryData(
        ["messages", activeConversationId],
        (oldData: any) => ({
          messages: [...(oldData?.messages || []), newMessage],
        })
      );
    },

    onSuccess: (response) => {
      const prevMessages = messages;

      // remove temporary message
      if (
        prevMessages.length > 0 &&
        prevMessages[prevMessages.length - 1].isTemporary
      ) {
        prevMessages.pop();
      }

      // backend returns: [user_msg, ai_msg]
      queryClient.setQueryData(["messages", activeConversationId], {
        messages: [...prevMessages, ...response.messages],
      });

      setIsTyping(false);
    },
  });

  const handleSendMessage = (text: string, files?: File[]) => {
    if (!activeConversationId) return;
    const conversation_id = activeConversation?.is_temporary
      ? ""
      : activeConversationId;
    sendMessageMutation.mutate({
      text,
      conversationId: conversation_id,
      files: files,
    });
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
    setMessages([]);
    setActiveConversationId(newConversation.id);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    if (isMobile) {
      setOpen(false);
    }
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
    <div className="flex flex-col h-[calc(100dvh-65px)]">
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && (
          <ConversationSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            onNewChat={handleNewChat}
          />
        )}
        {isMobile && (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="left" className="p-0 w-[17rem]">
              <ConversationSidebar
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={handleSelectConversation}
                onNewChat={handleNewChat}
                className="w-full border-none"
              />
            </SheetContent>
          </Sheet>
        )}
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
