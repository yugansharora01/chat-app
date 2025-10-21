import { send_message } from "@/API/apiservice";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import "@/styles/Home.css";
import React, { useState } from "react";

const Home = () => {
  const [typedMessage, setTypedMessage] = useState("");
  return (
    <div className="page">
      <div className="chatContainer">
        <div className="messagesBox"></div>
        <div className="chatFooter">
          <Input
            placeholder="Type your message here..."
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
          />
          <Button onClick={() => send_message(typedMessage)}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
