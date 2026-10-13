import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Sparkles, Layers, Cpu, ShieldCheck } from 'lucide-react';

export const ProductTechVideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white border-t border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Kvalitet & Innmat</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Konstruert for å tåle hverdagen på disken
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg leading-relaxed">
            Se hvordan våre NFC Google Review-kort er bygget opp lag for lag – fra kraftig 3M-lim og industriell NFC-chip til ripefri akrylfinish.
          </p>
        </div>

        {/* Video & Feature Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Video Player Display Container */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-2xl p-2 sm:p-3 group">
              <div className="relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
                <video
                  ref={videoRef}
                  src="./gemini_generated_video_EFF35334.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain cursor-pointer transition-transform duration-500 hover:scale-[1.02]"
                  onClick={togglePlay}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />

                {/* Ambient glow underneath */}
                <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-black/5" />

                {/* Floating controls overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto bg-slate-950/75 backdrop-blur-md text-white px-4 py-2.5 rounded-xl border border-white/10 shadow-lg transition-opacity duration-300">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlay}
                      className="p-1.5 hover:bg-white/15 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
                      title={isPlaying ? 'Pause' : 'Spill av'}
                      aria-label={isPlaying ? 'Pause' : 'Spill av'}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-4 h-4 fill-white" />
                          <span className="hidden sm:inline">Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-white" />
                          <span className="hidden sm:inline">Spill av</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleRestart}
                      className="p-1.5 hover:bg-white/15 rounded-lg transition-colors text-xs text-slate-300 hover:text-white"
                      title="Start på nytt"
                      aria-label="Start på nytt"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                    <span className="hidden md:inline text-[11px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-md">
                      3D Eksplodert visning
                    </span>
                    <button
                      onClick={toggleMute}
                      className="p-1.5 hover:bg-white/15 rounded-lg transition-colors text-slate-200"
                      title={isMuted ? 'Slå på lyd' : 'Mute'}
                      aria-label={isMuted ? 'Slå på lyd' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Layer by Layer Technical Breakdown */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-200 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">1. Høyfrekvent NTAG213/215 NFC-brikke</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Kobber-antenne med øyeblikkelig lesing (under 0.3 sekunder) for både Apple iPhone og alle Android-enheter. Krever null batteri eller strømtilkobling.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-200 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">2. Ripebestandig UV-beskyttet finish</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Offisielt Google Review-fargedekor med blank, slitesterk overflate som tåler daglig tørking med sprit og desinfeksjonsmiddel.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-200 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">3. Industriell 3M™ monteringsfilm</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Sitter som støpt på glassdisker, trebord, kassaapparater og metallflater uten å etterlate stygge limrester ved eventuell fjerning.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold">Ferdig programmert & testet</p>
                <p className="text-[11px] text-slate-300">Hvert eneste kort testes manuelt mot NFC-leser før utsending.</p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 rounded-lg shrink-0">
                100% Garanti
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
