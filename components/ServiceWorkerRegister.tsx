'use client';

import { useEffect } from "react";

const SERVICE_WORKER_URL = "/service-worker.js";

export function ServiceWorkerRegister() {
  useEffect(() => {
    const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      (!isLocalhost && window.location.protocol !== "https:") ||
      process.env.NODE_ENV === "development"
    ) {
      return;
    }

    let refreshing = false;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register(SERVICE_WORKER_URL, { scope: "/" });
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              newWorker.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });
      } catch (err) {
        console.error("Service worker registration failed:", err);
      }
    };

    const handleControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    register();
    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
    };
  }, []);

  return null;
}
