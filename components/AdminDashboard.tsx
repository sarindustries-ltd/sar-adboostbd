"use client";

import { useState, useEffect, useCallback } from "react";
import { DollarSign, TrendingUp, CheckCircle, Activity, AlertCircle, RefreshCw, Settings, ShieldCheck, ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { motion } from "motion/react";
import { signOut } from "next-auth/react";
import { Campaign } from "@/types";

export function AdminDashboard() {
  const [rate, setRate] = useState<number>(120);
  const [newRate, setNewRate] = useState<number | "">("");
  const [wallet, setWallet] = useState({ totalBdtCollected: 0, totalUsdSpent: 0 });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingRate, setUpdatingRate] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/wallet");
      if (!res.ok) throw new Error("Failed to fetch admin data");
      const data = await res.json();
      setWallet({ totalBdtCollected: data.totalBdtCollected, totalUsdSpent: data.totalUsdSpent });
      setRate(data.currentRate);
      setCampaigns(data.campaigns);
    } catch (error) {
      toast.error("Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateRate = async () => {
    if (!newRate || Number(newRate) <= 0) return;
    setUpdatingRate(true);
    try {
      const res = await fetch("/api/admin/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rate: Number(newRate) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update rate");
      
      setRate(data.rate);
      setNewRate("");
      toast.success("Global Exchange Rate updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUpdatingRate(false);
    }
  };

  const handleApprove = async (campaignId: string) => {
    setApprovingId(campaignId);
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to approve ad");
      
      // Refresh data to show updated wallet and campaign status
      await fetchData();
      toast.success("Ad approved and launched on Meta successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setApprovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 relative overflow-hidden">
      {/* Dark Glassmorphism Decorative Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-fuchsia-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '3s' }}></div>

      {/* Top Navigation Bar (Dark Glass) */}
      <header className="sticky top-0 z-30 bg-slate-900/50 backdrop-blur-xl border-b border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-fuchsia-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">AdBoost Admin</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-sm font-medium text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20 backdrop-blur-sm">System Token: Active</span>
            <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden shadow-sm relative">
              <Image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin Avatar" fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="p-2 bg-white/5 hover:bg-red-500/20 rounded-full transition-colors text-slate-400 hover:text-red-400"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Total BDT Collected */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-400">Master Wallet (BDT)</h3>
              <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">
              ৳ {wallet.totalBdtCollected.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-emerald-400 mt-2 flex items-center gap-1">
              <Activity className="w-4 h-4" /> Total Collected
            </p>
          </div>

          {/* Total USD Spent */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-400">Meta Ads Spent (USD)</h3>
              <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
                <DollarSign className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">
              $ {wallet.totalUsdSpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-slate-400 mt-2">Paid via Business Manager</p>
          </div>

          {/* Global Rate Settings */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-400">Global Exchange Rate</h3>
              <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                <Settings className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-white">৳ {rate}</span>
              <span className="text-sm text-slate-400">/ 1 USD</span>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="New Rate"
                value={newRate}
                onChange={(e) => setNewRate(Number(e.target.value) || "")}
                className="block w-full rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <button
                onClick={handleUpdateRate}
                disabled={!newRate || updatingRate}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-500 disabled:opacity-50 transition-colors whitespace-nowrap shadow-lg shadow-indigo-500/20"
              >
                {updatingRate ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Pending Campaigns Table (Dark Glass) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">Ad Approval Queue</h2>
            <p className="text-sm text-slate-400 mt-1">Review and approve user campaigns to trigger Meta API.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  <th className="px-6 py-4">Campaign ID</th>
                  <th className="px-6 py-4">Page Name</th>
                  <th className="px-6 py-4">Requested Budget</th>
                  <th className="px-6 py-4">User Charged</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-white">{campaign.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-slate-300">{campaign.pageName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-white font-medium">${campaign.budgetUsd.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-indigo-400 font-medium">৳ {campaign.userBdtCharged.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {campaign.status === "pending" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-300 bg-amber-500/20 border border-amber-500/30 rounded-full backdrop-blur-sm">
                          <AlertCircle className="w-3.5 h-3.5" /> Pending Approval
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 rounded-full backdrop-blur-sm">
                          <CheckCircle className="w-3.5 h-3.5" /> Active on Meta
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {campaign.status === "pending" && (
                        <button
                          onClick={() => handleApprove(campaign.id)}
                          disabled={approvingId === campaign.id}
                          className="inline-flex items-center justify-center px-4 py-2 bg-white text-slate-900 text-sm font-bold rounded-xl hover:bg-slate-200 disabled:opacity-50 transition-colors shadow-lg"
                        >
                          {approvingId === campaign.id ? "Approving..." : "Approve Ad"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {campaigns.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      No campaigns found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
