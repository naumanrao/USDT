"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [amount, setAmount] = useState(100);
  const [network, setNetwork] = useState("TRC20");
  const [loading, setLoading] = useState(false);

  const networks = [
    { id: "TRC20", name: "TRON (TRC20)", fee: "$1" },
    { id: "ERC20", name: "Ethereum (ERC20)", fee: "$10" },
    { id: "BEP20", name: "BSC (BEP20)", fee: "$0.5" },
  ];

  const handleBuy = async () => {
    if (amount < 10) {
      toast("Minimum amount is 10 USDT", "error");
      return;
    }

    setLoading(true);
    // Simulate a brief delay for effect
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push(`/checkout?amount=${amount}&network=${network}`);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-zinc-900">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl ring-1 ring-gray-900/5 dark:bg-zinc-800 dark:ring-white/10 transition-all hover:shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-2">
            Buy <span className="text-indigo-600 dark:text-indigo-400">USDT</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Fast, secure, and low fees.
          </p>
        </div>

        <div className="space-y-6">
          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount (USDT)
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                id="amount"
                name="amount"
                type="number"
                min="10"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="block w-full rounded-lg border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white sm:text-lg py-3"
                placeholder="100"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm">USDT</span>
              </div>
            </div>
            {amount < 10 && amount > 0 && (
              <p className="mt-1 text-sm text-red-600">Minimum purchase is 10 USDT</p>
            )}
          </div>

          {/* Network Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Network
            </label>
            <div className="grid grid-cols-1 gap-3">
              {networks.map((net) => (
                <div
                  key={net.id}
                  onClick={() => setNetwork(net.id)}
                  className={`cursor-pointer rounded-xl border px-4 py-3 shadow-sm transition-all duration-200 ${network === net.id
                      ? "border-indigo-500 ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 transform scale-[1.02]"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`h-2 w-2 rounded-full mr-3 ${network === net.id ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-zinc-600'}`}></span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {net.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded">
                      Fee: {net.fee}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buy Button */}
          <button
            onClick={handleBuy}
            disabled={loading || amount < 10}
            className="flex w-full items-center justify-center rounded-lg border border-transparent bg-indigo-600 py-3.5 px-4 text-base font-semibold text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              `Buy ${amount || 0} USDT`
            )}
          </button>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <Link href="/admin" className="hover:text-gray-900 dark:hover:text-white transition-colors underline decoration-dotted">
          Admin Access
        </Link>
      </div>
    </div>
  );
}
