import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

/**
 * usePageTitle Hook
 * Dynamically updates the document title based on the current route
 *
 * @param pageTitleOverride - Optional override for the page title (used for dynamic titles like ping detail)
 *
 * Usage:
 * - usePageTitle() - for static title pages (Feed, History, etc)
 * - usePageTitle(pingTitle) - for dynamic pages (PingDetail)
 */
export const usePageTitle = (pageTitleOverride?: string) => {
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    const pathname = location.pathname;
    let title = "Echo";

    // If an override is provided (e.g., dynamic ping title), use it
    if (pageTitleOverride) {
      title = pageTitleOverride;
    }
    // Feed pages
    else if (pathname === "/feed" || pathname === "/") {
      title = "Feed | Echo";
    }
    // Ping detail page
    else if (pathname.startsWith("/feed/") && params.pingId) {
      title = "Ping | Echo";
    }
    // History pages
    else if (pathname === "/history" || pathname.startsWith("/history/")) {
      title = "History | Echo";
    }
    // User profile pages
    else if (pathname === "/user/profile") {
      title = "Profile | Echo";
    } else if (pathname === "/user/privacy") {
      title = "Privacy | Echo";
    } else if (pathname === "/user/account") {
      title = "Account | Echo";
    } else if (pathname === "/user/notification") {
      title = "Notifications | Echo";
    }
    // Admin pages
    else if (pathname === "/admin/profile") {
      title = "Admin Profile | Echo";
    } else if (pathname === "/admin/account") {
      title = "Admin Account | Echo";
    } else if (pathname === "/admin/notification") {
      title = "Admin Notifications | Echo";
    } else if (pathname === "/admin/feed") {
      title = "Admin Feed | Echo";
    } else if (pathname === "/admin/overview") {
      title = "Overview | Echo";
    } else if (pathname === "/admin/followUp") {
      title = "Follow Up | Echo";
    } else if (pathname.startsWith("/admin/feed/details/")) {
      title = "Post Details | Echo";
    }
    // Auth pages
    else if (pathname === "/login") {
      title = "Log In | Echo";
    } else if (pathname === "/signUp") {
      title = "Sign Up | Echo";
    } else if (pathname === "/verification") {
      title = "Verification | Echo";
    } else if (pathname === "/find-institution") {
      title = "Find Institution | Echo";
    } else if (pathname === "/waiting-room") {
      title = "Waiting Room | Echo";
    } else if (pathname === "/reset-password") {
      title = "Reset Password | Echo";
    }

    document.title = title;
  }, [location, params, pageTitleOverride]);
};
