import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import ContentEditorModal from '../components/content/ContentEditorModal';
import { contentClient } from '../services/contentClient';

const categories = [
  'Social Media',
  'Branding',
  'Audiovisual',
  'Fotografia',
  'Menu digital',
  'Diseño de identidad visual',
  'Otro',
];

const toSummaryRecord = (item) => ({
  id: item.id,
  companyName: item.companyName,
  title: item.title,
  slug: item.slug,
  category: item.category,
  showOnHome: item.showOnHome,
  showOnPortfolio: item.showOnPortfolio,
  coverUrl: item.coverUrl,
  coverMimeType: item.coverMimeType,
  logoUrl: item.logoUrl,
  logoMimeType: item.logoMimeType,
  galleryCount: item.galleryCount,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

export default function ContentAdd() {
  const { setRecords } = useOutletContext();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (payload) => {
    if (!payload.companyName.trim()) return;
    try {
      setIsSubmitting(true);
      setError('');

      const item = await contentClient.create({
        companyName: payload.companyName.trim(),
        title: payload.title.trim(),
        category: payload.category,
        showOnHome: payload.showOnHome,
        showOnPortfolio: payload.showOnPortfolio,
        coverFile: payload.coverFile,
        logoFile: payload.logoFile,
        galleryFiles: payload.galleryFiles,
      });

      setRecords((prev) => [toSummaryRecord(item), ...prev]);
    } catch (submitError) {
      setError(submitError.message || 'No se pudo guardar el contenido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      

      <ContentEditorModal
        isOpen
        mode="create"
        categories={categories}
        initialValues={null}
        isSubmitting={isSubmitting}
        error={error}
        inline
        onClose={() => null}
        onSubmit={onSubmit}
      />
    </>
  );
}
