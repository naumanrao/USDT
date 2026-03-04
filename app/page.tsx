"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

/* ── Inline SVG icon components ───────────────────────── */

function ShieldIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}

/* ── Main page ───────────────────────────────────────── */

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

  const features = [
    { icon: <BoltIcon />, title: "Instant Delivery", desc: "Get USDT in your wallet within minutes" },
    { icon: <TagIcon />, title: "Low Fees", desc: "Competitive rates with transparent pricing" },
    { icon: <ShieldIcon />, title: "Secure", desc: "Bank-grade encryption & verified transactions" },
    { icon: <GlobeIcon />, title: "Global Access", desc: "Available in 160+ countries worldwide" },
  ];

  const handleBuy = async () => {
    if (amount < 10) {
      toast("Minimum amount is 10 USDT", "error");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push(`/checkout?amount=${amount}&network=${network}`);
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030014]">
      {/* ── Animated background ────────────────────────── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px] animate-float" />
        <div className="absolute -right-40 top-1/3 h-[400px] w-[400px] rounded-full bg-purple-600/20 blur-[120px] animate-float-slow" />
        <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-cyan-600/15 blur-[100px] animate-float" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Navbar ─────────────────────────────────────── */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-16">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
            <span className="text-lg font-bold text-white">₮</span>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            USDT<span className="text-indigo-400">Exchange</span>
          </span>
        </div>
        <Link
          href="/admin"
          className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-gray-300 backdrop-blur-sm transition-all hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-white"
        >
          Admin Portal
        </Link>
      </nav>

      {/* ── Main content ───────────────────────────────── */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 lg:px-16">
        <div className="flex min-h-[calc(100vh-88px)] flex-col items-center gap-12 py-12 lg:flex-row lg:items-center lg:gap-20 lg:py-0">

          {/* ── Left: Hero Section ──────────────────────── */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
              </span>
              Trusted by 10M+ users worldwide
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up-delay-1 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Buy{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                USDT
              </span>
              , join the
              <br />
              crypto revolution!
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-in-up-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-gray-400 lg:text-xl">
              ABC offers a fast and easy way to buy Tether (USDT) with a
              credit or debit card, bank transfer, Apple Pay, Google Pay, and
              more.
            </p>

            {/* Feature grid */}
            <div className="animate-fade-in-up-delay-3 mt-10 grid grid-cols-2 gap-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-sm transition-all hover:border-indigo-500/30 hover:bg-white/[0.06]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 transition-colors group-hover:from-indigo-500/30 group-hover:to-purple-500/30">
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{f.title}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment method icons */}
            <div className="animate-fade-in-up-delay-3 mt-8 flex flex-wrap items-center justify-center gap-5 lg:justify-start">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-600">
                Accepted payments
              </span>
              {["Visa", "Mastercard", "Apple Pay", "Google Pay", "Bank"].map(
                (method) => (
                  <span
                    key={method}
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:border-white/20 hover:text-gray-300"
                  >
                    {method}
                  </span>
                )
              )}
            </div>
          </div>

          {/* ── Right: Buying Widget ────────────────────── */}
          <div className="w-full max-w-md flex-shrink-0 animate-fade-in-up-delay-2">
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.05] p-8 shadow-2xl shadow-indigo-500/5 backdrop-blur-xl animate-pulse-glow">
              {/* Decorative gradient border glow */}
              <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-indigo-500/20 via-transparent to-purple-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Card header */}
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white">
                  Buy <span className="text-indigo-400">USDT</span>
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Fast, secure, and low fees
                </p>
              </div>

              <div className="space-y-5">
                {/* Amount Input */}
                <div>
                  <label
                    htmlFor="amount"
                    className="mb-1.5 block text-sm font-medium text-gray-300"
                  >
                    Amount (USDT)
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <span className="text-gray-500 text-sm">$</span>
                    </div>
                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      min="10"
                      required
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="block w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-8 pr-16 text-lg font-medium text-white placeholder-gray-600 outline-none transition-all focus:border-indigo-500/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="100"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                      <span className="rounded-md bg-indigo-500/15 px-2 py-0.5 text-xs font-semibold text-indigo-400">
                        USDT
                      </span>
                    </div>
                  </div>
                  {amount < 10 && amount > 0 && (
                    <p className="mt-1.5 text-sm text-red-400">
                      Minimum purchase is 10 USDT
                    </p>
                  )}
                </div>

                {/* Network Selection */}
                {/* <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Select Network
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {networks.map((net) => (
                      <div
                        key={net.id}
                        onClick={() => setNetwork(net.id)}
                        className={`cursor-pointer rounded-xl border px-4 py-3 transition-all duration-200 ${network === net.id
                          ? "border-indigo-500/60 bg-indigo-500/10 shadow-lg shadow-indigo-500/5 transform scale-[1.02]"
                          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span
                              className={`h-2.5 w-2.5 rounded-full mr-3 transition-colors ${network === net.id
                                ? "bg-indigo-400 shadow-sm shadow-indigo-400/50"
                                : "bg-gray-600"
                                }`}
                            />
                            <span className="font-medium text-white text-sm">
                              {net.name}
                            </span>
                          </div>
                          <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium text-gray-400">
                            Fee: {net.fee}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}

                {/* Buy Button */}
                <button
                  onClick={handleBuy}
                  disabled={loading || amount < 10}
                  className="relative mt-2 flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 px-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#030014] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  <span className="relative">
                    {loading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      `Buy ${amount || 0} USDT →`
                    )}
                  </span>
                </button>

                {/* Security note */}
                <p className="flex items-center justify-center gap-1.5 text-xs text-gray-600">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                  Secured with 256-bit SSL encryption
                </p>
              </div>
            </div>

            {/* Stats bar */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: "Users", value: "10M+" },
                { label: "Countries", value: "160+" },
                { label: "Uptime", value: "99.9%" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-3 text-center backdrop-blur-sm"
                >
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.06] mt-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-16 py-14">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-2">

            {/* Column 1 — Logo & About */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
                  <span className="text-lg font-bold text-white">₮</span>
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  USDT<span className="text-indigo-400">Exchange</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-500">
                USDT Exchange is a leading digital currency platform making it
                simple and secure for everyone to buy, sell, and manage
                cryptocurrency. We&apos;re on a mission to make crypto accessible
                to every person and business around the globe.
              </p>
              {/* Social icons */}
              <div className="mt-5 flex gap-3">
                {[
                  { label: "Twitter", path: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" },
                  { label: "LinkedIn", path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" },
                  { label: "Telegram", path: "M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-500 transition-all hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-400"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2 — Quick Links */}
            {/* <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {["How It Works", "Supported Networks", "Fee Schedule", "API Documentation", "Affiliate Program"].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-gray-500 transition-colors hover:text-indigo-400"
                      >
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div> */}

            {/* Column 3 — Contact */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                Contact Us
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-gray-500">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <span>support@usdtexchange.io</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-500">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <span>+1 (555) 928-4637</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-500">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span>1200 Blockchain Ave, Suite 400<br />San Francisco, CA 94107</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-500">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Mon – Fri: 9 AM – 6 PM (PST)<br />Weekend: 10 AM – 4 PM (PST)</span>
                </li>
              </ul>
            </div>

            {/* Column 4 — Help & Support */}
            {/* <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                Help & Support
              </h3>
              <ul className="space-y-3">
                {["Help Center", "FAQs", "Live Chat Support", "Submit a Ticket", "Community Forum"].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-gray-500 transition-colors hover:text-indigo-400"
                      >
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
              <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-semibold text-white">Need urgent help?</p>
                <p className="mt-1 text-xs text-gray-500">
                  Our live chat agents are available 24/7 for priority assistance.
                </p>
                <a
                  href="#"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-indigo-400 transition-colors hover:bg-indigo-500/25"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                  Start Live Chat
                </a>
              </div>
            </div> */}
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} USDT Exchange. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
                <a key={link} href="#" className="text-xs text-gray-600 transition-colors hover:text-indigo-400">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
