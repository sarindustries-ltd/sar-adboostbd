"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Facebook, LogOut, RefreshCw } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);

  const fetchPages = async () => {
    if (!session?.accessToken) return;
    
    setLoading(true);
    setError(null);
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
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while fetching pages');
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="p-6 border rounded-xl bg-white shadow-sm animate-pulse h-32"></div>;
  }

  if (session) {
    return (
      <div className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Facebook Business Connected</h2>
            <p className="text-sm text-slate-500">Logged in as {session.user?.name}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Disconnect
          </button>
        </div>

        <div className="mb-6">
          <button
            onClick={fetchPages}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? "Fetching Pages..." : "Fetch Managed Pages"}
          </button>
        </div>

        {error && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {pages.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wider">Your Pages</h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {pages.map((page) => (
                <li key={page.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-1">
                  <span className="font-semibold text-slate-900">{page.name}</span>
                  <span className="text-xs text-slate-500 font-mono">ID: {page.id}</span>
                  <span className="text-xs text-slate-500">{page.category}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {pages.length === 0 && !loading && !error && (
          <p className="text-sm text-slate-500 italic">No pages fetched yet. Click the button above to load your managed pages.</p>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm text-center">
      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Facebook className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">Connect Facebook Business</h2>
      <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
        Link your Facebook account to manage your pages, ad accounts, and boost your posts directly from this platform.
      </p>
      <button
        onClick={() => signIn('facebook')}
        className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#1877F2] rounded-lg hover:bg-[#166FE5] transition-colors"
      >
        <Facebook className="w-4 h-4" />
        Continue with Facebook
      </button>
    </div>
  );
}
