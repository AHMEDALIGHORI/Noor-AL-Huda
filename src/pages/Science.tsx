import React from 'react';
import { motion } from 'motion/react';
import { Globe, Zap, Droplets, Moon, Sun, Atom } from 'lucide-react';

const Science = () => {
  const miracles = [
    {
      title: "The Expanding Universe",
      verse: "And the heaven We constructed with strength, and indeed, We are [its] expander.",
      ref: "Surah Adh-Dhariyat (51:47)",
      desc: "Modern cosmology confirms that the universe is expanding, a fact mentioned in the Quran 1400 years ago.",
      icon: Globe,
      image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "The Water Cycle",
      verse: "And We have sent the fertilizing winds and sent down water from the sky and given you drink from it.",
      ref: "Surah Al-Hijr (15:22)",
      desc: "The Quran describes the process of evaporation, cloud formation, and rain with remarkable precision.",
      icon: Droplets,
      image: "https://images.unsplash.com/photo-1534274988757-a28bf1f554df?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Embryology",
      verse: "Then We made the sperm-drop into a clinging clot, and We made the clot into a lump [of flesh]...",
      ref: "Surah Al-Mu'minun (23:14)",
      desc: "The stages of human development in the womb are described in detail that aligns with modern medical science.",
      icon: Atom,
      image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="space-y-16">
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-serif font-bold text-emerald-900">Quran & Science</h1>
        <p className="text-emerald-600 max-w-2xl mx-auto text-lg">
          Exploring the harmony between the divine revelation and the discoveries of modern science. 
          The Quran is a book of signs, not just a book of science.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {miracles.map((m, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            className="card overflow-hidden border-t-4 border-t-emerald-800 p-0"
          >
            <div className="h-48 overflow-hidden">
              <img src={m.image} alt={m.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="p-8 space-y-6">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center">
                <m.icon size={24} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-emerald-900">{m.title}</h3>
              <div className="bg-emerald-50 p-4 rounded-xl italic text-emerald-800 text-sm border-l-4 border-emerald-800">
                "{m.verse}"
                <p className="mt-2 font-bold not-italic">— {m.ref}</p>
              </div>
              <p className="text-emerald-600 text-sm leading-relaxed">
                {m.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="liquid-glass text-white rounded-3xl p-12 overflow-hidden relative">
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-3xl font-serif font-bold mb-6">The Miracle of Creation</h2>
          <p className="text-emerald-100 text-lg leading-relaxed mb-8">
            The Quran invites humanity to reflect on the creation of the heavens and the earth. 
            Every discovery in science only deepens our awe of the Creator's wisdom.
          </p>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full text-sm">
              <Sun size={16} className="text-gold" />
              <span>Solar Orbit</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full text-sm">
              <Moon size={16} className="text-gold" />
              <span>Lunar Phases</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <Atom size={400} className="translate-x-1/2 -translate-y-1/4" />
        </div>
      </section>
    </div>
  );
};

export default Science;
