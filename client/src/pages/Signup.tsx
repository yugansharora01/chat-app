import React, { useState } from "react";
import supabase from "@/utils/supabaseClient";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage("Check your email to confirm signup!");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <form className="space-y-4" onSubmit={handleSignup}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Signup</Button>
      </form>
      {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
      <span>
        <p>Already have an account?</p>
        <a href="/login" className="text-blue-500 hover:underline">
          {" "}
          Login
        </a>
      </span>
    </div>
  );
}
