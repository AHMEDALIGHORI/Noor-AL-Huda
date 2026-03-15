import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, MessageCircle, Globe, Star } from 'lucide-react';
import { MagneticButton } from '../components/MagneticButton';
import { RevealText } from '../components/RevealText';

const Home = () => {
  const features = [
    {
      title: "Prophet Stories",
      desc: "Learn from the lives of the Prophets with interactive stories and moral lessons.",
      icon: BookOpen,
      color: "bg-blue-50 text-blue-600",
      path: "/stories"
    },
    {
      title: "Quranic AI Chat",
      desc: "Ask questions and get answers based on the Holy Quran and Sunnah.",
      icon: MessageCircle,
      color: "bg-emerald-50 text-emerald-600",
      path: "/chat"
    },
    {
      title: "Science & Quran",
      desc: "Explore the relationship between modern science and the wisdom of the Quran.",
      icon: Globe,
      color: "bg-purple-50 text-purple-600",
      path: "/science"
    },
    {
      title: "Islamic Library",
      desc: "Access a curated collection of the best Islamic books and resources.",
      icon: Star,
      color: "bg-amber-50 text-amber-600",
      path: "/books"
    }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden rounded-3xl">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1920&q=80" 
            alt="Islamic Architecture" 
            className="w-full h-full object-cover brightness-50"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <RevealText 
            text="Illuminating the Path of Wisdom"
            className="text-5xl md:text-7xl font-serif font-bold mb-6 justify-center"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xl md:text-2xl text-emerald-100 max-w-2xl mx-auto mb-10"
          >
            Explore the stories of the Prophets, engage with our Quranic AI, and discover the scientific miracles of Islam.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <MagneticButton>
              <Link to="/stories" className="btn-primary text-lg px-8 py-3 block">Start Exploring</Link>
            </MagneticButton>
            <MagneticButton>
              <Link to="/chat" className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-3 rounded-full hover:bg-white/20 transition-all text-lg block">Talk to Noor AI</Link>
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-emerald-900 mb-4">Explore Our World</h2>
          <p className="text-emerald-600 max-w-xl mx-auto">Discover the various sections of Noor Al-Huda designed to enrich your knowledge and spirit.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="card group cursor-pointer"
            >
              <Link to={feature.path}>
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-emerald-900 mb-2">{feature.title}</h3>
                <p className="text-emerald-600 text-sm leading-relaxed">{feature.desc}</p>
                <div className="mt-6 flex items-center text-emerald-800 font-semibold text-sm">
                  Learn More <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section className="liquid-glass rounded-3xl p-12 text-center border border-emerald-100">
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-gold text-4xl mb-4 block">"</span>
          <RevealText 
            text="Read! In the name of your Lord who created: Created man from a clinging substance. Read! Your Lord is the most Generous."
            className="text-3xl font-serif italic text-emerald-800 mb-6 leading-relaxed justify-center"
          />
          <p className="text-emerald-600 font-medium">— Surah Al-Alaq (96:1-3)</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
