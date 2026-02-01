import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShoppingBasket, Trash2, CheckCircle2, LogOut, Settings } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { getUserProfile, clearUserProfile, getShoppingList, removeFromShoppingList } from '@/lib/user-store';

const Profile = () => {
  const navigate = useNavigate();
  const profile = getUserProfile();
  const [items, setItems] = useState(getShoppingList());

  if (!profile) return null;

  const handleLogout = () => {
    if(confirm("Czy na pewno chcesz wyczyścić wszystkie swoje dane?")) {
      clearUserProfile();
      navigate('/onboarding');
    }
  };

  const refresh = () => setItems(getShoppingList());

  return (
    <AppLayout>
      <div className="px-5 pt-12 pb-24 space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">Mój Profil</h1>
          <button onClick={handleLogout} className="text-red-500 p-2"><LogOut size={20} /></button>
        </header>

        <div className="flex items-center gap-5 p-6 bg-white/5 rounded-[2.5rem] border border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-foreground/10 flex items-center justify-center"><User size={32} /></div>
          <div>
            <h2 className="text-xl font-black uppercase italic">{profile.name}</h2>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{profile.weight}kg • {profile.height}cm</p>
          </div>
        </div>

        <section className="space-y-4">
          <h3 className="font-black uppercase text-xs italic tracking-widest px-2">Lista Zakupów</h3>
          {items.length === 0 ? (
            <div className="p-10 text-center bg-white/5 rounded-[2rem] border border-dashed border-white/10">
              <ShoppingBasket className="mx-auto mb-2 opacity-20" size={32} />
              <p className="text-[10px] text-muted-foreground font-bold uppercase">Brak produktów</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-primary/40" />
                    <div><p className="text-sm font-bold leading-none">{item.name}</p><p className="text-[9px] text-muted-foreground mt-1 uppercase">{item.amount} {item.unit}</p></div>
                  </div>
                  <button onClick={() => { removeFromShoppingList(item.id); refresh(); }} className="text-red-500/30"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="pt-4 px-2">
          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.3em] text-center">Dane przechowywane lokalnie na tym urządzeniu</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;