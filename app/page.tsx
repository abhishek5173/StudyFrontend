"use client"

import { useState, useEffect } from 'react';
import { FileText, Users, Zap, Shield, ChevronRight, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();

  const { token} = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-medium mb-6 animate-pulse">
              <Sparkles className="w-4 h-4" />
              Now with real-time AI suggestions
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Create documents
              <span className="block bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                together, instantly
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Experience the future of collaborative writing. Work together in real-time, share ideas seamlessly, and bring your documents to life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick={()=> {
                if(token){
                  router.push('/dashboard');
                } else {
                  router.push('/register');
                }
              }} className="group px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center gap-2">
                Start Creating Free
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white text-gray-800 rounded-xl font-semibold border-2 border-gray-200 hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
                Watch Demo
              </button>
            </div>

            {/* Floating Animation Elements */}
            <div className="relative mt-16 h-96">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full max-w-4xl">
                  {/* Main Document Card */}
                  <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex -space-x-2">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-pink-400 to-red-400 border-2 border-white"></div>
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-indigo-400 border-2 border-white"></div>
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-emerald-400 border-2 border-white"></div>
                      </div>
                      <span className="text-sm text-gray-500 font-medium">3 people editing</span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-linear-to-r from-gray-200 to-gray-100 rounded w-3/4"></div>
                      <div className="h-4 bg-linear-to-r from-gray-200 to-gray-100 rounded w-full"></div>
                      <div className="h-4 bg-linear-to-r from-indigo-200 to-purple-200 rounded w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Floating Feature Cards */}
                  <div className="absolute -right-8 top-8 bg-white rounded-xl shadow-xl p-4 transform rotate-3 hover:rotate-0 transition-transform hidden md:block">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm font-semibold">Real-time Sync</span>
                    </div>
                  </div>
                  
                  <div className="absolute -left-8 bottom-8 bg-white rounded-xl shadow-xl p-4 transform -rotate-3 hover:rotate-0 transition-transform hidden md:block">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-semibold">End-to-End Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything you need to collaborate</h2>
            <p className="text-xl text-gray-600">Powerful features that make teamwork effortless</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                title: "Real-time Collaboration",
                description: "See changes as they happen. Watch your team's cursors and edits in real-time.",
                color: "from-blue-500 to-indigo-500"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Lightning Fast",
                description: "Built for speed. No lag, no delays. Just pure, responsive editing.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Secure by Default",
                description: "Enterprise-grade security with end-to-end encryption for all your documents.",
                color: "from-green-500 to-emerald-500"
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-linear-to-br from-gray-50 to-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className={`w-16 h-16 bg-linear-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6 bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to transform your workflow?
          </h2>
          <p className="text-xl text-indigo-100 mb-10">
            Join thousands of teams already collaborating better with DocSync
          </p>
          <button className="px-10 py-5 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200">
            Get Started for Free
          </button>
          <p className="text-indigo-100 mt-4 text-sm">No credit card required • Free forever plan available</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-4">
            <div className="w-8 h-8 bg-linear-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-white">DocSync</span>
          </div>
          <p className="text-sm">© 2024 DocSync. Making collaboration beautiful.</p>
        </div>
      </footer>
    </div>
  );
}