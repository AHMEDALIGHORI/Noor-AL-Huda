import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Download, ExternalLink, Star, CheckCircle2, Loader2 } from 'lucide-react';

const Books = () => {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('downloaded_books');
    return saved ? JSON.parse(saved) : [];
  });

  const books = [
    {
      id: 1,
      title: "The Sealed Nectar (Ar-Raheeq Al-Makhtum)",
      author: "Safiur Rahman Mubarakpuri",
      desc: "A complete authoritative book on the life of Prophet Muhammad (PBUH).",
      rating: 5,
      image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Riyad as-Salihin",
      author: "Imam an-Nawawi",
      desc: "A compilation of verses from the Quran and hadith, categorized by theme.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Don't Be Sad (La Tahzan)",
      author: "Aaidh ibn Abdullah al-Qarni",
      desc: "A practical book on how to deal with the trials and tribulations of life.",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1499209974431-9dac3adaf471?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Fortress of the Muslim (Hisnul Muslim)",
      author: "Sa'id bin Ali bin Wahf Al-Qahtani",
      desc: "A beautiful collection of authentic supplications (duas) from the Quran and Sunnah.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      title: "Tafsir ibn Kathir (Abridged)",
      author: "Imam ibn Kathir",
      desc: "One of the most comprehensive and popular explanations of the Holy Quran.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      title: "The 40 Hadith of Imam Nawawi",
      author: "Imam an-Nawawi",
      desc: "A collection of forty-two hadith that summarize the core principles of Islam.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 7,
      title: "Sahih al-Bukhari (Summarized)",
      author: "Imam al-Bukhari",
      desc: "The most authentic collection of the sayings and actions of Prophet Muhammad (PBUH).",
      rating: 5,
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 8,
      title: "The Ideal Muslimah",
      author: "Dr. Muhammad Ali al-Hashimi",
      desc: "A comprehensive guide on the character and status of the Muslim woman in Islam.",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1584281723351-9d74777a9ed0?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 9,
      title: "Purification of the Heart",
      author: "Hamza Yusuf",
      desc: "A translation and commentary on Imam al-Mawlud's poem on the diseases of the heart.",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const handleDownload = (book: typeof books[0]) => {
    setDownloadingId(book.id);
    
    // Simulate a real file download
    setTimeout(() => {
      const element = document.createElement("a");
      const file = new Blob([`This is a sample offline version of ${book.title} by ${book.author}. In a production environment, this would be the full PDF file.`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      setDownloadingId(null);
      setDownloadedIds(prev => {
        const next = [...prev, book.id];
        localStorage.setItem('downloaded_books', JSON.stringify(next));
        return next;
      });
    }, 1500);
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-serif font-bold text-emerald-900">Islamic Library</h1>
        <p className="text-emerald-600 max-w-2xl mx-auto">
          Explore a curated collection of the most influential Islamic books to deepen your knowledge and faith.
          All books are available for free download.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book, idx) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-emerald-50 flex flex-col"
          >
            <div className="h-64 overflow-hidden relative">
              <img src={book.image} alt={book.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              {downloadedIds.includes(book.id) && (
                <div className="absolute top-4 right-4 bg-emerald-800 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                  <CheckCircle2 size={10} />
                  <span>OFFLINE READY</span>
                </div>
              )}
            </div>
            <div className="p-8 flex-grow flex flex-col">
              <div className="flex items-center space-x-1 text-gold mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.floor(book.rating) ? "currentColor" : "none"} />
                ))}
                <span className="text-xs text-emerald-600 ml-2">{book.rating}</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-emerald-900 mb-2">{book.title}</h3>
              <p className="text-emerald-500 text-xs font-medium mb-4">By {book.author}</p>
              <p className="text-emerald-600 text-sm leading-relaxed mb-8 flex-grow">
                {book.desc}
              </p>
              <div className="flex gap-3">
                <button className="flex-grow btn-primary flex items-center justify-center space-x-2">
                  <Book size={18} />
                  <span>Read Online</span>
                </button>
                <button 
                  onClick={() => handleDownload(book)}
                  disabled={downloadingId === book.id || downloadedIds.includes(book.id)}
                  className={`p-2 rounded-xl transition-all flex items-center justify-center min-w-[44px] ${
                    downloadedIds.includes(book.id) 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  {downloadingId === book.id ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : downloadedIds.includes(book.id) ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <Download size={20} />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
            <ExternalLink size={24} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-amber-900">Looking for something specific?</h4>
            <p className="text-amber-700 text-sm">Access our full digital archive of over 1000+ Islamic manuscripts.</p>
          </div>
        </div>
        <button className="bg-amber-600 text-white px-8 py-3 rounded-full font-bold hover:bg-amber-700 transition-all">
          Browse Archive
        </button>
      </div>
    </div>
  );
};

export default Books;
