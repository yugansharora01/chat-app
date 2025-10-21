import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import styles from "@/styles/Home.module.css";
import React from "react";

const Home = () => {
  return (
    <div className={styles.page}>
      <div className={styles.chatContainer}>
        <div></div>
        <div className={styles.chatFooter}>
          <Input placeholder="Type your message here..." />
          <Button>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
