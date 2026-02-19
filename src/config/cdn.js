// Configuración del CDN para assets grandes
// Usar esta configuración para servir videos y archivos grandes desde un CDN externo

const CDN_CONFIG = {
  // Cambia esto a true cuando tengas configurado tu CDN
  enabled: false,
  
  // URL base de tu CDN (Cloudinary, S3, etc.)
  baseUrl: 'https://res.cloudinary.com/tu-usuario/video/upload/',
  
  // Tamaño mínimo para usar CDN (en bytes). Por defecto 10MB
  minFileSize: 10 * 1024 * 1024,
  
  // Tipos de archivo que deberían usar CDN
  fileTypes: ['.mp4', '.webm', '.mov'],
};

/**
 * Determina si un asset debe cargarse desde CDN
 * @param {string} assetPath - Ruta del asset
 * @returns {boolean}
 */
export const shouldUseCDN = (assetPath) => {
  if (!CDN_CONFIG.enabled) return false;
  
  const ext = assetPath.substring(assetPath.lastIndexOf('.')).toLowerCase();
  return CDN_CONFIG.fileTypes.includes(ext);
};

/**
 * Convierte una ruta local a URL de CDN
 * @param {string} localPath - Ruta local del asset
 * @returns {string}
 */
export const getCDNUrl = (localPath) => {
  if (!CDN_CONFIG.enabled) return localPath;
  
  // Extraer el nombre del archivo
  const fileName = localPath.split('/').pop();
  const pathParts = localPath.split('/Portfolio/')[1];
  
  if (!pathParts) return localPath;
  
  // Construir URL del CDN preservando la estructura de carpetas
  const cdnPath = pathParts.replace(/\\/g, '/');
  return `${CDN_CONFIG.baseUrl}${cdnPath}`;
};

/**
 * Wrapper para manejar assets que pueden estar en CDN o local
 * @param {string} assetPath - Ruta del asset
 * @param {any} localModule - Módulo local importado
 * @returns {string}
 */
export const getAssetUrl = (assetPath, localModule) => {
  if (shouldUseCDN(assetPath)) {
    return getCDNUrl(assetPath);
  }
  return localModule;
};

export default CDN_CONFIG;
