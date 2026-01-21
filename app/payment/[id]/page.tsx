"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/orders/${id}/pay`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Payment failed");
            }

            router.push(`/order/${id}`);
        } catch (error) {
            console.error(error);
            alert("Payment simulation failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-900">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-2xl dark:bg-zinc-800 text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    Payment Gateway
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                    This is a simulated payment page.
                </p>

                <div className="mt-8">
                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full rounded-md bg-green-600 py-3 px-4 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Simulate Successful Payment"}
                    </button>
                </div>
            </div>
        </div>
    );
}
