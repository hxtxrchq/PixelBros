import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { quotesClient } from '../services/quotesClient';

const IntranetContext = createContext(null);

const initialCrmRecords = [
  {
    id: 101,
    firstName: 'Sofia',
    lastName: 'Lopez',
    companyName: 'GMS Peru',
    serviceType: 'Social Media',
    monthlyAmount: 8500,
    clientStatus: 'Cliente activo',
    leadSource: 'Referido',
    createdAt: '01/04/2026 09:30:00',
  },
  {
    id: 102,
    firstName: 'Mateo',
    lastName: 'Ruiz',
    companyName: 'Luxia',
    serviceType: 'Audiovisual',
    monthlyAmount: 12000,
    clientStatus: 'Prospecto',
    leadSource: 'Instagram',
    createdAt: '03/04/2026 11:05:00',
  },
];

const initialQuotes = [];

const initialPipeline = [
  {
    id: 501,
    name: 'Luxia - Campana Q2',
    company: 'Luxia',
    contact: 'Mateo Ruiz',
    responsible: 'Erika Bardales',
    interest: 'Alta',
    email: '',
    phone: '',
    businessSector: 'Moda',
    address: '',
    socialHandle: '',
    leadSource: 'Instagram',
    requirement: 'Produccion audiovisual para campana de temporada',
    quoteReference: '',
    estimatedAmount: 12000,
    stage: 'Negociacion',
    createdAt: '03/04/2026 11:05:00',
    updatedAt: '10/04/2026 16:30:00',
    lastContactAt: '10/04/2026 16:30:00',
  },
  {
    id: 502,
    name: 'Laboralis - Branding anual',
    company: 'Laboralis',
    contact: 'Daniela Diaz',
    responsible: 'Camila Torres',
    interest: 'Media',
    email: '',
    phone: '',
    businessSector: 'Servicios',
    address: '',
    socialHandle: '',
    leadSource: 'Referido',
    requirement: 'Rebranding completo + lineamientos de marca',
    quoteReference: '',
    estimatedAmount: 9800,
    stage: 'Reunion',
    createdAt: '05/04/2026 10:15:00',
    updatedAt: '09/04/2026 09:00:00',
    lastContactAt: '09/04/2026 09:00:00',
  },
];

const initialBrands = [
  {
    id: 701,
    brandName: 'GMS Peru',
    clientManager: 'Sofia Lopez',
    servicesActive: 'Social Media',
    monthlyAmount: 8500,
    startDate: '2025-06-01',
    endDate: '2026-06-01',
    reach: 180000,
    engagement: '4.8%',
    leads: 54,
    adSpend: 3200,
    attributedSales: 28500,
    paymentStatus: 'Pagado',
    invoicesIssued: 10,
  },
  {
    id: 702,
    brandName: 'Luxia',
    clientManager: 'Mateo Ruiz',
    servicesActive: 'Audiovisual',
    monthlyAmount: 12000,
    startDate: '2026-01-15',
    endDate: '2026-07-15',
    reach: 124000,
    engagement: '3.9%',
    leads: 28,
    adSpend: 4100,
    attributedSales: 22300,
    paymentStatus: 'Pendiente',
    invoicesIssued: 4,
  },
];

const initialRequests = [
  {
    id: 901,
    project: 'Campaña Mayo',
    client: 'GMS Peru',
    requestType: 'Diseno',
    description: 'Adaptaciones de piezas para ads',
    deadline: '2026-04-15',
    responsible: 'Camila',
    status: 'En proceso',
  },
];

const initialSales = [
  {
    id: 1201,
    sourceQuoteId: 301,
    invoiceNumber: 'FV-202604-1201',
    client: 'Sofia Lopez',
    company: 'GMS Peru',
    service: 'Social Media',
    monthlyAmount: 8500,
    startDate: '2026-04-04',
    invoiceDate: '2026-04-04',
    duration: '12 meses',
    responsible: 'Alonso',
    createdById: 'seed-alonso',
    createdByName: 'Alonso',
    createdByRole: 'TI_ADMIN',
    billingStatus: 'Facturado',
  },
];

