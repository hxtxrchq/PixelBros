import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

const TechShowcase = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    if (!videoRef.current) return;
    try {
      await videoRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <section className="bg-[#06071a] pt-4 pb-16 sm:pt-8 sm:pb-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-[22ch] text-center text-4xl font-bold leading-[1.1] text-white sm:text-5xl"
        >
          <span className="text-[#4a49a8]">Creamos tecnologia</span> que impulsa marcas, productos y{' '}
          <span className="text-[#e73c50]">resultados</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="relative mx-auto mt-10 max-w-5xl"
        >
          <div className="relative overflow-hidden rounded-3xl">
            <video
              ref={videoRef}
              className="h-[320px] w-full object-cover sm:h-[460px] lg:h-[560px]"
              controls={isPlaying}
              muted
              playsInline
              preload="metadata"
            >
              <source src="/services/hero/video-2.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(74,73,168,0.18)_0%,rgba(0,0,0,0.25)_45%,rgba(0,0,0,0.56)_100%)]" />

            {!isPlaying ? (
              <button
                type="button"
                onClick={handlePlay}
                aria-label="Reproducir video"
                className="absolute left-1/2 top-1/2 inline-flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#4a49a8]/80 bg-[#4a49a8]/20 backdrop-blur-sm transition hover:scale-105"
              >
                <span className="ml-1 text-3xl text-[#4a49a8]">▶</span>
              </button>
            ) : null}
          </div>

          <p className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[4.2rem] font-black uppercase leading-none text-white sm:-bottom-10 sm:text-[7rem] lg:text-[10rem]">
            Pixel <span className="text-[#e73c50]">Bros</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TechShowcase;
