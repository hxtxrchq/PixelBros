import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#05060f]">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <img
          className="w-[60vw] max-w-[500px] aspect-square object-contain opacity-80"
          src="/hero/herogif.gif"
          alt="Hero Background"
        />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.56)_0%,rgba(0,0,0,0.66)_54%,rgba(0,0,0,0.9)_100%)]" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-24 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl text-center flex flex-col items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-[95vw] lg:max-w-7xl mx-auto flex flex-col items-center justify-center uppercase leading-[1.1] text-white font-display text-center font-black tracking-tight text-lg sm:text-3xl md:text-4xl lg:text-[2.7rem]"
          >
            <span className="block opacity-90">Somos</span>
            <span className="block my-1 sm:my-2 whitespace-nowrap">rebeldes, creativos</span>
            <span className="block whitespace-nowrap opacity-95">y amantes de los resultados</span>
          </motion.h1>
        </div>
      </div>
    </section>
  );
};

export default Hero;

