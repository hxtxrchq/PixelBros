import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PanelRoute — protege una ruta del dashboard según dashboardPanels del usuario.
 *
 * Reglas:
 *  - GLOBAL_ADMIN siempre tiene acceso a todo.
 *  - Cualquier otro rol solo accede si su dashboardPanels incluye la panelKey requerida.
 *  - Si dashboardPanels está vacío o no incluye la key, redirige a /intranet/dashboard.
 */
export default function PanelRoute({ panelKey, children }) {
  const { user, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) return null;

  // GLOBAL_ADMIN tiene acceso irrestricto
  if (user?.role === 'GLOBAL_ADMIN') return children;

  const allowed = Array.isArray(user?.dashboardPanels) ? user.dashboardPanels : [];

  if (!allowed.includes(panelKey)) {
    return <Navigate to="/intranet/dashboard" replace state={{ from: location, denied: panelKey }} />;
  }

  return children;
}
