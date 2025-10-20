import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import "@/styles/Home.css";
import React from "react";

const Home = () => {
  return (
    <div className="page">
      <div className="chatContainer">
        <div></div>
        <div className="chatFooter">
          <Input placeholder="Type your message here..." />
          <Button>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
