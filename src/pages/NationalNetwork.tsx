import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Building2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { branches } from '../data/branches';

export default function NationalNetwork() {
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Network"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary-400 text-sm font-semibold tracking-widest uppercase mb-3">
              National Network
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              전국 네트워크
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Map + Branch List */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
              대한민국 어디든, 백제약품의 인프라는<br />
              고객과 가장 가까운 곳에 있습니다.
            </h2>
            <p className="text-neutral-500 text-lg max-w-2xl">
              전국 주요 거점의 물류센터와 지점을 통해 빠르고 안정적인 서비스를 제공합니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sticky top-24">
            {/* Map */}
            <div className="lg:col-span-3 bg-primary-50 rounded-2xl p-8 relative min-h-[500px]">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Simplified Korea Map SVG */}
                <svg viewBox="0 0 400 600" className="w-full max-w-sm h-auto">
                  <path
                    d="M200,50 L280,80 L320,150 L340,220 L330,300 L310,380 L280,440 L240,480 L200,500 L160,480 L120,440 L90,380 L70,300 L60,220 L80,150 L120,80 Z"
                    fill="none"
                    stroke="#0A4D3E"
                    strokeWidth="2"
                    className="opacity-30"
                  />
                  {branches.map((branch, i) => (
                    <g key={i}>
                      <circle
                        cx={((branch.lng - 126) / 4) * 400 + 50}
                        cy={((branch.lat - 33.5) / 4) * 600 + 20}
                        r={selectedBranch === i ? 10 : 6}
                        fill={selectedBranch === i ? '#0A4D3E' : '#14b88e'}
                        className="cursor-pointer transition-all duration-300"
                        onClick={() => setSelectedBranch(selectedBranch === i ? null : i)}
                        opacity={0.8}
                      />
                      {selectedBranch === i && (
                        <circle
                          cx={((branch.lng - 126) / 4) * 400 + 50}
                          cy={((branch.lat - 33.5) / 4) * 600 + 20}
                          r={16}
                          fill="none"
                          stroke="#0A4D3E"
                          strokeWidth="2"
                          className="animate-ping"
                          opacity={0.5}
                        />
                      )}
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Branch List */}
            <div className="lg:col-span-2 space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide pr-2">
              {branches.map((branch, i) => (
                <motion.button
                  key={i}
                  onClick={() => setSelectedBranch(selectedBranch === i ? null : i)}
                  className={`w-full text-left p-5 rounded-xl transition-all duration-300 ${
                    selectedBranch === i
                      ? 'bg-primary-700 text-white shadow-lg'
                      : 'bg-neutral-50 text-neutral-900 hover:bg-neutral-100'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-start gap-3">
                    <Building2
                      size={20}
                      className={`mt-0.5 shrink-0 ${
                        selectedBranch === i ? 'text-white' : 'text-primary-700'
                      }`}
                    />
                    <div>
                      <h3 className="font-bold text-sm mb-1">{branch.name}</h3>
                      <AnimatePresence>
                        {selectedBranch === i && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-start gap-2 mt-2">
                              <MapPin size={14} className="mt-0.5 shrink-0 text-white/70" />
                              <p className="text-xs text-white/80">{branch.address}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <Phone size={14} className="shrink-0 text-white/70" />
                              <p className="text-xs text-white/80">{branch.phone}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
