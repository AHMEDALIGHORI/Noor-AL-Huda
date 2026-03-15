import React, { useState, useRef, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Volume2, ArrowLeft, BookOpen, Star, Globe, Play, Pause, Mic, MicOff, CheckCircle2, User, Tag, Lightbulb, Info, Share2, Check } from 'lucide-react';
import { generateStoryAudio, translateContent } from '../services/geminiService';
import { Language } from '../types';
import { AuthContext } from '../AuthContext';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo?: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

const storiesData = [
  {
    id: '1',
    prophetName: 'Adam (AS)',
    category: 'The Beginning',
    content: `Allah created Adam (AS) from clay and breathed life into him. He was the first human and the first Prophet. Allah taught Adam the names of all things and commanded the angels to prostrate before him. All obeyed except Iblis, who was arrogant. Adam and his wife Hawwa lived in Paradise but were tested with the forbidden tree. They were deceived by Iblis and ate from it, but they immediately repented. Allah forgave them and sent them to Earth to fulfill their purpose as vicegerents.`,
    moral: 'Repentance and seeking forgiveness are the keys to Allah\'s mercy. Arrogance leads to downfall, while humility leads to elevation.',
    lessons: ['Humility', 'Obedience', 'Repentance', 'Accountability'],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80'
  },
  {
    id: '2',
    prophetName: 'Nuh (AS)',
    category: 'The Great Flood',
    content: `Prophet Nuh (AS) called his people to worship Allah alone for 950 years, but most of them mocked him. Allah commanded Nuh to build a massive Ark. When the great flood came, only those who joined Nuh on the Ark were saved. This story teaches us about the consequences of disbelief and the ultimate salvation of those who remain steadfast in their faith.`,
    moral: 'Patience and unwavering faith in Allah lead to salvation. Allah protects those who follow His guidance.',
    lessons: ['Patience', 'Faith', 'Perseverance', 'Trust'],
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1920&q=80'
  },
  {
    id: '3',
    prophetName: 'Ibrahim (AS)',
    category: 'The Father of Prophets',
    content: `Ibrahim (AS) was a man of pure faith who searched for the true Creator. He stood alone against the idols of his people and was thrown into a fire, which Allah made cool and safe for him. He was tested with the command to sacrifice his son Ismail, showing his complete submission. He built the Kaaba with Ismail, establishing it as a house of worship for all humanity.`,
    moral: 'Complete submission to the will of Allah is the highest form of worship. Allah rewards those who are sincere in their devotion.',
    lessons: ['Submission', 'Courage', 'Monotheism', 'Sacrifice'],
    image: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1920&q=80'
  },
  {
    id: '4',
    prophetName: 'Yusuf (AS)',
    category: 'The Dreamer',
    content: `Yusuf (AS) was gifted with beauty and the ability to interpret dreams. Betrayed by his brothers and sold into slavery, he remained upright even in the face of temptation and imprisonment. His patience and integrity eventually led him to become a powerful minister in Egypt, where he saved the land from famine and eventually forgave his brothers.`,
    moral: 'Allah is the best of planners, and patience in hardship brings ease. Forgiveness is a noble trait that heals hearts.',
    lessons: ['Forgiveness', 'Integrity', 'Trust in Allah', 'Patience'],
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80'
  },
  {
    id: '5',
    prophetName: 'Musa (AS)',
    category: 'The Deliverer',
    content: `Musa (AS) was chosen by Allah to deliver the Children of Israel from the tyranny of Pharaoh. Armed with miracles like the staff that turned into a serpent and the hand that shone with light, he confronted the most powerful ruler of his time. When cornered at the Red Sea, Allah commanded Musa to strike the water, parting it for the believers to cross safely while Pharaoh and his army were drowned.`,
    moral: 'Truth always triumphs over falsehood, and Allah is the protector of the believers. Courage in the face of tyranny is a divine duty.',
    lessons: ['Courage', 'Reliance on Allah', 'Justice', 'Liberation'],
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80'
  },
  {
    id: '6',
    prophetName: 'Isa (AS)',
    category: 'The Spirit of Allah',
    content: `Isa (AS) was born miraculously to Maryam (AS) without a father. He spoke from the cradle and performed many miracles by Allah's permission, such as healing the blind and raising the dead. He brought a message of love, mercy, and the coming of the final Prophet. He was raised to the heavens by Allah and will return to Earth in the end times.`,
    moral: 'Miracles are signs of Allah\'s power, and true faith is shown through compassion and devotion to the One God.',
    lessons: ['Mercy', 'Miracles', 'Devotion', 'Compassion'],
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1920&q=80'
  },
  {
    id: '7',
    prophetName: 'Muhammad (PBUH)',
    category: 'The Final Messenger',
    content: `Muhammad (PBUH) was born in Mecca and received the first revelation of the Quran at the age of 40. Known as Al-Amin (the Trustworthy), he faced immense persecution but remained steadfast in spreading the message of Islam. His life is a perfect example of character, mercy, and leadership. He united the Arabian Peninsula under the banner of monotheism and left behind a legacy that continues to guide billions.`,
    moral: 'Character and mercy to all of creation are the hallmarks of true faith. The Prophet (PBUH) is the best role model for all of humanity.',
    lessons: ['Mercy', 'Character', 'Leadership', 'Steadfastness'],
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1920&q=80'
  },
  {
    id: '8',
    prophetName: 'Yunus (AS)',
    category: 'The Prophet in the Whale',
    content: `Prophet Yunus (AS) was sent to the people of Nineveh. When they initially rejected his message, he left in anger and boarded a ship. A great storm arose, and Yunus was cast into the sea, where he was swallowed by a massive whale. Inside the darkness of the whale's belly, he turned to Allah with sincere repentance, reciting: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers." Allah heard his plea and commanded the whale to cast him onto the shore. He returned to his people, who had since repented, and they all embraced the faith.`,
    moral: 'Never lose hope in Allah\'s mercy, and always turn to Him in times of distress. Sincere repentance can change one\'s destiny.',
    lessons: ['Repentance', 'Patience', 'Hope', 'Divine Mercy'],
    image: 'https://images.unsplash.com/photo-1505118380757-91f5f45d8de4?auto=format&fit=crop&w=1920&q=80'
  },
  {
    id: '9',
    prophetName: 'Ayub (AS)',
    category: 'The Prophet of Patience',
    content: `Prophet Ayub (AS) was a wealthy man with a large family and perfect health. Allah tested him by taking away his wealth, his children, and finally his health. He suffered from a severe skin disease for many years, yet he never complained or lost faith. His wife stood by him through all the trials. Eventually, Allah rewarded his incredible patience by restoring everything he had lost and more, commanding him to strike the ground with his foot, from which a healing spring gushed forth.`,
    moral: 'Patience during trials is a sign of true faith. Allah\'s rewards for the patient are beyond measure.',
    lessons: ['Patience', 'Gratitude', 'Steadfastness', 'Trust in Allah'],
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1920&q=80'
  },
  {
    id: '10',
    prophetName: 'Sulaiman (AS)',
    category: 'The King Prophet',
    content: `Prophet Sulaiman (AS) was the son of Prophet Dawud (AS) and was granted a kingdom like no other. Allah gave him power over the wind, the jinn, and the ability to understand the language of animals. Despite his immense power and wealth, he remained a humble servant of Allah. He built the magnificent Temple in Jerusalem and ruled with wisdom and justice. His story with the Queen of Sheba (Bilqis) demonstrates how he used his gifts to bring others to the worship of the One True God.`,
    moral: 'Power and wealth are tests from Allah. A true believer uses their influence to serve the Creator and promote justice.',
    lessons: ['Wisdom', 'Justice', 'Humility', 'Gratitude'],
    image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1920&q=80'
  },
  {
    id: '11',
    prophetName: 'Dawud (AS)',
    category: 'The Warrior Prophet',
    content: `Prophet Dawud (AS) was a young shepherd who defeated the giant Goliath (Jalut) with a single stone from his sling, by the permission of Allah. He was granted both prophethood and kingship. Allah revealed the Zabur (Psalms) to him and made the mountains and birds join him in glorifying Allah. He was known for his beautiful voice and his habit of fasting every other day. He was also a skilled craftsman who could soften iron with his hands to make armor.`,
    moral: 'Strength comes from faith, not just physical might. Devotion to Allah should be the center of a believer\'s life.',
    lessons: ['Bravery', 'Devotion', 'Skill', 'Glorification'],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80'
  },
  {
    id: '12',
    prophetName: 'Ismail (AS)',
    category: 'The Prophet of Sacrifice',
    content: `Prophet Ismail (AS) was the eldest son of Prophet Ibrahim (AS). As an infant, he and his mother Hajar were left in the barren valley of Mecca by Allah's command. When they ran out of water, Allah caused the well of Zamzam to spring forth. Later, Ismail showed incredible submission when his father told him about the dream of sacrifice, saying, "O my father, do as you are commanded. You will find me, if Allah wills, of the steadfast." Allah replaced him with a ram, and together they built the Kaaba.`,
    moral: 'True faith is shown through complete submission to Allah\'s commands. Sacrifice for the sake of Allah leads to eternal blessings.',
    lessons: ['Submission', 'Patience', 'Sacrifice', 'Legacy'],
    image: 'https://images.unsplash.com/photo-1564769625905-50e9ad63ee97?auto=format&fit=crop&w=1920&q=80'
  }
];

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useContext(AuthContext);
  const story = storiesData.find(s => s.id === id);
  const [language, setLanguage] = useState<Language>('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [translatedMoral, setTranslatedMoral] = useState<string | null>(null);
  const [translatedLessons, setTranslatedLessons] = useState<string[] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    return () => {
      if (audioRef.current?.src.startsWith('blob:')) {
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, []);

  if (!story) return <div className="text-center py-20">Story not found</div>;

  const isCompleted = profile?.completedStories?.includes(story.id) || false;

  const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: user?.uid,
        email: user?.email,
        emailVerified: user?.emailVerified,
        isAnonymous: user?.isAnonymous,
        tenantId: user?.tenantId,
        providerInfo: user?.providerData.map(provider => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  };

  const toggleCompleted = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsUpdating(true);
    const path = `users/${user.uid}`;
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        completedStories: isCompleted ? arrayRemove(story.id) : arrayUnion(story.id)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTranslate = async (lang: Language) => {
    if (lang === 'en') {
      setTranslatedContent(null);
      setTranslatedMoral(null);
      setTranslatedLessons(null);
      setLanguage('en');
      return;
    }
    setIsTranslating(true);
    try {
      const [translatedText, translatedMoralText, translatedLessonsText] = await Promise.all([
        translateContent(story.content, lang),
        translateContent(story.moral, lang),
        translateContent(story.lessons.join(' | '), lang)
      ]);
      
      setTranslatedContent(translatedText);
      setTranslatedMoral(translatedMoralText);
      setTranslatedLessons(translatedLessonsText.split(' | ').map(l => l.trim()));
      setLanguage(lang);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handlePlayAudio = async () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    setIsAudioLoading(true);
    try {
      const textToSpeak = translatedContent || story.content;
      const base64Audio = await generateStoryAudio(textToSpeak);
      
      if (base64Audio && audioRef.current) {
        // Convert base64 to Blob for more reliable playback of large files
        const byteCharacters = atob(base64Audio);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(blob);

        // Cleanup previous URL if it exists
        if (audioRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioRef.current.src);
        }

        audioRef.current.src = audioUrl;
        audioRef.current.load();
        
        await new Promise((resolve, reject) => {
          if (!audioRef.current) return reject();
          audioRef.current.oncanplaythrough = resolve;
          audioRef.current.onerror = reject;
        });

        await audioRef.current.play();
        audioRef.current.onended = () => setIsPlaying(false);
      } else {
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsPlaying(false);
    } finally {
      setIsAudioLoading(false);
    }
  };

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
      navigate(`/stories?search=${encodeURIComponent(transcript)}`);
    };
    recognition.start();
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex justify-between items-center">
        <Link to="/stories" className="flex items-center text-emerald-700 hover:text-emerald-900 font-medium group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Stories
        </Link>
        
        <button 
          onClick={startVoiceSearch}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${isSearching ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'}`}
        >
          {isSearching ? <MicOff size={18} /> : <Mic size={18} />}
          <span>{isSearching ? 'Listening...' : 'Search by Voice'}</span>
        </button>
      </div>

      <div className="relative h-[40vh] rounded-3xl overflow-hidden shadow-2xl">
        <img src={story.image} alt={story.prophetName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-12">
          <div className="text-white">
            <span className="bg-gold text-black text-xs font-bold px-3 py-1 rounded-full uppercase mb-4 inline-block">
              {story.category}
            </span>
            <h1 className="text-5xl font-serif font-bold">{story.prophetName}</h1>
          </div>
        </div>
      </div>

      {/* Story Profile Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 flex flex-col items-center text-center justify-center space-y-3 bg-white border-emerald-100"
        >
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
            <User size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-500 font-black mb-1">Prophet</p>
            <h3 className="text-xl font-serif font-bold text-emerald-900">{story.prophetName}</h3>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 flex flex-col items-center text-center justify-center space-y-3 bg-white border-emerald-100"
        >
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Tag size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-blue-500 font-black mb-1">Category</p>
            <h3 className="text-xl font-serif font-bold text-emerald-900">{story.category}</h3>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 flex flex-col items-center text-center justify-center space-y-3 bg-white border-emerald-100 lg:col-span-2"
        >
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Lightbulb size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-amber-500 font-black mb-1">Core Moral</p>
            <h3 className="text-sm italic text-emerald-800 line-clamp-2 px-4">
              "{translatedMoral || story.moral}"
            </h3>
          </div>
        </motion.div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 glass p-4 rounded-2xl">
            <div className="flex items-center space-x-2">
              <Globe size={18} className="text-emerald-600" />
              <select 
                value={language} 
                onChange={(e) => handleTranslate(e.target.value as Language)}
                className="bg-emerald-50 text-emerald-800 text-sm rounded-lg px-3 py-2 outline-none border-none font-medium"
              >
                <option value="en">English</option>
                <option value="ar">Arabic (العربية)</option>
                <option value="ur">Urdu (اردو)</option>
                <option value="bn">Bengali (বাংলা)</option>
                <option value="id">Indonesian (Bahasa Indonesia)</option>
                <option value="tr">Turkish (Türkçe)</option>
                <option value="fr">French (Français)</option>
                <option value="es">Spanish (Español)</option>
                <option value="de">German (Deutsch)</option>
              </select>
            </div>
            <button 
              onClick={handlePlayAudio}
              disabled={isTranslating || isAudioLoading}
              className="flex items-center space-x-2 bg-emerald-800 text-white px-6 py-2 rounded-full hover:bg-emerald-900 transition-all disabled:opacity-50 min-w-[160px] justify-center"
            >
              {isAudioLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause size={18} />
              ) : (
                <Play size={18} />
              )}
              <span>
                {isAudioLoading ? 'Generating...' : isPlaying ? 'Pause Audio' : 'Listen to Story'}
              </span>
            </button>

            <button 
              onClick={toggleCompleted}
              disabled={isUpdating}
              className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all disabled:opacity-50 ${
                isCompleted 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : 'bg-gold text-black hover:bg-yellow-500'
              }`}
            >
              <CheckCircle2 size={18} className={isCompleted ? 'text-emerald-600' : ''} />
              <span>{isCompleted ? 'Completed' : 'Mark as Completed'}</span>
            </button>

            <button 
              onClick={handleShare}
              className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all ${
                isCopied 
                  ? 'bg-emerald-800 text-white' 
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              {isCopied ? <Check size={18} /> : <Share2 size={18} />}
              <span>{isCopied ? 'Link Copied!' : 'Share Story'}</span>
            </button>
          </div>

          {/* Content */}
          <div className="prose prose-emerald lg:prose-xl max-w-none">
            {isTranslating ? (
              <div className="flex items-center space-x-3 text-emerald-600 animate-pulse">
                <BookOpen className="animate-bounce" />
                <span>Translating wisdom...</span>
              </div>
            ) : (
              <p className="text-emerald-900 leading-relaxed text-lg first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left">
                {translatedContent || story.content}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-emerald-900 text-white p-8 rounded-3xl shadow-xl border border-emerald-800"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Star className="text-gold" fill="currentColor" />
              <h3 className="text-xl font-serif font-bold">Moral of the Story</h3>
            </div>
            <p className="text-emerald-100 italic leading-relaxed">
              "{translatedMoral || story.moral}"
            </p>
          </motion.div>

          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm">
            <h3 className="text-xl font-serif font-bold text-emerald-900 mb-6">Key Lessons</h3>
            <ul className="space-y-4">
              {(translatedLessons || story.lessons).map((lesson, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-emerald-700 font-medium">{lesson}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

export default StoryDetail;
