"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Facebook, LogOut, RefreshCw, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

interface FacebookPage {
  id: string;
  name: string;
  category: string;
  access_token: string;
}

export function FacebookIntegration() {
  const { data: session, status } = useSession();
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPages = async () => {
    if (!session?.accessToken) return;
    
    setLoading(true);
    try {
      // Call our NestJS backend to fetch the pages
      const res = await fetch('/api/facebook/pages', {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch pages from backend');
      }
      
      const data = await res.json();
      setPages(data.data || []);
      toast.success("Pages fetched successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred while fetching pages');
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="p-6 bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] animate-pulse h-48 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (session) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]"
      >
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/40">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1877F2] to-[#0C5DC7] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Facebook className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Facebook Business</h2>
              <p className="text-sm text-slate-500">Connected as <span className="font-medium text-slate-700">{session.user?.name}</span></p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white/50 hover:bg-white/80 border border-white/60 rounded-xl transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Disconnect
          </button>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Managed Pages</h3>
          <button
            onClick={fetchPages}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? "Syncing..." : "Sync Pages"}
          </button>
        </div>

        {pages.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <motion.div 
                key={page.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex flex-col h-full">
                  <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{page.name}</span>
                  <span className="text-xs text-slate-500 mt-1">{page.category}</span>
                  <div className="mt-auto pt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono bg-slate-100/50 px-2 py-1 rounded-md">ID: {page.id}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white/30 rounded-2xl border border-white/40 border-dashed">
            <p className="text-sm text-slate-500">No pages synced yet. Click &quot;Sync Pages&quot; to load your managed pages.</p>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] text-center max-w-2xl mx-auto"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-[#1877F2] to-[#0C5DC7] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30">
        <Facebook className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-3">Connect Facebook Business</h2>
      <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
        Link your Facebook account to manage your pages, ad accounts, and boost your posts directly from this platform.
      </p>
      <button
        onClick={() => signIn('facebook')}
        className="inline-flex items-center gap-3 px-8 py-3.5 text-base font-semibold text-white bg-[#1877F2] rounded-xl hover:bg-[#166FE5] transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5"
      >
        <Facebook className="w-5 h-5" />
        Continue with Facebook
      </button>
      
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
        <AlertCircle className="w-4 h-4" />
        <span>We only request permissions necessary to manage your ads.</span>
      </div>
    </motion.div>
  );
}