const STAGE_ORDER = [
  'Lead',
  'Reunion',
  'Negociacion',
  'No desea',
  'Desea luego',
  'Sin respuestas',
  'Cierre venta',
];

const PIPELINE_DEFAULT_STAGE = 'Lead';

const buildInvoiceNumber = (seed = Date.now()) => {
  const date = new Date();
  const period = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  const suffix = String(seed).slice(-4).padStart(4, '0');
  return `FV-${period}-${suffix}`;
};

const getNowTimestamp = () => new Date().toLocaleString('es-PE');

const normalizePipelineDeal = (payload = {}) => {
  const now = getNowTimestamp();
  const attachments = Array.isArray(payload.attachments)
    ? payload.attachments.filter((attachment) => attachment && attachment.name && attachment.dataUrl)
    : [];

  return {
    name: payload.name || payload.company || 'Sin nombre',
    company: payload.company || '',
    contact: payload.contact || '',
    responsible: payload.responsible || '',
    interest: payload.interest || 'Media',
    email: payload.email || '',
    phone: payload.phone || '',
    businessSector: payload.businessSector || '',
    address: payload.address || '',
    socialHandle: payload.socialHandle || '',
    leadSource: payload.leadSource || 'Referido',
    requirement: payload.requirement || payload.serviceInterested || '',
    quoteReference: payload.quoteReference || '',
    clientId: payload.clientId || null,
    clientLabel: payload.clientLabel || '',
    estimatedAmount: Number(payload.estimatedAmount) || 0,
    stage: payload.stage || PIPELINE_DEFAULT_STAGE,
    attachments,
    createdAt: payload.createdAt || now,
    updatedAt: now,
    lastContactAt: now,
  };
};

