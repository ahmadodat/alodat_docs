"use client";

import { useState, useEffect } from "react";
import LoginPage from "@/components/LoginPage";
import RegisterPage from "@/components/RegisterPage";
import Dashboard from "@/components/Dashboard";

export type User = {
  userId: string;
  email: string;
};

export type Person = {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  avatar: string;
  birthDate: string | null;
};

export type Category = {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon: string;
  isDefault: boolean;
};

export type Document = {
  id: string;
  userId: string;
  personId: string | null;
  categoryId: string | null;
  categoryName: string;
  country: string;
  issueDate: string | null;
  expiryDate: string | null;
  documentNumber: string | null;
  notes: string | null;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      }
    } catch {
      // Not authenticated
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setView("login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (view === "register") {
      return (
        <RegisterPage
          onSuccess={(u) => setUser(u)}
          onSwitchToLogin={() => setView("login")}
        />
      );
    }
    return (
      <LoginPage
        onSuccess={(u) => setUser(u)}
        onSwitchToRegister={() => setView("register")}
      />
    );
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}
