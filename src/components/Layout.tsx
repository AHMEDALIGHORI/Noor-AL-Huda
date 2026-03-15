import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { motion } from 'motion/react';
import Lenis from '@studio-freight/lenis';
import { CursorFollower } from './CursorFollower';
import { ScrollProgress } from './ScrollProgress';

const Layout = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <CursorFollower />
      <Navbar />
      <main className="flex-grow pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <Outlet />
        </motion.div>
      </main>
      <footer className="bg-emerald-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-gold">☪</span>
            </div>
            <span className="text-xl font-serif font-bold">Noor Al-Huda</span>
          </div>
          <p className="text-emerald-200 max-w-md mx-auto mb-8">
            Spreading the light of wisdom through the stories of the Prophets and the guidance of the Holy Quran.
          </p>
          <div className="border-t border-white/10 pt-8 text-sm text-emerald-300">
            &copy; {new Date().getFullYear()} Noor Al-Huda. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
