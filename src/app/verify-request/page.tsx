import { motion } from "framer-motion";

export default function VerifyRequest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-90 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black text-white p-4">
      <div className="w-full max-w-md p-10 rounded-2xl border border-gray-800 bg-white/5 backdrop-blur-xl shadow-2xl text-center">
        <h1 className="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-6 font-serif">
          Check Your Email
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          A magic link has been summoned and sent to your email address. Click the link to enter the realm.
        </p>
        <div className="animate-pulse flex justify-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animation-delay-200"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animation-delay-400"></div>
        </div>
      </div>
    </div>
  );
}
