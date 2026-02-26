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
  const [rolOtro, setRolOtro] = useState(false);
  const [objetivoOtro, setObjetivoOtro] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);

  const SERVICES = [
    'Gestion de contenido / redes sociales',
    'Fotografia profesional',
    'Produccion audiovisual',
    'Branding / identidad de marca',
    'Campanas publicitarias',
    'Activaciones BTL',
    'Estrategia comercial y crecimiento de marca',
    'No estoy seguro / necesito guia',
  ];

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedServices.length === 0) {
      setSubmitError('Por favor selecciona al menos un servicio.');
      return;
    }
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
      setSelectedServices([]);
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
      className="min-h-screen bg-transparent pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6 text-white">
            Hablemos de tu <span className="text-[#e73c50]">Proyecto</span>
          </h1>
          <p className="text-xl text-white/65 max-w-3xl mx-auto">
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
            <div className="bg-[#0d0e24] p-8 rounded-2xl">
              

              <form
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                <input type="hidden" name="_subject" value="Nuevo cliente - PixelBros" />
                <input type="hidden" name="_replyto" value={replyTo} />
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-display font-bold text-white">Datos</h3>
                    <span className="text-sm text-white/50">Paso {step} de 2</span>
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
                    <label className="block text-sm font-semibold text-[#111111] mb-2">
                      Cargo / rol dentro de la empresa *
                    </label>
                    <div className="relative">
                      <select
                        name="Rol"
                        required
                        onChange={(e) => setRolOtro(e.target.value === 'Otro')}
                        className="w-full px-4 py-3 bg-white border border-[#F0E6E8] rounded-lg focus:border-[#B3262E] focus:outline-none transition-colors text-[#1F1F1F] appearance-none cursor-pointer"
                      >
                        <option value="">Selecciona tu cargo...</option>
                        {['Dueño(a) / Fundador(a)', 'Gerencia / Dirección', 'Marketing / Comunicación', 'Ventas / Comercial', 'Otro'].map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-[#4A4A4A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                      </div>
                    </div>
                    {rolOtro && (
                      <input
                        type="text"
                        name="Rol - Otro"
                        placeholder="Especifica tu cargo"
                        className="mt-2 w-full px-4 py-3 bg-white border border-[#F0E6E8] rounded-lg focus:border-[#B3262E] focus:outline-none transition-colors text-[#1F1F1F] placeholder-[#4A4A4A]"
                      />
                    )}
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
                        className="px-6 py-3 bg-[#e73c50] text-white font-bold rounded-full text-sm hover:bg-[#c82d40] transition-colors"
                      >
                        Siguiente
                      </motion.button>
                    </div>
                  </div>

                  <div className={step === 2 ? 'space-y-6' : 'hidden'}>
                    <h3 className="text-lg font-display font-bold text-white mb-4">Tu Proyecto</h3>
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
                      <label className="block text-sm font-semibold text-[#111111] mb-2">
                        ¿Qué tamaño tiene tu empresa actualmente? *
                      </label>
                      <div className="relative">
                        <select
                          name="Tamano de empresa"
                          required
                          className="w-full px-4 py-3 bg-white border border-[#F0E6E8] rounded-lg focus:border-[#B3262E] focus:outline-none transition-colors text-[#1F1F1F] appearance-none cursor-pointer"
                        >
                          <option value="">Selecciona el tamaño...</option>
                          {['Marca personal', '1-5 personas', '6-20 personas', '21-50 personas', '+50 personas'].map((size) => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <svg className="w-4 h-4 text-[#4A4A4A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#111111] mb-2">
                        ¿Qué servicios estás buscando? (puedes elegir varios) *
                      </label>
                      <input type="hidden" name="Servicios" value={selectedServices.join(', ')} />
                      <div className="flex flex-wrap gap-2">
                        {SERVICES.map((service) => {
                          const active = selectedServices.includes(service);
                          return (
                            <button
                              type="button"
                              key={service}
                              onClick={() => toggleService(service)}
                              className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none ${
                                active
                                  ? 'bg-[#e73c50] border-[#e73c50] text-white'
                                  : 'bg-white border-[#F0E6E8] text-[#1F1F1F] hover:border-[#e73c50] hover:text-[#e73c50]'
                              }`}
                            >
                              {active && <span className="mr-1">✓</span>}{service}
                            </button>
                          );
                        })}
                      </div>
                      {selectedServices.length === 0 && (
                        <p className="mt-2 text-[10px] text-[#4A4A4A]">Toca los servicios que necesitas para seleccionarlos.</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#111111] mb-2">
                        ¿Qué objetivo principal quieres lograr? *
                      </label>
                      <div className="relative">
                        <select
                          name="Objetivo principal"
                          required
                          onChange={(e) => setObjetivoOtro(e.target.value === 'Otro')}
                          className="w-full px-4 py-3 bg-white border border-[#F0E6E8] rounded-lg focus:border-[#B3262E] focus:outline-none transition-colors text-[#1F1F1F] appearance-none cursor-pointer"
                        >
                          <option value="">Selecciona un objetivo...</option>
                          {[
                            'Aumentar ventas',
                            'Mejorar imagen de marca',
                            'Generar mas clientes potenciales',
                            'Lanzamiento de producto/servicio',
                            'Ordenar estrategia comercial y comunicacion',
                            'Escalar mi negocio',
                            'Otro',
                          ].map((goal) => (
                            <option key={goal} value={goal}>{goal}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <svg className="w-4 h-4 text-[#4A4A4A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                        </div>
                      </div>
                      {objetivoOtro && (
                        <input
                          type="text"
                          name="Objetivo - Otro"
                          placeholder="Describe tu objetivo"
                          className="mt-2 w-full px-4 py-3 bg-white border border-[#F0E6E8] rounded-lg focus:border-[#B3262E] focus:outline-none transition-colors text-[#1F1F1F] placeholder-[#4A4A4A]"
                        />
                      )}
                    </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-between">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep(1)}
                        className="px-6 py-3 bg-white/8 rounded-lg text-sm font-semibold text-white/70 hover:bg-white/12 transition-colors"
                      >
                        Volver
                      </motion.button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02, boxShadow: '0 15px 40px rgba(231, 60, 80, 0.25)' }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-[#e73c50] text-white font-bold rounded-full text-sm hover:bg-[#c82d40] transition-colors disabled:opacity-60"
                      >
                        {isSubmitting ? 'Enviando...' : 'Enviar informacion'}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </form>

              {submitError && (
                <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-400">
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
            <div className="bg-[#0d0e24] p-8 rounded-2xl">
              <h3 className="text-2xl font-display font-bold mb-6 text-white">
                Contacto <span className="text-[#e73c50]">Directo</span>
              </h3>
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <motion.a
                    key={index}
                    href={method.link}
                    target={method.link.startsWith('http') ? '_blank' : undefined}
                    rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    whileHover={{ x: 5 }}
                    className="flex items-start p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group"
                  >
                    <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-[#e73c50]/10 flex items-center justify-center mr-4 group-hover:bg-[#e73c50]/20 transition-all">
                      <SvgIcon 
                        path={method.iconPath}
                        className="w-6 h-6 text-[#e73c50]"
                        variant={method.iconType}
                      />
                    </div>
                    <div>
                      <div className="text-sm text-white/50 mb-1">{method.title}</div>
                      <div className="text-white/90 group-hover:text-[#e73c50] transition-colors">
                        {method.value}
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

          

            {/* Quick CTA */}
              <div className="bg-[#0d0e24] p-8 rounded-2xl text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-[#e73c50]/10 flex items-center justify-center">
                <svg 
                  className="w-6 h-6 text-[#e73c50]" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-bold mb-3 text-white">
                ¿Necesitas una respuesta rápida?
              </h3>
              <p className="text-white/60 mb-4 text-sm">
                Chatea con nosotros por WhatsApp y recibe atención inmediata
              </p>
              <a
                href="https://wa.me/51959212496"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(231, 60, 80, 0.25)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-[#e73c50] text-white font-bold rounded-full hover:bg-[#c82d40] transition-colors"
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
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#0d0e24] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="text-lg font-display font-bold text-white">
                Agendar reunion inicial
              </div>
              <button
                type="button"
                onClick={() => setScheduleModalOpen(false)}
                className="px-3 py-1.5 rounded-full border border-white/20 text-white/80 text-sm"
              >
                Cerrar
              </button>
            </div>
            <div className="p-8">
              {schedulePhase === 'loading' ? (
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-[#e73c50] animate-spin" />
                  <div className="text-white/70">Procesando tu informacion...</div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-white/70 mb-6">
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
                    className="w-full px-6 py-3 bg-[#e73c50] text-white font-bold rounded-full text-sm hover:bg-[#c82d40] transition-colors"
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
          <div className="relative w-full max-w-4xl rounded-2xl bg-[#0d0e24] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="text-lg font-display font-bold text-white">
                Agendar reunion inicial
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCalendlyOpen(false);
                  setScheduled(true);
                }}
                className="px-3 py-1.5 rounded-full border border-white/20 text-white/80 text-sm"
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
          <div className="w-full max-w-xl rounded-2xl bg-[#0d0e24] p-8 shadow-2xl text-center">
            <h3 className="text-2xl font-display font-bold mb-3 text-white">
              Gracias por completar el formulario
            </h3>
            <p className="text-white/65 mb-6">
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
              className="px-6 py-3 bg-[#e73c50] text-white font-bold rounded-full text-sm hover:bg-[#c82d40] transition-colors"
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


