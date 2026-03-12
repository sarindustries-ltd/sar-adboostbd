"use client";

import { useState, useEffect, useCallback } from "react";
import { Wallet, Rocket, CheckCircle2, Clock, AlertCircle, ChevronDown, Activity, ShieldCheck, Plus, X, CreditCard, Smartphone, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { signOut } from "next-auth/react";
import { Campaign, Page } from "@/types";
import { FacebookIntegration } from "./FacebookIntegration";

export function Dashboard() {
  const [balanceBdt, setBalanceBdt] = useState(0);
  const [pages, setPages] = useState<Page[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [exchangeRate, setExchangeRate] = useState(120);
  const [feePercentage, setFeePercentage] = useState(0.15);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedPage, setSelectedPage] = useState("");
  const [usdBudget, setUsdBudget] = useState<number | "">("");
  const [calculatedBdt, setCalculatedBdt] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);

  // Top Up Modal State
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "sslcommerz">("bkash");
  const [isProcessingTopUp, setIsProcessingTopUp] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/user/data");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setBalanceBdt(data.wallet.balanceBdt);
      setPages(data.pages);
      setCampaigns(data.campaigns);
      setExchangeRate(data.rate);
      setFeePercentage(data.feePercentage);
      if (data.pages.length > 0 && !selectedPage) {
        setSelectedPage(data.pages[0].id);
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, [selectedPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate BDT whenever USD budget changes
  useEffect(() => {
    const budget = Number(usdBudget) || 0;
    const baseBdt = budget * exchangeRate;
    const fees = baseBdt * feePercentage;
    setCalculatedBdt(baseBdt + fees);
  }, [usdBudget, exchangeRate, feePercentage]);

  const handleLaunch = async () => {
    if (!usdBudget || Number(usdBudget) <= 0) return;
    
    setIsLaunching(true);
    try {
      const res = await fetch("/api/user/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId: selectedPage, budgetUsd: Number(usdBudget) }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to launch campaign");
      
      setBalanceBdt(data.balanceBdt);
      setCampaigns([data.campaign, ...campaigns]);
      setUsdBudget("");
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLaunching(false);
    }
  };

  const handleTopUp = async () => {
    if (!topUpAmount || Number(topUpAmount) <= 0) return;
    setIsProcessingTopUp(true);
    
    try {
      const res = await fetch("/api/user/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(topUpAmount), method: paymentMethod }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Top-up failed");
      
      setBalanceBdt(data.balanceBdt);
      setIsTopUpModalOpen(false);
      setTopUpAmount("");
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessingTopUp(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-500/20 border border-emerald-200/50 rounded-full backdrop-blur-md">
            <Activity className="w-3.5 h-3.5" /> Active
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-500/10 border border-slate-200/50 rounded-full backdrop-blur-md">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-500/20 border border-amber-200/50 rounded-full backdrop-blur-md">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative overflow-hidden">
      {/* Decorative Background Blobs for Glassmorphism */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>

      {/* Top Navigation Bar (Glassmorphic) */}
      <header className="sticky top-0 z-30 bg-white/40 backdrop-blur-xl border-b border-white/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">AdBoost BD</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/admin"
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Panel
            </Link>
            <div className="flex items-center gap-3 px-2 py-1.5 bg-white/50 backdrop-blur-md border border-white/60 shadow-sm rounded-full">
              <div className="flex items-center gap-2 pl-2">
                <Wallet className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-bold text-slate-800">
                  ৳ {balanceBdt.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <button 
                onClick={() => setIsTopUpModalOpen(true)}
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors shadow-md shadow-indigo-500/20"
              >
                <Plus className="w-3 h-3" /> Top Up
              </button>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden relative">
              <Image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User Avatar" fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="p-2 bg-slate-100 hover:bg-red-50 rounded-full transition-colors text-slate-400 hover:text-red-500"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          
          {/* Left Column: Quick Boost Form (Glassmorphic) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/40">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-indigo-600" />
                  Quick Boost
                </h2>
                <p className="text-sm text-slate-500 mt-1">Launch a new ad campaign instantly.</p>
              </div>
              
              <div className="p-6 space-y-5">
                {/* Select Page */}
                <div className="space-y-2">
                  <label htmlFor="page" className="block text-sm font-medium text-slate-700">
                    Select Facebook Page
                  </label>
                  <div className="relative">
                    <select
                      id="page"
                      value={selectedPage}
                      onChange={(e) => setSelectedPage(e.target.value)}
                      className="block w-full appearance-none rounded-xl border border-white/60 bg-white/50 backdrop-blur-sm px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                    >
                      {pages.map((page) => (
                        <option key={page.id} value={page.id}>
                          {page.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                {/* Input USD Budget */}
                <div className="space-y-2">
                  <label htmlFor="budget" className="block text-sm font-medium text-slate-700">
                    Daily Budget (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                    <input
                      type="number"
                      id="budget"
                      min="1"
                      placeholder="0.00"
                      value={usdBudget}
                      onChange={(e) => setUsdBudget(Number(e.target.value) || "")}
                      className="block w-full rounded-xl border border-white/60 bg-white/50 backdrop-blur-sm pl-8 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* Calculation Display */}
                <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 border border-white/60 shadow-inner space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Base Amount (x{exchangeRate})</span>
                    <span className="font-medium text-slate-800">৳ {((Number(usdBudget) || 0) * exchangeRate).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">VAT & Fees ({(feePercentage * 100).toFixed(0)}%)</span>
                    <span className="font-medium text-slate-800">৳ {((Number(usdBudget) || 0) * exchangeRate * feePercentage).toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t border-white/50 flex justify-between items-center">
                    <span className="font-semibold text-slate-900">Total BDT</span>
                    <span className="text-lg font-bold text-indigo-700">৳ {calculatedBdt.toFixed(2)}</span>
                  </div>
                </div>

                {/* Warning if insufficient balance */}
                {calculatedBdt > balanceBdt && (
                  <div className="flex items-start gap-2 p-3 bg-red-500/10 backdrop-blur-md text-red-700 rounded-xl border border-red-200/50 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>Insufficient BDT balance. Please top up your wallet.</p>
                  </div>
                )}

                {/* Launch Button */}
                <button
                  onClick={handleLaunch}
                  disabled={!usdBudget || calculatedBdt > balanceBdt || isLaunching}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLaunching ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Rocket className="w-4 h-4" />
                      Launch Campaign
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Active Campaigns Table (Glassmorphic) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Facebook Integration */}
            <FacebookIntegration />

            <div className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/40 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Campaign Overview</h2>
                  <p className="text-sm text-slate-500 mt-1">Monitor your active and recent ad campaigns.</p>
                </div>
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/60 shadow-sm transition-colors">
                  View All
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/30 border-b border-white/40 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="px-6 py-4">Campaign ID</th>
                      <th className="px-6 py-4">Page</th>
                      <th className="px-6 py-4">Budget (USD)</th>
                      <th className="px-6 py-4">Spent (USD)</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/40">
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-white/40 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-slate-900">{campaign.id}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-slate-700">{campaign.pageName}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-slate-900 font-medium">${campaign.budgetUsd.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-700">${campaign.spentUsd.toFixed(2)}</span>
                            <div className="w-16 h-1.5 bg-slate-200/50 rounded-full overflow-hidden backdrop-blur-sm">
                              <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" 
                                style={{ width: `${(campaign.spentUsd / campaign.budgetUsd) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(campaign.status)}
                        </td>
                      </tr>
                    ))}
                    {campaigns.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                          No campaigns found. Launch your first ad!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </motion.div>
      </main>

      {/* Top Up Modal (Glassmorphism + Framer Motion) */}
      <AnimatePresence>
        {isTopUpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
              onClick={() => setIsTopUpModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-3xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-indigo-600" />
                  Top Up Wallet
                </h3>
                <button 
                  onClick={() => setIsTopUpModalOpen(false)}
                  className="p-2 bg-slate-100/50 hover:bg-slate-200/50 rounded-full text-slate-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Amount Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Amount (BDT)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">৳</span>
                    <input
                      type="number"
                      min="100"
                      placeholder="5,000"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(Number(e.target.value) || "")}
                      className="block w-full rounded-xl border border-white/60 bg-white/50 backdrop-blur-sm pl-8 pr-4 py-3 text-lg font-medium text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Payment Method</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setPaymentMethod("bkash")}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                        paymentMethod === "bkash" 
                          ? "bg-pink-50/80 border-pink-500 text-pink-700 shadow-sm shadow-pink-500/20" 
                          : "bg-white/50 border-white/60 text-slate-600 hover:bg-white/80"
                      }`}
                    >
                      <Smartphone className="w-6 h-6" />
                      <span className="text-xs font-semibold">bKash</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("nagad")}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                        paymentMethod === "nagad" 
                          ? "bg-orange-50/80 border-orange-500 text-orange-700 shadow-sm shadow-orange-500/20" 
                          : "bg-white/50 border-white/60 text-slate-600 hover:bg-white/80"
                      }`}
                    >
                      <Smartphone className="w-6 h-6" />
                      <span className="text-xs font-semibold">Nagad</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("sslcommerz")}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                        paymentMethod === "sslcommerz" 
                          ? "bg-indigo-50/80 border-indigo-500 text-indigo-700 shadow-sm shadow-indigo-500/20" 
                          : "bg-white/50 border-white/60 text-slate-600 hover:bg-white/80"
                      }`}
                    >
                      <CreditCard className="w-6 h-6" />
                      <span className="text-xs font-semibold">Cards/Net</span>
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleTopUp}
                  disabled={!topUpAmount || isProcessingTopUp}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-900 text-white font-medium py-3 px-4 rounded-xl hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-500/30 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingTopUp ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Proceed to Pay ৳{Number(topUpAmount || 0).toLocaleString("en-IN")}</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

