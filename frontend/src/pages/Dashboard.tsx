import React from "react";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.firstName}!</h1>
      <p>Dashboard content goes here.</p>
      <button onClick={()=>{ localStorage.removeItem("user"); window.location.href="/login"; }} className="mt-4 p-2 bg-red-500 text-white rounded">Logout</button>
    </div>
  );
}
