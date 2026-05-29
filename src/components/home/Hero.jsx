import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#05060f]">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/services/hero/video-2.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.56)_0%,rgba(0,0,0,0.66)_54%,rgba(0,0,0,0.9)_100%)]" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative z-10 flex min-h-screen flex-col justify-center px-4 pt-24 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65 }}
            className="mx-auto max-w-[26ch] text-balance text-4xl font-bold uppercase leading-[1.1] text-white sm:text-5xl md:text-[5rem]"
          >
            Somos rebeldes creativos y amantes de los resultados
          </motion.h1>
        </div>
      </div>
    </section>
  );
};

export default Hero;
