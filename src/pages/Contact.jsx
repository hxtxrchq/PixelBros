import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SvgIcon from '../components/SvgIcon';

const Contact = () => {
  const navigate = useNavigate();
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [schedulePhase, setSchedulePhase] = useState('loading');
  const [replyTo, setReplyTo] = useState('');
  const [scheduled, setScheduled] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch('https://formspree.io/f/mvzbrzbn', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al enviar el formulario');
      }

      setSubmitted(true);
      setScheduled(false);
      setSchedulePhase('loading');
      setScheduleModalOpen(true);
      setTimeout(() => setSchedulePhase('ready'), 1200);
    } catch (error) {
      setSubmitError('No pudimos enviar tu informacion. Intentalo nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    { 
      title: 'Email', 
      value: 'pixelbrosperu@outlook.com', 
      link: 'mailto:pixelbrosperu@outlook.com',
      iconPath: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M20 6l-8 5-8-5',
      iconType: 'stroke',
    },
    { 
      title: 'Teléfono', 
      value: '+51959212496', 
      link: 'tel:+51959212496',
      iconPath: 'M2 4.5A2.5 2.5 0 014.5 2h1.372a2 2 0 011.9 1.368l.828 2.485a2 2 0 01-.76 2.262l-1.12.84a12.04 12.04 0 005.245 5.245l.84-1.12a2 2 0 012.262-.76l2.485.828A2 2 0 0118 15.872V17.5A2.5 2.5 0 0115.5 20h-1C7.596 20 2 14.404 2 7.5v-3z',
      iconType: 'fill',
    },
    { 
      title: 'Linkedin', 
      value: 'PixelBros', 
      link: 'https://www.linkedin.com/company/pixelbrospublicidad/?originalSubdomain=pe',
      iconPath: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
      iconType: 'fill',
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6 text-[#1F1F1F]">
            Hablemos de tu <span className="text-[#B3262E]">Proyecto</span>
          </h1>
          <p className="text-xl text-[#4A4A4A] max-w-3xl mx-auto">
            Estamos listos para ayudarte a llevar tu negocio al siguiente nivel. 
            Completa el formulario o contáctanos directamente.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-[#FFF1F3] p-8 rounded-2xl border border-[#F0E6E8]">
              <h2 className="text-3xl font-display font-bold mb-6 text-[#111111]">
                Formulario para clientes
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                <input type="hidden" name="_subject" value="Nuevo cliente - PixelBros" />
                <input type="hidden" name="_replyto" value={replyTo} />
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-display font-bold text-[#1F1F1F]">Datos</h3>
                    <span className="text-sm text-[#4A4A4A]">Paso {step} de 2</span>
                  </div>

                  <div className={step === 1 ? 'space-y-6' : 'hidden'}>
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
                        placeholder="Juan Perez"
                      />
                    </div>

                    <div>
                      <label htmlFor="companyName" className="block text-sm font-semibold text-[#111111] mb-2">
                        Nombre de la empresa o marca *
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="Empresa o marca"
                        required
                        className="w-full px-4 py-3 bg-white border border-[#F0E6E8] rounded-lg focus:border-[#B3262E] focus:outline-none transition-colors text-[#1F1F1F] placeholder-[#4A4A4A]"
                        placeholder="Mi Empresa SAC"
                      />
                    </div>
                  </div>

                    <div className="mt-6">
                    <label className="block text-sm font-semibold text-[#111111] mb-3">
                      Cargo / rol dentro de la empresa *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        'Dueño(a) / Fundador(a)',
                        'Gerencia / Dirección',
                        'Marketing / Comunicación',
                        'Ventas / Comercial',
                      ].map((role) => (
                        <label key={role} className="flex items-center gap-3 rounded-lg border border-[#F0E6E8] bg-white px-4 py-3">
                          <input
                            type="radio"
                            name="Rol"
                            value={role}
                            required
                            className="text-[#B3262E]"
                          />
                          <span className="text-sm text-[#1F1F1F]">{role}</span>
                        </label>
                      ))}
                      <label className="flex items-center gap-3 rounded-lg border border-[#F0E6E8] bg-white px-4 py-3">
                        <input
                          type="radio"
                          name="Rol"
                          value="Otro"
                          required
                          className="text-[#B3262E]"
                        />
                        <span className="text-sm text-[#1F1F1F]">Otro</span>
                        <input
                          type="text"
                          name="Rol - Otro"
                          placeholder="Especificar"
                          className="ml-auto w-full max-w-[160px] px-2 py-1 border border-[#F0E6E8] rounded-md text-sm"
                        />
                      </label>
                    </div>
                  </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label htmlFor="whatsapp" className="block text-sm font-semibold text-[#111111] mb-2">
                        Numero de contacto (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        id="whatsapp"
                        name="WhatsApp"
                        required
                        className="w-full px-4 py-3 bg-white border border-[#F0E6E8] rounded-lg focus:border-[#B3262E] focus:outline-none transition-colors text-[#1F1F1F] placeholder-[#4A4A4A]"
                        placeholder="+51 999 555 444"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-[#111111] mb-2">
                        Correo electronico *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="Correo"
                        required
                        onChange={(event) => setReplyTo(event.target.value)}
                        className="w-full px-4 py-3 bg-white border border-[#F0E6E8] rounded-lg focus:border-[#B3262E] focus:outline-none transition-colors text-[#1F1F1F] placeholder-[#4A4A4A]"
                        placeholder="juan@empresa.com"
                      />
                    </div>
                  </div>

                    <div className="mt-6">
                    <label htmlFor="location" className="block text-sm font-semibold text-[#111111] mb-2">
                      Ciudad / pais *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="Ciudad / pais"
                      required
                      className="w-full px-4 py-3 bg-white border border-[#F0E6E8] rounded-lg focus:border-[#B3262E] focus:outline-none transition-colors text-[#1F1F1F] placeholder-[#4A4A4A]"
                      placeholder="Lima, Peru"
                    />
                  </div>
                    <div className="flex justify-end">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep(2)}
                        className="px-6 py-3 bg-[#B3262E] text-white font-bold rounded-lg text-sm shadow-md"
                      >
                        Siguiente
                      </motion.button>
                    </div>
                  </div>

                  <div className={step === 2 ? 'space-y-6' : 'hidden'}>
                    <h3 className="text-lg font-display font-bold text-[#1F1F1F] mb-4">Seccion 2</h3>
                    <div className="space-y-6">
                    <div>
                      <label htmlFor="why" className="block text-sm font-semibold text-[#111111] mb-2">
                        ¿Por que estas recurriendo a nuestra agencia? Cuentanos para asesorarte *
                      </label>
                      <textarea
                        id="why"
                        name="Motivo"
                        required
                        rows="4"
                        className="w-full px-4 py-3 bg-white border border-[#F0E6E8] rounded-lg focus:border-[#B3262E] focus:outline-none transition-colors text-[#1F1F1F] resize-none placeholder-[#4A4A4A]"
                        placeholder="Cuéntanos lo que necesitas lograr..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#111111] mb-3">
                        ¿Que tamano tiene tu empresa actualmente? *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          'Marca personal',
                          '1-5 personas',
                          '6-20 personas',
                          '21-50 personas',
                          '+50 personas',
                        ].map((size) => (
                          <label key={size} className="flex items-center gap-3 rounded-lg border border-[#F0E6E8] bg-white px-4 py-3">
                            <input
                              type="radio"
                              name="Tamano de empresa"
                              value={size}
                              required
                              className="text-[#B3262E]"
                            />
                            <span className="text-sm text-[#1F1F1F]">{size}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#111111] mb-3">
                        ¿Que servicios estas buscando? (pueden marcar varios) *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          'Gestion de contenido / redes sociales',
                          'Fotografia profesional',
                          'Produccion audiovisual',
                          'Branding / identidad de marca',
                          'Campanas publicitarias',
                          'Activaciones BTL',
                          'Estrategia comercial y crecimiento de marca',
                          'No estoy seguro / necesito guia',
                        ].map((service) => (
                          <label key={service} className="flex items-center gap-3 rounded-lg border border-[#F0E6E8] bg-white px-4 py-3">
                            <input
                              type="checkbox"
                              name="Servicios"
                              value={service}
                              className="text-[#B3262E]"
                            />
                            <span className="text-sm text-[#1F1F1F]">{service}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#111111] mb-3">
                        ¿Que objetivo principal quieres lograr? *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          'Aumentar ventas',
                          'Mejorar imagen de marca',
                          'Generar mas clientes potenciales',
                          'Lanzamiento de producto/servicio',
                          'Ordenar estrategia comercial y comunicacion',
                          'Escalar mi negocio',
                        ].map((goal) => (
                          <label key={goal} className="flex items-center gap-3 rounded-lg border border-[#F0E6E8] bg-white px-4 py-3">
                            <input
                              type="radio"
                              name="Objetivo principal"
                              value={goal}
                              required
                              className="text-[#B3262E]"
                            />
                            <span className="text-sm text-[#1F1F1F]">{goal}</span>
                          </label>
                        ))}
                        <label className="flex items-center gap-3 rounded-lg border border-[#F0E6E8] bg-white px-4 py-3">
                          <input
                            type="radio"
                            name="Objetivo principal"
                            value="Otro"
                            required
                            className="text-[#B3262E]"
                          />
                          <span className="text-sm text-[#1F1F1F]">Otro</span>
                          <input
                            type="text"
                            name="Objetivo - Otro"
                            placeholder="Especificar"
                            className="ml-auto w-full max-w-[160px] px-2 py-1 border border-[#F0E6E8] rounded-md text-sm"
                          />
                        </label>
                      </div>
                    </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-between">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep(1)}
                        className="px-6 py-3 border border-[#F0E6E8] rounded-lg text-sm font-semibold text-[#1F1F1F]"
                      >
                        Volver
                      </motion.button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02, boxShadow: '0 15px 40px rgba(179, 38, 46, 0.2)' }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-[#B3262E] text-white font-bold rounded-lg text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                      >
                        {isSubmitting ? 'Enviando...' : 'Enviar informacion'}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </form>

              {submitError && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {submitError}
                </div>
              )}

              {submitted && null}
            </div>
          </motion.div>

          {/* Contact Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Contact Methods */}
            <div className="bg-[#FFF1F3] p-8 rounded-2xl border border-[#F0E6E8]">
              <h3 className="text-2xl font-display font-bold mb-6 text-[#111111]">
                Contacto <span className="text-[#B3262E]">Directo</span>
              </h3>
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <motion.a
                    key={index}
                    href={method.link}
                    target={method.link.startsWith('http') ? '_blank' : undefined}
                    rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    whileHover={{ x: 5 }}
                    className="flex items-start p-4 bg-white rounded-lg border border-[#F0E6E8] hover:border-[#B3262E] transition-all group"
                  >
                    <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-[#B3262E]/10 flex items-center justify-center mr-4 group-hover:bg-[#B3262E]/20 transition-all">
                      <SvgIcon 
                        path={method.iconPath}
                        className="w-6 h-6 text-[#B3262E]"
                        variant={method.iconType}
                      />
                    </div>
                    <div>
                      <div className="text-sm text-[#4B4B4B] mb-1">{method.title}</div>
                      <div className="text-[#1F1F1F] group-hover:text-[#B3262E] transition-colors">
                        {method.value}
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

          

            {/* Quick CTA */}
            <div className="bg-[#FFF1F3] p-8 rounded-2xl border border-[#F0E6E8] text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-[#B3262E]/10 flex items-center justify-center">
                <svg 
                  className="w-6 h-6 text-[#B3262E]" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-bold mb-3 text-[#111111]">
                ¿Necesitas una respuesta rápida?
              </h3>
              <p className="text-[#4B4B4B] mb-4 text-sm">
                Chatea con nosotros por WhatsApp y recibe atención inmediata
              </p>
              <a
                href="https://wa.me/51959212496"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(179, 38, 46, 0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-[#B3262E] text-white font-bold rounded-lg transition-all shadow-md"
                >
                  Abrir WhatsApp
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0E6E8]">
              <div className="text-lg font-display font-bold text-[#1F1F1F]">
                Agendar reunion inicial
              </div>
              <button
                type="button"
                onClick={() => setScheduleModalOpen(false)}
                className="px-3 py-1.5 rounded-full border border-[#F0E6E8] text-[#1F1F1F] text-sm"
              >
                Cerrar
              </button>
            </div>
            <div className="p-8">
              {schedulePhase === 'loading' ? (
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-full border-4 border-[#F0E6E8] border-t-[#B3262E] animate-spin" />
                  <div className="text-[#4A4A4A]">Procesando tu informacion...</div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-[#4A4A4A] mb-6">
                    Gracias por completar la informacion. El siguiente paso es agendar una reunion breve para entender tu proyecto y proponerte una estrategia clara.
                  </p>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02, boxShadow: '0 12px 24px rgba(179, 38, 46, 0.2)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setScheduleModalOpen(false);
                      setIsCalendlyOpen(true);
                    }}
                    className="w-full px-6 py-3 bg-[#B3262E] text-white font-bold rounded-lg text-sm shadow-md"
                  >
                    📆 Agendar reunion inicial (20–30 min)
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isCalendlyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <div className="relative w-full max-w-4xl rounded-2xl bg-white overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0E6E8]">
              <div className="text-lg font-display font-bold text-[#1F1F1F]">
                Agendar reunion inicial
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCalendlyOpen(false);
                  setScheduled(true);
                }}
                className="px-3 py-1.5 rounded-full border border-[#F0E6E8] text-[#1F1F1F] text-sm"
              >
                Cerrar
              </button>
            </div>
            <div className="h-[70vh]">
              <iframe
                src="https://calendly.com/calonsoparedes1/pixel-pruebas"
                title="Calendly"
                className="h-full w-full"
                frameBorder="0"
              />
            </div>
          </div>
        </div>
      )}

      {scheduled && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-2xl text-center">
            <h3 className="text-2xl font-display font-bold mb-3 text-[#1F1F1F]">
              Gracias por completar el formulario
            </h3>
            <p className="text-[#4A4A4A] mb-6">
              Nos pondremos en contacto contigo. Nos vemos en la reunion.
            </p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setScheduled(false);
                navigate('/');
              }}
              className="px-6 py-3 bg-[#B3262E] text-white font-bold rounded-lg text-sm shadow-md"
            >
              Cerrar
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Contact;


