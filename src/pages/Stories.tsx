import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, Search, Filter, ChevronRight, CheckCircle2, Mic, MicOff } from 'lucide-react';
import { Story } from '../types';
import { AuthContext } from '../AuthContext';

const storiesData: Story[] = [
  {
    id: '1',
    prophetName: 'Adam (AS)',
    category: 'The Beginning',
    content: 'The story of the first human created by Allah...',
    moral: 'Repentance and seeking forgiveness are the keys to Allah\'s mercy.',
    lessons: ['Humility', 'Obedience', 'Repentance'],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    prophetName: 'Nuh (AS)',
    category: 'The Great Flood',
    content: 'The story of the Ark and the patience of Nuh (AS) for 950 years...',
    moral: 'Patience and unwavering faith in Allah lead to salvation.',
    lessons: ['Patience', 'Faith', 'Perseverance'],
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    prophetName: 'Ibrahim (AS)',
    category: 'The Father of Prophets',
    content: 'The story of the search for the true God and the sacrifice...',
    moral: 'Complete submission to the will of Allah is the highest form of worship.',
    lessons: ['Submission', 'Courage', 'Monotheism'],
    image: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4',
    prophetName: 'Yusuf (AS)',
    category: 'The Dreamer',
    content: 'The story of beauty, betrayal, and the ultimate rise to power...',
    moral: 'Allah is the best of planners, and patience in hardship brings ease.',
    lessons: ['Forgiveness', 'Integrity', 'Trust in Allah'],
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '5',
    prophetName: 'Musa (AS)',
    category: 'The Deliverer',
    content: 'The story of the confrontation with Pharaoh and the parting of the sea...',
    moral: 'Truth always triumphs over falsehood, and Allah is the protector of the believers.',
    lessons: ['Courage', 'Reliance on Allah', 'Justice'],
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '6',
    prophetName: 'Isa (AS)',
    category: 'The Spirit of Allah',
    content: 'The story of the miraculous birth and the message of love and mercy...',
    moral: 'Miracles are signs of Allah\'s power, and true faith is shown through compassion.',
    lessons: ['Mercy', 'Miracles', 'Devotion'],
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '7',
    prophetName: 'Muhammad (PBUH)',
    category: 'The Final Messenger',
    content: 'The life of the Seal of the Prophets and the completion of the message...',
    moral: 'Character and mercy to all of creation are the hallmarks of true faith.',
    lessons: ['Mercy', 'Character', 'Leadership'],
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '8',
    prophetName: 'Yunus (AS)',
    category: 'The Prophet in the Whale',
    content: 'The story of repentance and hope from the darkness of the whale...',
    moral: 'Never lose hope in Allah\'s mercy, and always turn to Him in distress.',
    lessons: ['Repentance', 'Patience', 'Hope'],
    image: 'https://images.unsplash.com/photo-1505118380757-91f5f45d8de4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '9',
    prophetName: 'Ayub (AS)',
    category: 'The Prophet of Patience',
    content: 'The story of incredible patience through years of severe trials...',
    moral: 'Patience during trials is a sign of true faith and brings great rewards.',
    lessons: ['Patience', 'Gratitude', 'Steadfastness'],
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '10',
    prophetName: 'Sulaiman (AS)',
    category: 'The King Prophet',
    content: 'The story of the wise king who ruled over men, jinn, and animals...',
    moral: 'Power and wealth are tests; use them to serve Allah and promote justice.',
    lessons: ['Wisdom', 'Justice', 'Humility'],
    image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '11',
    prophetName: 'Dawud (AS)',
    category: 'The Warrior Prophet',
    content: 'The story of the brave youth who defeated a giant and became a king...',
    moral: 'Strength comes from faith, and devotion should be the center of life.',
    lessons: ['Bravery', 'Devotion', 'Skill'],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '12',
    prophetName: 'Ismail (AS)',
    category: 'The Prophet of Sacrifice',
    content: 'The story of complete submission and the building of the Kaaba...',
    moral: 'True faith is shown through complete submission to Allah\'s commands.',
    lessons: ['Submission', 'Patience', 'Sacrifice'],
    image: 'https://images.unsplash.com/photo-1564769625905-50e9ad63ee97?auto=format&fit=crop&w=800&q=80'
  }
];

const Stories = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSearching, setIsSearching] = useState(false);
  const { profile } = useContext(AuthContext);

  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  const categories = ['All', 'The Beginning', 'The Great Flood', 'The Father of Prophets', 'The Dreamer', 'The Prophet in the Whale', 'The Prophet of Patience', 'The King Prophet', 'The Warrior Prophet', 'The Prophet of Sacrifice'];

  const filteredStories = storiesData.filter(story => 
    (selectedCategory === 'All' || story.category === selectedCategory) &&
    story.prophetName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsSearching(true);
    recognition.onend = () => setIsSearching(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
    };
    recognition.start();
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-serif font-bold text-emerald-900">Prophet Stories</h1>
        <p className="text-emerald-600 max-w-2xl mx-auto">
          Embark on a journey through time to learn from the lives of the chosen ones. 
          Each story is a beacon of light and guidance.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center glass p-4 rounded-2xl">
        <div className="relative w-full md:w-96 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={20} />
            <input 
              type="text" 
              placeholder="Search Prophet..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-emerald-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-800 outline-none"
            />
          </div>
          <button 
            onClick={startVoiceSearch}
            className={`p-3 rounded-xl transition-all ${isSearching ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'}`}
            title="Search by Voice"
          >
            {isSearching ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStories.map((story, idx) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-emerald-50 hover:shadow-xl transition-all duration-500"
          >
            <div className="relative h-56 overflow-hidden">
              <img 
                src={story.image} 
                alt={story.prophetName} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-white/90 backdrop-blur-sm text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {story.category}
                </span>
                {profile?.completedStories?.includes(story.id) && (
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                    <CheckCircle2 size={10} />
                    COMPLETED
                  </span>
                )}
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-serif font-bold text-emerald-900 mb-3">{story.prophetName}</h3>
              <p className="text-emerald-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                {story.content}
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {story.lessons.slice(0, 2).map(lesson => (
                  <span key={lesson} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md uppercase">
                    {lesson}
                  </span>
                ))}
              </div>
              <Link 
                to={`/stories/${story.id}`}
                className="flex items-center justify-between w-full p-4 bg-emerald-50 rounded-2xl text-emerald-800 font-bold group-hover:bg-emerald-800 group-hover:text-white transition-all"
              >
                <span>Read Story</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Stories;
