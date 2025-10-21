import { get_all_messages, send_message } from "@/API/apiservice";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Message } from "@/types";
import "@/styles/Home.css";
import React, { useEffect, useState } from "react";

const Home = () => {
  const [typedMessage, setTypedMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextCursor, setNextCursor] = useState("");

  const fetchMessages = async () => {
    const response = await get_all_messages(nextCursor);
    if(nextCursor){
      setMessages((prevMessages) => [...response.messages, ...prevMessages]);
    }else{
      setMessages(response.messages);
    }
    setNextCursor(response.meta.next_cursor);
  };

  const sendMessage = async () => {
    const response = await send_message(typedMessage);
    setMessages((prevMessages) => [...prevMessages, ...response.messages]);
    setTypedMessage("");
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="page">
      <div className="chatContainer">
        <div className="messagesContainer">
          <Button onClick={fetchMessages}>Load More</Button>
          {messages &&
            messages.map((msg) => {
              return (
                <div key={msg.id} className="messageBox">
                  <p>{msg.role}:</p><p>{msg.content}</p>
                </div>
              );
            })}
        </div>
        <div className="chatFooter">
          <Input
            placeholder="Type your message here..."
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
          />
          <Button onClick={() => sendMessage()}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