export function IntranetProvider({ children }) {
  const { user } = useAuth();
  const [theme, setTheme] = useState('light');
  const [crmRecords, setCrmRecords] = useState(initialCrmRecords);
  const [quotes, setQuotes] = useState(initialQuotes);
  const [quotesLoading, setQuotesLoading] = useState(false);
  const [quotesError, setQuotesError] = useState('');
  const [pipelineDeals, setPipelineDeals] = useState(initialPipeline);
  const [brands, setBrands] = useState(initialBrands);
  const [requests, setRequests] = useState(initialRequests);
  const [salesRecords, setSalesRecords] = useState(initialSales);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('intranet-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem('intranet-theme', next);
      return next;
    });
  };

  const addCrmRecord = (payload) => {
    setCrmRecords((prev) => [
      {
        id: Date.now(),
        createdAt: new Date().toLocaleString('es-PE'),
        ...payload,
      },
      ...prev,
    ]);
  };

  const updateCrmRecord = (id, patch) => {
    setCrmRecords((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const deleteCrmRecord = (id) => {
    setCrmRecords((prev) => prev.filter((item) => item.id !== id));
  };

  const applyQuoteApprovalEffects = (quote) => {
    const existingCrm = crmRecords.find(
      (item) => item.companyName.toLowerCase() === quote.company.toLowerCase(),
    );

    if (existingCrm) {
      setCrmRecords((prev) =>
        prev.map((item) =>
          item.id === existingCrm.id
            ? {
                ...item,
                clientStatus: 'Cliente activo',
                monthlyAmount: Number(quote.finalPrice) || item.monthlyAmount,
                serviceType: quote.serviceType,
              }
            : item,
        ),
      );
    } else {
      setCrmRecords((prev) => [
        {
          id: Date.now() + 2,
          firstName: quote.client.split(' ')[0] || quote.client,
          lastName: quote.client.split(' ').slice(1).join(' ') || '',
          companyName: quote.company,
          serviceType: quote.serviceType,
          monthlyAmount: Number(quote.finalPrice) || 0,
          clientStatus: 'Cliente activo',
          leadSource: 'Web',
          createdAt: new Date().toLocaleString('es-PE'),
        },
        ...prev,
      ]);
    }

    setSalesRecords((prev) => {
      const already = prev.some((sale) => sale.sourceQuoteId === quote.id);
      if (already) return prev;
      return [
        {
          id: Date.now() + 3,
          sourceQuoteId: quote.id,
          invoiceNumber: buildInvoiceNumber(quote.id),
          client: quote.client,
          company: quote.company,
          service: quote.serviceType,
          monthlyAmount: Number(quote.finalPrice) || 0,
          startDate: new Date().toISOString().slice(0, 10),
          invoiceDate: new Date().toISOString().slice(0, 10),
          duration: quote.duration,
          responsible: user?.fullName || 'Equipo comercial',
          createdById: user?.id ?? null,
          createdByName: user?.fullName || 'Equipo comercial',
          createdByRole: user?.role || null,
          billingStatus: 'Pendiente',
        },
        ...prev,
      ];
    });

    setPipelineDeals((prev) =>
      prev.map((deal) =>
        deal.company.toLowerCase() === quote.company.toLowerCase()
          ? {
              ...deal,
              stage: 'Cierre venta',
              estimatedAmount: Number(quote.finalPrice) || deal.estimatedAmount,
              updatedAt: getNowTimestamp(),
              lastContactAt: getNowTimestamp(),
            }
          : deal,
      ),
    );
  };

  const loadQuotes = async () => {
    setQuotesLoading(true);
    setQuotesError('');

    try {
      const items = await quotesClient.list();
      setQuotes(items);
    } catch (error) {
      setQuotesError(error instanceof Error ? error.message : 'No se pudo sincronizar cotizaciones');
    } finally {
      setQuotesLoading(false);
    }
  };

  useEffect(() => {
    void loadQuotes();
  }, []);

  const addQuote = async (payload) => {
    const item = await quotesClient.create(payload);
    setQuotes((prev) => [item, ...prev]);

    setPipelineDeals((prev) => [
      {
        id: Date.now() + 1,
        name: `${item.company} - ${item.serviceType}`,
        company: item.company,
        contact: item.client,
        responsible: 'Equipo comercial',
        interest: 'Alta',
        requirement: item.serviceType,
        estimatedAmount: Number(item.finalPrice) || 0,
        stage: 'Negociacion',
        leadSource: 'Web',
        attachments: [],
        createdAt: getNowTimestamp(),
        updatedAt: getNowTimestamp(),
        lastContactAt: getNowTimestamp(),
      },
      ...prev,
    ]);

    return item;
  };

  const updateQuoteStatus = async (quoteId, status) => {
    const current = quotes.find((item) => item.id === quoteId);
    if (!current) return null;

    const updated = await quotesClient.updateStatus(quoteId, status);
    setQuotes((prev) => prev.map((item) => (item.id === quoteId ? updated : item)));

    if (status === 'Aprobada' && current.status !== 'Aprobada') {
      applyQuoteApprovalEffects(updated);
    }

    return updated;
  };

  const deleteQuote = async (quoteId) => {
    await quotesClient.remove(quoteId);
    setQuotes((prev) => prev.filter((item) => item.id !== quoteId));
  };

  const addPipelineDeal = (payload) => {
    setPipelineDeals((prev) => [
      {
        id: Date.now(),
        ...normalizePipelineDeal(payload),
      },
      ...prev,
    ]);
  };

  const updatePipelineStage = (dealId, stage) => {
    const now = getNowTimestamp();
    setPipelineDeals((prev) =>
      prev.map((item) =>
        item.id === dealId
          ? {
              ...item,
              stage,
              updatedAt: now,
              lastContactAt: now,
            }
          : item,
      ),
    );
  };

  const updatePipelineDeal = (dealId, patch) => {
    const now = getNowTimestamp();
    setPipelineDeals((prev) =>
      prev.map((item) =>
        item.id === dealId
          ? {
              ...item,
              ...patch,
              updatedAt: now,
              lastContactAt: now,
            }
          : item,
      ),
    );
  };

  const removePipelineAttachment = (dealId, attachmentId) => {
    setPipelineDeals((prev) =>
      prev.map((item) =>
        item.id === dealId
          ? { ...item, attachments: (item.attachments || []).filter((a) => a.id !== attachmentId), updatedAt: getNowTimestamp() }
          : item,
      ),
    );
  };

  const deletePipelineDeal = (dealId) => {
    setPipelineDeals((prev) => prev.filter((item) => item.id !== dealId));
  };

  const addBrand = (payload) => {
    setBrands((prev) => [
      {
        id: Date.now(),
        ...payload,
      },
      ...prev,
    ]);
  };

  const updateBrand = (id, patch) => {
    setBrands((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const addRequest = (payload) => {
    setRequests((prev) => [
      {
        id: Date.now(),
        ...payload,
      },
      ...prev,
    ]);
  };

  const updateRequestStatus = (id, status) => {
    setRequests((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const addSaleRecord = (payload) => {
    const creatorName = payload.createdByName || user?.fullName || payload.responsible || 'Equipo comercial';
    const creatorRole = payload.createdByRole || user?.role || null;
    setSalesRecords((prev) => [
      {
        id: Date.now(),
        ...payload,
        responsible: payload.responsible || creatorName,
        createdById: payload.createdById ?? user?.id ?? null,
        createdByName: creatorName,
        createdByRole: creatorRole,
        invoiceNumber: payload.invoiceNumber || buildInvoiceNumber(),
        invoiceDate: payload.invoiceDate || payload.startDate || new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
  };

  const updateSaleRecord = (id, patch) => {
    setSalesRecords((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...patch,
              createdById: item.createdById ?? patch.createdById ?? null,
              createdByName: item.createdByName || patch.createdByName || item.responsible,
              createdByRole: item.createdByRole || patch.createdByRole || null,
              monthlyAmount: patch.monthlyAmount !== undefined ? Number(patch.monthlyAmount) || 0 : item.monthlyAmount,
              invoiceDate: patch.invoiceDate || item.invoiceDate,
            }
          : item,
      ),
    );
  };

  const deleteSaleRecord = (id) => {
    setSalesRecords((prev) => prev.filter((item) => item.id !== id));
  };

  const updateSaleBillingStatus = (id, billingStatus) => {
    setSalesRecords((prev) => prev.map((item) => (item.id === id ? { ...item, billingStatus } : item)));
  };

  const metrics = useMemo(() => {
    const monthlyBilling = salesRecords.reduce((acc, item) => acc + (Number(item.monthlyAmount) || 0), 0);
    const activeClients = crmRecords.filter((item) => item.clientStatus === 'Cliente activo').length;
    const prospects = crmRecords.filter((item) => item.clientStatus === 'Prospecto').length;
    const quotesSent = quotes.filter((item) => item.status === 'Enviada').length;

    return {
      monthlyBilling,
      activeClients,
      prospects,
      quotesSent,
      monthlyTarget: 120000,
      projectedClose: Math.round(monthlyBilling * 1.15),
      stageOrder: STAGE_ORDER,
    };
  }, [crmRecords, quotes, salesRecords]);

  const value = {
    theme,
    toggleTheme,
    crmRecords,
    quotes,
    quotesLoading,
    quotesError,
    pipelineDeals,
    brands,
    requests,
    salesRecords,
    metrics,
    addCrmRecord,
    updateCrmRecord,
    deleteCrmRecord,
    addQuote,
    updateQuoteStatus,
    deleteQuote,
    loadQuotes,
    addPipelineDeal,
    updatePipelineStage,
    updatePipelineDeal,
    removePipelineAttachment,
    deletePipelineDeal,
    addBrand,
    updateBrand,
    addRequest,
    updateRequestStatus,
    addSaleRecord,
    updateSaleRecord,
    deleteSaleRecord,
    updateSaleBillingStatus,
  };

  return <IntranetContext.Provider value={value}>{children}</IntranetContext.Provider>;
}

export function useIntranet() {
  const ctx = useContext(IntranetContext);
  if (!ctx) throw new Error('useIntranet debe usarse dentro de IntranetProvider');
  return ctx;
}
