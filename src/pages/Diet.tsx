import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Webcam from "react-webcam";
import { Camera, X, Check, Loader2, Sparkles, Utensils } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";

// Stylistyka szklanych kart (Glassmorphism)
const glassStyle = "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl";

const Diet = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<null | any>(null);
  const webcamRef = useRef<Webcam>(null);

  // Funkcja "Skanowania" - robi zdjęcie i przechodzi do podglądu danych
  const handleCapture = useCallback(() => {
    setIsAnalyzing(true);
    
    // Symulujemy czas potrzebny na "przetworzenie" obrazu przez skaner
    setTimeout(() => {
      const mockResult = {
        name: "Rozpoznany Posiłek",
        calories: 385,
        protein: 24,
        carbs: 45,
        fat: 12
      };
      setScanResult(mockResult);
      setIsAnalyzing(false);
    }, 2000);
  }, []);

  const confirmMeal = () => {
    toast({
      title: "Sukces!",
      description: "Posiłek został dodany do Twojego dziennika.",
    });
    setIsScanning(false);
    setScanResult(null);
  };

  return (
    <AppLayout>
      <div className="px-5 pt-12 pb-24 space-y-6">
        <header className="flex justify-between items-end">
          <div>
            <p className="text-muted-foreground text-xs uppercase font-bold tracking-widest">Twoja Dieta</p>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">Dziennik</h1>
          </div>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsScanning(true)}
            className="flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-tighter"
          >
            <Camera size={18} /> Skanuj
          </motion.button>
        </header>

        {/* Widok domyślny strony Dieta */}
        <div className={`p-10 text-center rounded-[2.5rem] ${glassStyle}`}>
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Utensils className="text-muted-foreground" size={32} />
          </div>
          <p className="text-muted-foreground font-medium italic">Kliknij przycisk powyżej,<br/>aby dodać posiłek aparatem.</p>
        </div>

        {/* MODAL APARATU I SKANERA */}
        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] bg-black flex flex-col"
            >
              {!scanResult ? (
                <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden">
                  {/* Podgląd kamery */}
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="h-full w-full object-cover"
                    videoConstraints={{ facingMode: "environment" }} // Używa tylnej kamery
                  />
                  
                  {/* Elementy graficzne skanera (Celownik) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-72 h-72">
                      {/* Narożniki celownika */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-3xl" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-3xl" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-3xl" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-3xl" />
                      
                      {/* Animowana linia skanująca */}
                      <motion.div 
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-white/50 shadow-[0_0_20px_rgba(255,255,255,0.8)] z-10"
                      />
                    </div>
                  </div>

                  {/* UI Sterowania aparatem */}
                  <div className="absolute bottom-12 w-full px-10 flex justify-between items-center">
                    <button 
                      onClick={() => setIsScanning(false)} 
                      className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20"
                    >
                      <X size={24} />
                    </button>

                    <button 
                      onClick={handleCapture}
                      disabled={isAnalyzing}
                      className="group relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <Loader2 className="animate-spin text-black" size={32} />
                      ) : (
                        <div className="w-16 h-16 border-2 border-black rounded-full group-active:scale-90 transition-transform" />
                      )}
                    </button>

                    <div className="w-14" /> {/* Spacer dla balansu wizualnego */}
                  </div>

                  {/* Napis informacyjny */}
                  <div className="absolute top-16 w-full text-center">
                    <p className="text-white/70 text-[10px] uppercase font-black tracking-[0.3em] bg-black/20 backdrop-blur-md py-2 inline-block px-6 rounded-full border border-white/10">
                      System Skanowania Aktywny
                    </p>
                  </div>
                </div>
              ) : (
                /* EKRAN WYNIKU SKANOWANIA */
                <motion.div 
                  initial={{ y: 100, opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }}
                  className="flex-1 bg-background p-6 flex flex-col justify-center items-center"
                >
                  <div className={`w-full max-w-sm p-8 rounded-[3rem] space-y-8 ${glassStyle}`}>
                    <div className="text-center space-y-2">
                      <div className="w-20 h-20 bg-foreground/10 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <Sparkles className="text-foreground" size={32} />
                      </div>
                      <h2 className="text-3xl font-black uppercase italic tracking-tighter">Wynik</h2>
                      <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">{scanResult.name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-5 rounded-3xl border border-white/5 text-center">
                        <p className="text-muted-foreground text-[10px] uppercase font-bold mb-1 tracking-widest">Kcal</p>
                        <p className="text-2xl font-black">{scanResult.calories}</p>
                      </div>
                      <div className="bg-white/5 p-5 rounded-3xl border border-white/5 text-center">
                        <p className="text-muted-foreground text-[10px] uppercase font-bold mb-1 tracking-widest" style={{color: 'hsl(var(--kilo-protein))'}}>Białko</p>
                        <p className="text-2xl font-black">{scanResult.protein}g</p>
                      </div>
                      <div className="bg-white/5 p-5 rounded-3xl border border-white/5 text-center">
                        <p className="text-muted-foreground text-[10px] uppercase font-bold mb-1 tracking-widest" style={{color: 'hsl(var(--kilo-carbs))'}}>Węgle</p>
                        <p className="text-2xl font-black">{scanResult.carbs}g</p>
                      </div>
                      <div className="bg-white/5 p-5 rounded-3xl border border-white/5 text-center">
                        <p className="text-muted-foreground text-[10px] uppercase font-bold mb-1 tracking-widest" style={{color: 'hsl(var(--kilo-fat))'}}>Tłuszcz</p>
                        <p className="text-2xl font-black">{scanResult.fat}g</p>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button 
                        onClick={() => setScanResult(null)}
                        className="flex-1 py-5 rounded-3xl border border-white/10 font-bold uppercase text-[10px] tracking-widest active:bg-white/5 transition-colors"
                      >
                        Ponów
                      </button>
                      <button 
                        onClick={confirmMeal}
                        className="flex-[2] py-5 rounded-3xl bg-foreground text-background font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-transform"
                      >
                        Dodaj teraz
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default Diet;