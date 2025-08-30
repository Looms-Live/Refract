"use client";

import { useQuery } from "convex/react";
// Update the import path to the correct relative location
// Update the import path to the correct relative location
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

interface User {
	_id: string;
	name: string;
	email: string;
	scope?: string[];
}

export default function AdminPage() {
	const users = useQuery(api.database.getUsers);
	const { isSignedIn, user, isLoaded } = useUser();

	const isAdmin = user?.publicMetadata?.role === "admin";

	if (!isLoaded) {
		return <main className="p-8 text-center">Loading...</main>;
	}

	if (!isSignedIn || !isAdmin) {
		return (
			<main className="p-8 text-center">
				<h1 className="text-2xl font-bold mb-6 text-red-500">Access Denied</h1>
				<p className="text-gray-500">You do not have permission to view this page.</p>
			</main>
		);
	}

	return (
		<main className="p-8">
			<h1 className="text-2xl font-bold mb-6">Admin Console</h1>
			<table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
				<thead className="bg-gray-100">
					<tr>
						<th className="px-4 py-2 text-left text-black">Name</th>
						<th className="px-4 py-2 text-left text-black">Email</th>
						<th className="px-4 py-2 text-left text-black">Scope</th>
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
