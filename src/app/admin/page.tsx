import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

// Define the User type according to your data structure
interface User {
  _id: string;
  name: string;
  email: string;
  scope: string[];
}

export default function AdminPage() {
  // Fetch users from Convex
  const users = useQuery(api.users.list) ?? [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Console: User Management</h1>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Email</th>
            <th className="px-4 py-2 border-b">Scope</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{user.name}</td>
              <td className="px-4 py-2 border-b">{user.email}</td>
              <td className="px-4 py-2 border-b">
                {user.scope && user.scope.length > 0
                  ? user.scope.join(", ")
                  : <span className="italic text-gray-400">None</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
