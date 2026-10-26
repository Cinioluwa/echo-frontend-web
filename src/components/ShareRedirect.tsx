import React from "react";
import { useParams, Navigate } from "react-router-dom";

/**
 * ShareRedirect
 * Client-side fallback for /share/:entity/:id routes.
 *
 * When a user navigates to a share URL (e.g. /share/ping/182) and the SPA
 * initializes directly (via Service Worker shell fallback, PWA navigation,
 * or direct internal link), this component redirects seamlessly to the
 * corresponding canonical route (/feed/182) rather than hitting the 404 ErrorPage.
 */
const ShareRedirect: React.FC = () => {
  const { entity, id } = useParams<{ entity: string; id: string }>();

  if (entity === "ping" && id) {
    return <Navigate to={`/feed/${id}`} replace />;
  }

  if (entity === "wave" && id) {
    return <Navigate to={`/feed/${id}`} replace />;
  }

  // Fallback for generic share URLs or unspecified entities
  return <Navigate to="/feed" replace />;
};

export default ShareRedirect;
