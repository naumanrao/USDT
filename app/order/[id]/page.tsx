import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import CopyButton from "@/components/CopyButton";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const order = await prisma.order.findUnique({
        where: { id },
    });

    if (!order) {
        notFound();
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "PENDING":
                return {
                    bg: "bg-yellow-50 dark:bg-yellow-900/10",
                    text: "text-yellow-700 dark:text-yellow-400",
                    border: "border-yellow-200 dark:border-yellow-800",
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
            case "PAID":
                return {
                    bg: "bg-blue-50 dark:bg-blue-900/10",
                    text: "text-blue-700 dark:text-blue-400",
                    border: "border-blue-200 dark:border-blue-800",
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
            case "COMPLETED":
                return {
                    bg: "bg-green-50 dark:bg-green-900/10",
                    text: "text-green-700 dark:text-green-400",
                    border: "border-green-200 dark:border-green-800",
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )
                };
            default:
                return {
                    bg: "bg-gray-50",
                    text: "text-gray-700",
                    border: "border-gray-200",
                    icon: null
                };
        }
    };

    const styles = getStatusStyles(order.status);

    const statusMessages = {
        PENDING: { title: "Awaiting Payment", desc: "Please send the exact amount to complete your order." },
        PAID: { title: "Payment Received", desc: "We are verifying your transaction. USDT will be sent shortly." },
        COMPLETED: { title: "Order Completed", desc: "USDT has been sent to your wallet. Thank you!" },
    };

    const currentMessage = statusMessages[order.status as keyof typeof statusMessages];

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-zinc-900">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-900/5 dark:bg-zinc-800 dark:ring-white/10">
                {/* Header */}
                <div className={`px-6 py-8 text-center border-b ${styles.bg} ${styles.border} dark:border-opacity-20`}>
                    <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-sm mb-4 ${styles.text}`}>
                        {styles.icon}
                    </div>
                    <h2 className={`text-2xl font-bold ${styles.text}`}>
                        {currentMessage?.title || order.status}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 px-4">
                        {currentMessage?.desc}
                    </p>
                </div>

                {/* Body */}
                <div className="px-6 py-6 space-y-6">
                    <div className="space-y-4">
                        {/* Order ID */}
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-700/50">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Order ID</span>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-200">{order.id.slice(0, 12)}...</span>
                                <CopyButton text={order.id} label="Copy ID" />
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-700/50">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Amount</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">{order.amount} USDT</span>
                        </div>

                        {/* Network */}
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-700/50">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Network</span>
                            <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-zinc-700 dark:text-gray-300">
                                {order.network}
                            </span>
                        </div>

                        {/* Wallet */}
                        <div className="py-3 border-b border-gray-100 dark:border-zinc-700/50">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Receiving Wallet</span>
                                <CopyButton text={order.walletAddress} label="Copy" />
                            </div>
                            <p className="font-mono text-sm text-gray-900 dark:text-gray-200 break-all bg-gray-50 dark:bg-zinc-900/50 p-3 rounded border border-gray-100 dark:border-zinc-700 mt-2">
                                {order.walletAddress}
                            </p>
                        </div>

                        {/* Email */}
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{order.email}</span>
                        </div>
                    </div>

                    <div className="pt-4 text-center">
                        <Link href="/" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Start New Order
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
