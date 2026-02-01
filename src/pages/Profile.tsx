import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Sun, Moon, Shield } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import * as Store from "@/lib/user-store";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = Store.getUserProfile();
    if (!data) {
      navigate('/onboarding');
    } else {
      setProfile(data);
      if (data.theme === 'dark') document.documentElement.classList.add('dark');
      setLoading(false);
    }
  }, [navigate]);

  if (loading || !profile) return <div className="min-h-screen bg-black" />;

  const toggleTheme = () => {
    const newTheme = profile.theme === 'dark' ? 'light' : 'dark';
    Store.updateExtendedProfile({ theme: newTheme });
    document.documentElement.classList.toggle('dark');
    setProfile({ ...profile, theme: newTheme });
  };

  return (
    <AppLayout>
      <div className={`px-5 pt-12 pb-32 min-h-screen transition-all ${profile.theme === 'dark' ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-900'}`}>
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">PROFIL</h1>
          <button onClick={toggleTheme} className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl">
            {profile.theme === 'dark' ? <Sun className="text-yellow-400" /> : <Moon className="text-blue-600" />}
          </button>
        </header>

        <section className="p-10 rounded-[3rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex flex-col items-center gap-4 text-center">
          <div className="w-32 h-32 rounded-[2.5rem] bg-zinc-800 flex items-center justify-center border-4 border-blue-600">
             {profile.avatar ? <img src={profile.avatar} className="w-full h-full object-cover rounded-[2.5rem]" /> : <User size={48} className="text-zinc-600" />}
          </div>
          <h2 className="text-3xl font-black uppercase italic">{profile.name}</h2>
          <p className="font-bold opacity-50">{profile.weight}kg • {profile.height}cm</p>
        </section>

        <button 
          onClick={() => { if(confirm("Czy na pewno chcesz usunąć wszystkie dane?")) Store.clearUserProfile(); }}
          className="w-full mt-10 p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex justify-between items-center text-red-500 active:scale-95 transition-all"
        >
          <span className="font-black uppercase italic tracking-widest">Zresetuj Aplikację</span>
          <LogOut size={20} />
        </button>
      </div>
    </AppLayout>
  );
};

export default Profile;