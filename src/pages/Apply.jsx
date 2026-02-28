import { useState } from 'react';
import { motion } from 'framer-motion';

const Apply = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [replyTo, setReplyTo] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitted(false);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch('https://formspree.io/f/xojnwjpp', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      if (!response.ok && (response.status < 300 || response.status >= 400)) {
        let backendMessage = '';
        try {
          const data = await response.json();
          if (data?.errors?.length) {
            backendMessage = data.errors.map((item) => item.message).join(' ');
          }
        } catch {
          backendMessage = '';
        }
        throw new Error(backendMessage || 'Error al enviar el formulario');
      }

      setSubmitted(true);
      setSubmitError('');
      form.reset();
      setReplyTo('');
    } catch (error) {
      setSubmitted(false);
      setSubmitError(error?.message || 'No pudimos enviar tu postulación. Inténtalo nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-transparent pt-32 pb-20"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e73c50] mb-4">
            Únete a nuestro equipo
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-4 text-white">
            Formulario de <span className="text-[#e73c50]">Postulación</span>
          </h1>
          <p className="text-lg text-white/65 max-w-3xl mx-auto">
            Queremos conocerte. Completa el formulario y cuéntanos sobre tu experiencia y proyectos.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/5 p-8 md:p-10 rounded-2xl border border-white/10"
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <input type="hidden" name="_subject" value="Nueva postulación - PixelBros" />
            <input type="hidden" name="_replyto" value={replyTo} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-[#111111] mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="Nombre completo"
                  required
                  className="w-full px-4 py-3 bg-white border border-[#F0E6E8] rounded-lg focus:border-[#B3262E] focus:outline-none transition-colors text-[#1F1F1F] placeholder-[#4A4A4A]"
                  placeholder="Tu nombre y apellido"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#111111] mb-2">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  name="Correo"
                  required
                  onChange={(event) => setReplyTo(event.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#F0E6E8] rounded-lg focus:border-[#B3262E] focus:outline-none transition-colors text-[#1F1F1F] placeholder-[#4A4A4A]"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-[#111111] mb-2">
                  Número de contacto *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="Telefono"
                  required
                  className="w-full px-4 py-3 bg-white border border-[#F0E6E8] rounded-lg focus:border-[#B3262E] focus:outline-none transition-colors text-[#1F1F1F] placeholder-[#4A4A4A]"
                  placeholder="+51 999 555 444"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-3">
                1. A que puesto(s) deseas postular? *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Audiovisual',
                  'Content Creator',
                  'Diseñador Gráfico',
                ].map((role) => (
                  <label key={role} className="flex items-center gap-3 rounded-lg border border-[#F0E6E8] bg-white px-4 py-3">
                    <input
                      type="checkbox"
                      name="Puestos"
                      value={role}
                      className="text-[#B3262E]"
                    />
                    <span className="text-sm text-[#1F1F1F]">{role}</span>
                  </label>
                ))}
                <label className="flex items-center gap-3 rounded-lg border border-[#F0E6E8] bg-white px-4 py-3">
                  <input
                    type="checkbox"
                    name="Puestos"
                    value="Otro"
                    className="text-[#B3262E]"
                  />
                  <span className="text-sm text-[#1F1F1F]">Otro</span>
                  <input
                    type="text"
                    name="Puesto - Otro"
                    placeholder="Especificar"
                    className="ml-auto w-full max-w-[160px] px-2 py-1 border border-[#F0E6E8] rounded-md text-sm"
                  />
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-semibold text-[#111111] mb-2">
                2. Cuéntanos brevemente sobre tu experiencia relacionada al puesto que elegiste. *
              </label>
              <textarea
                id="experience"
                name="Experiencia"
                required
                rows="4"
                className="w-full px-4 py-3 bg-white border border-[#F0E6E8] rounded-lg focus:border-[#B3262E] focus:outline-none transition-colors text-[#1F1F1F] resize-none placeholder-[#4A4A4A]"
                placeholder="Describe tu experiencia relevante"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-3">
                3. ¿Qué modalidad estás buscando actualmente? *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Full time',
                  'Part time',
                  'Freelance / por proyecto',
                  'Indiferente / a conversar',
                ].map((option) => (
                  <label key={option} className="flex items-center gap-3 rounded-lg border border-[#F0E6E8] bg-white px-4 py-3">
                    <input
                      type="radio"
                      name="Modalidad"
                      value={option}
                      required
                      className="text-[#B3262E]"
                    />
                    <span className="text-sm text-[#1F1F1F]">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="salary" className="block text-sm font-semibold text-[#111111] mb-2">
                4. ¿Cuál es tu expectativa económica mensual (en soles)?
              </label>
              <input
                type="text"
                id="salary"
                name="Expectativa economica"
                className="w-full px-4 py-3 bg-white border border-[#F0E6E8] rounded-lg focus:border-[#B3262E] focus:outline-none transition-colors text-[#1F1F1F] placeholder-[#4A4A4A]"
                placeholder="S/ 0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">
                5. Comparte el enlace de tu CV y/o portafolio
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-[#4A4A4A] mb-1.5">CV <span className="text-[#B3262E]">*</span></p>
                  <input
                    type="url"
                    name="CV"
                    required
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full px-4 py-3 bg-white border border-[#F0E6E8] rounded-lg focus:border-[#B3262E] focus:outline-none transition-colors text-[#1F1F1F] placeholder-[#4A4A4A]"
                  />
                </div>
                <div>
                  <p className="text-xs text-[#4A4A4A] mb-1.5">Behance / Portafolio <span className="font-normal text-[#888]">(opcional)</span></p>
                  <input
                    type="url"
                    name="Portafolio"
                    placeholder="https://behance.net/tuusuario"
                    className="w-full px-4 py-3 bg-white border border-[#F0E6E8] rounded-lg focus:border-[#B3262E] focus:outline-none transition-colors text-[#1F1F1F] placeholder-[#4A4A4A]"
                  />
                </div>
              </div>
              <p className="text-xs text-[#4A4A4A] mt-2">
                Sube tu CV a Google Drive, configúralo como público y pega el enlace aquí.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              {submitted ? (
                <div className="w-full rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                  Gracias por postular. Revisaremos tu perfil y te contactaremos.
                </div>
              ) : null}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, boxShadow: '0 15px 40px rgba(179, 38, 46, 0.2)' }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className="ml-auto px-6 py-3 bg-[#B3262E] text-white font-bold rounded-lg text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar postulación'}
              </motion.button>
            </div>

            {!submitted && submitError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {submitError}
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Apply;
