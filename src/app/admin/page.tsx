"use client";

import { useQuery } from "convex/react";
// Update the import path to the correct relative location
// Update the import path to the correct relative location
import { api } from "../../../convex/_generated/api";

interface User {
	_id: string;
	name: string;
	email: string;
	scope?: string[];
}

export default function AdminPage() {
	const users = useQuery(api.database.getUsers);

	return (
		<main className="p-8">
			<h1 className="text-2xl font-bold mb-6">Admin Console</h1>
			<table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
				<thead className="bg-gray-100">
					<tr>
						<th className="px-4 py-2 text-left">Name</th>
						<th className="px-4 py-2 text-left">Email</th>
						<th className="px-4 py-2 text-left">Scope</th>
					</tr>
				</thead>
				<tbody>
					{users?.map((user: User) => (
						<tr key={user._id} className="border-t">
							<td className="px-4 py-2">{user.name}</td>
							<td className="px-4 py-2">{user.email}</td>
							<td className="px-4 py-2">{user.scope?.join(", ") ?? "-"}</td>
						</tr>
					))}
				</tbody>
			</table>
		</main>
	);
}
