"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

interface Order {
    id: string;
    amount: string;
    network: string;
    email: string;
    walletAddress: string;
    status: string;
    createdAt: string;
}

interface AdminUser {
    id: string;
    username: string;
    createdAt: string;
}

export default function AdminPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState<{ userId: string; username: string } | null>(null);
    const [authChecked, setAuthChecked] = useState(false);
    const [activeTab, setActiveTab] = useState<"orders" | "users">("orders");

    // Orders state
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Users state
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [addingUser, setAddingUser] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

    // ── Auth check ────────────────────────────────────
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    setCurrentUser(data.user);
                } else {
                    router.push("/admin/login");
                    return;
                }
            } catch {
                router.push("/admin/login");
                return;
            }
            setAuthChecked(true);
        };
        checkAuth();
    }, [router]);

    // ── Fetch orders ──────────────────────────────────
    const fetchOrders = useCallback(async () => {
        setLoadingOrders(true);
        try {
            const res = await fetch("/api/admin/orders");
            if (res.ok) {
                const data = await res.json();
                setOrders(
                    data.sort(
                        (a: Order, b: Order) =>
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )
                );
            } else {
                toast("Failed to fetch orders", "error");
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
            toast("Network error while fetching orders", "error");
        } finally {
            setLoadingOrders(false);
        }
    }, [toast]);

    // ── Fetch users ───────────────────────────────────
    const fetchUsers = useCallback(async () => {
        setLoadingUsers(true);
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                toast("Failed to fetch users", "error");
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
            toast("Network error while fetching users", "error");
        } finally {
            setLoadingUsers(false);
        }
    }, [toast]);

    useEffect(() => {
        if (authChecked) fetchOrders();
    }, [authChecked, fetchOrders]);

    useEffect(() => {
        if (authChecked && activeTab === "users") fetchUsers();
    }, [authChecked, activeTab, fetchUsers]);

    // ── Order actions ─────────────────────────────────
    const handleComplete = async (id: string) => {
        if (!confirm("Are you sure you want to mark this order as COMPLETED?"))
            return;

        setProcessingId(id);
        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "COMPLETED" }),
            });

            if (res.ok) {
                setOrders((prev) =>
                    prev.map((o) =>
                        o.id === id ? { ...o, status: "COMPLETED" } : o
                    )
                );
                toast("Order marked as COMPLETED", "success");
            } else {
                toast("Failed to update status", "error");
            }
        } catch (error) {
            console.error("Failed to update status", error);
            toast("Network error updating status", "error");
        } finally {
            setProcessingId(null);
        }
    };

    // ── User actions ──────────────────────────────────
    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUsername || !newPassword) {
            toast("Username and password are required", "error");
            return;
        }

        setAddingUser(true);
        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: newUsername, password: newPassword }),
            });

            const data = await res.json();
            if (res.ok) {
                toast(`User '${data.username}' created successfully`, "success");
                setNewUsername("");
                setNewPassword("");
                fetchUsers();
            } else {
                toast(data.error || "Failed to create user", "error");
            }
        } catch {
            toast("Network error creating user", "error");
        } finally {
            setAddingUser(false);
        }
    };

    const handleDeleteUser = async (id: string, username: string) => {
        if (!confirm(`Are you sure you want to delete user '${username}'?`)) return;

        setDeletingUserId(id);
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast(`User '${username}' deleted`, "success");
                setUsers((prev) => prev.filter((u) => u.id !== id));
            } else {
                const data = await res.json();
                toast(data.error || "Failed to delete user", "error");
            }
        } catch {
            toast("Network error deleting user", "error");
        } finally {
            setDeletingUserId(null);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/admin/login");
        } catch {
            toast("Error logging out", "error");
        }
    };

    // ── Status badge color ────────────────────────────
    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
            case "PAID":
                return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
            case "COMPLETED":
                return "bg-green-500/10 text-green-400 border border-green-500/20";
            default:
                return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
        }
    };

    // ── Loading state ─────────────────────────────────
    if (!authChecked) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#030014]">
                <div className="flex items-center gap-3 text-gray-400">
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Verifying authentication...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030014]">
            {/* Header */}
            <div className="border-b border-white/[0.06]">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
                            <span className="text-lg font-bold text-white">₮</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
                            <p className="text-xs text-gray-500">
                                Logged in as{" "}
                                <span className="text-indigo-400 font-medium">
                                    {currentUser?.username}
                                </span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                        Logout
                    </button>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
                {/* Tabs */}
                <div className="mb-6 flex gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1 w-fit">
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${activeTab === "orders"
                                ? "bg-indigo-500/15 text-indigo-400 shadow-sm"
                                : "text-gray-500 hover:text-gray-300"
                            }`}
                    >
                        Orders
                    </button>
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${activeTab === "users"
                                ? "bg-indigo-500/15 text-indigo-400 shadow-sm"
                                : "text-gray-500 hover:text-gray-300"
                            }`}
                    >
                        User Management
                    </button>
                </div>

                {/* ═══════════════  ORDERS TAB  ═══════════════ */}
                {activeTab === "orders" && (
                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">
                                Recent Orders
                            </h2>
                            <button
                                onClick={() => fetchOrders()}
                                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:border-white/20 hover:bg-white/[0.08]"
                            >
                                <svg
                                    className={`h-4 w-4 ${loadingOrders ? "animate-spin" : ""}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                Refresh
                            </button>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-white/[0.06]">
                                    <thead>
                                        <tr className="bg-white/[0.03]">
                                            <th className="py-3 pl-5 pr-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                ID / Date
                                            </th>
                                            <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Customer
                                            </th>
                                            <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Order Details
                                            </th>
                                            <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>
                                            <th className="py-3 pl-3 pr-5 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.04]">
                                        {loadingOrders && orders.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="py-12 text-center text-sm text-gray-500"
                                                >
                                                    <svg className="mx-auto mb-2 h-5 w-5 animate-spin text-gray-600" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Loading orders...
                                                </td>
                                            </tr>
                                        ) : orders.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="py-12 text-center text-sm text-gray-500"
                                                >
                                                    No orders found.
                                                </td>
                                            </tr>
                                        ) : (
                                            orders.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="transition-colors hover:bg-white/[0.03]"
                                                >
                                                    <td className="whitespace-nowrap py-3.5 pl-5 pr-3 text-sm">
                                                        <div className="text-xs text-gray-600 mb-0.5">
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </div>
                                                        <div
                                                            className="font-mono text-xs text-gray-400"
                                                            title={order.id}
                                                        >
                                                            {order.id.slice(0, 8)}...
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-3.5 text-sm">
                                                        <div className="font-medium text-white">
                                                            {order.email}
                                                        </div>
                                                        <div
                                                            className="text-xs text-gray-600 font-mono truncate max-w-[150px]"
                                                            title={order.walletAddress}
                                                        >
                                                            {order.walletAddress}
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-3.5 text-sm">
                                                        <div className="font-medium text-white">
                                                            {order.amount} USDT
                                                        </div>
                                                        <div className="text-xs text-gray-600">
                                                            {order.network}
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-3.5 text-sm">
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                                                                order.status
                                                            )}`}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap py-3.5 pl-3 pr-5 text-right text-sm">
                                                        {order.status === "PAID" && (
                                                            <button
                                                                onClick={() => handleComplete(order.id)}
                                                                disabled={processingId === order.id}
                                                                className="text-indigo-400 hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-xs"
                                                            >
                                                                {processingId === order.id
                                                                    ? "Processing..."
                                                                    : "Mark Completed"}
                                                            </button>
                                                        )}
                                                        {order.status === "PENDING" && (
                                                            <span className="text-gray-600 text-xs italic">
                                                                Awaiting Payment
                                                            </span>
                                                        )}
                                                        {order.status === "COMPLETED" && (
                                                            <span className="flex items-center justify-end gap-1 text-xs font-medium text-green-500">
                                                                <svg
                                                                    className="h-3.5 w-3.5"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M5 13l4 4L19 7"
                                                                    />
                                                                </svg>
                                                                Done
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════  USERS TAB  ═══════════════ */}
                {activeTab === "users" && (
                    <div className="space-y-6">
                        {/* Add user form */}
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
                            <h3 className="mb-4 text-sm font-semibold text-white">
                                Add New Admin User
                            </h3>
                            <form
                                onSubmit={handleAddUser}
                                className="flex flex-col gap-3 sm:flex-row sm:items-end"
                            >
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-medium text-gray-500">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                                        placeholder="Enter username"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-medium text-gray-500">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                                        placeholder="Enter password (min 6 chars)"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={addingUser}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-all hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    {addingUser ? (
                                        <>
                                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                            Add User
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Users table */}
                        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
                            <div className="flex items-center justify-between bg-white/[0.03] px-5 py-3">
                                <h3 className="text-sm font-semibold text-white">
                                    Admin Users ({users.length})
                                </h3>
                                <button
                                    onClick={fetchUsers}
                                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    Refresh
                                </button>
                            </div>
                            <div className="divide-y divide-white/[0.04]">
                                {loadingUsers ? (
                                    <div className="py-10 text-center text-sm text-gray-500">
                                        Loading users...
                                    </div>
                                ) : users.length === 0 ? (
                                    <div className="py-10 text-center text-sm text-gray-500">
                                        No users found.
                                    </div>
                                ) : (
                                    users.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-white/[0.03]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">
                                                        {user.username}
                                                        {user.id === currentUser?.userId && (
                                                            <span className="ml-2 rounded-full bg-indigo-500/15 px-2 py-0.5 text-[10px] font-medium text-indigo-400">
                                                                You
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        Created{" "}
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            {user.id !== currentUser?.userId && (
                                                <button
                                                    onClick={() =>
                                                        handleDeleteUser(user.id, user.username)
                                                    }
                                                    disabled={deletingUserId === user.id}
                                                    className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-all hover:border-red-500/40 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {deletingUserId === user.id ? "Deleting..." : "Delete"}
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
