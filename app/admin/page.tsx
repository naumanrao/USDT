"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";

interface Order {
    id: string;
    amount: number;
    network: string;
    email: string;
    walletAddress: string;
    status: string;
    createdAt: string;
}

export default function AdminPage() {
    const { toast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/orders");
            if (res.ok) {
                const data = await res.json();
                // Sort by newest first
                setOrders(data.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            } else {
                toast("Failed to fetch orders", "error");
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
            toast("Network error while fetching orders", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (id: string) => {
        if (!confirm("Are you sure you want to mark this order as COMPLETED?")) return;

        setProcessingId(id);
        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "COMPLETED" }),
            });

            if (res.ok) {
                setOrders((prev) =>
                    prev.map((o) => (o.id === id ? { ...o, status: "COMPLETED" } : o))
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800";
            case "PAID":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800";
            case "COMPLETED":
                return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 dark:bg-zinc-900">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Admin Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Manage and process user orders.
                        </p>
                    </div>
                    <button
                        onClick={() => fetchOrders()}
                        className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 border border-gray-300 dark:bg-zinc-800 dark:text-gray-200 dark:border-zinc-700 dark:hover:bg-zinc-700 transition"
                    >
                        <svg className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-zinc-800 dark:ring-white/10">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                            <thead className="bg-gray-50 dark:bg-zinc-800/50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 sm:pl-6">ID / Date</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Customer</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Order Details</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-zinc-700 dark:bg-zinc-800">
                                {loading && orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                                            Loading orders...
                                        </td>
                                    </tr>
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No orders found.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                                                <div className="font-mono text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </div>
                                                <div title={order.id}>{order.id.slice(0, 8)}...</div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                                <div className="text-gray-900 dark:text-white font-medium">{order.email}</div>
                                                <div className="text-xs text-gray-400 font-mono truncate max-w-[150px]" title={order.walletAddress}>
                                                    {order.walletAddress}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                                <div className="font-medium text-gray-900 dark:text-white">{order.amount} USDT</div>
                                                <div className="text-xs text-gray-400">{order.network}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                {order.status === "PAID" && (
                                                    <button
                                                        onClick={() => handleComplete(order.id)}
                                                        disabled={processingId === order.id}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {processingId === order.id ? "Processing..." : "Mark Completed"}
                                                    </button>
                                                )}
                                                {order.status === "PENDING" && (
                                                    <span className="text-gray-400 text-xs italic">Awaiting Payment</span>
                                                )}
                                                {order.status === "COMPLETED" && (
                                                    <span className="text-green-600 dark:text-green-500 text-xs font-medium flex items-center justify-end gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
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
        </div>
    );
}
