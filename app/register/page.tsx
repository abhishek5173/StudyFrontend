"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function RegisterPage() {
  const router = useRouter();
  const { login, token, loading } = useAuth();

  const [form, setform] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, seterror] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setform({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    seterror("");
    try {
      const response = await axiosInstance.post("/auth/register", form);
      const token = response.data.token;
      login(token);
      router.push("/dashboard");
    } catch (err: any) {
      seterror(err.response?.data?.message || "Registration failed");
    }
  };

  

  useEffect(() => {
    if (!loading && token) {
      router.push("/dashboard");
    }
  }, [token, loading]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen w-screen">Loading...</div>; // or return null
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
