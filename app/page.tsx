import Link from "next/link";
import { Rocket, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative overflow-hidden flex flex-col">
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>

      {/* Header */}
      <header className="relative z-30 bg-white/40 backdrop-blur-xl border-b border-white/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">AdBoost BD</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/login?role=admin"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Login
            </Link>
            <Link 
              href="/login"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors shadow-md shadow-indigo-500/20"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Boost Your Facebook Ads in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Bangladesh</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The simplest way to launch and manage Facebook ad campaigns using local payment methods like bKash, Nagad, and SSLCommerz.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-medium px-8 py-4 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl shadow-indigo-500/25"
            >
              Start Boosting Now <Rocket className="w-5 h-5" />
            </Link>
          </div>

          <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Local Payments</h3>
              <p className="text-slate-600">Pay seamlessly with bKash, Nagad, or Cards in BDT.</p>
            </div>
            <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-indigo-500 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Sync</h3>
              <p className="text-slate-600">Connect your Facebook pages and launch ads instantly.</p>
            </div>
            <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Transparent Fees</h3>
              <p className="text-slate-600">Clear exchange rates and no hidden charges.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
