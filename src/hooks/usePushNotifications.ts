import { useCallback } from 'react';
import { notificationService } from '../api/services';

/**
 * Converts a base64url-encoded VAPID public key string to a Uint8Array,
 * which is the format required by PushManager.subscribe().
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Hook for managing the Web Push subscription lifecycle.
 *
 * `subscribe()` — requests browser permission, fetches VAPID key,
 *   registers with PushManager, and POSTs the subscription to the backend.
 *
 * `unsubscribe()` — retrieves the current subscription, notifies the backend
 *   (DELETE /notifications/push/unsubscribe), and calls sub.unsubscribe().
 *   Call this on logout so the user stops receiving pushes on this device.
 */
export function usePushNotifications() {
  const subscribe = useCallback(async () => {
    try {
      // 1. Check if push is supported
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

      const registration = await navigator.serviceWorker.ready;

      // 2. Check if already subscribed
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        // Sync with backend just in case, then exit
        await notificationService.subscribePush(existingSubscription);
        return;
      }

      // 3. Request permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      // 4. Fetch VAPID key and subscribe
      const { publicKey } = await notificationService.getVapidPublicKey();
      if (!publicKey) return;

      const subscribeOptions: PushSubscriptionOptionsInit = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey.trim()) as any,
      };
      const subscription = await registration.pushManager.subscribe(subscribeOptions);

      // 5. Register with backend
      await notificationService.subscribePush(subscription);
      console.log('[Push] Subscribed successfully.');
    } catch (err) {
      console.error('[Push] Subscription failed:', err);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        await notificationService.unsubscribePush(sub.endpoint);
        await sub.unsubscribe();
        console.log('[Push] Unsubscribed successfully.');
      }
    } catch (err) {
      // Non-blocking — best-effort unsubscription
      console.error('[Push] Unsubscription failed:', err);
    }
  }, []);

  return { subscribe, unsubscribe };
}
