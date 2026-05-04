/**
 * Edit Window Error Utilities
 * Helpers for handling the 5-minute editing grace period errors.
 */

/**
 * Returns true if the error is a 403 with EDIT_WINDOW_EXPIRED code,
 * meaning the user tried to edit after the 5-minute window closed.
 */
export function isEditWindowExpired(err: unknown): boolean {
  const e = err as { response?: { status?: number; data?: { code?: string } } };
  return (
    e?.response?.status === 403 &&
    e?.response?.data?.code === 'EDIT_WINDOW_EXPIRED'
  );
}

/**
 * Returns a user-friendly error message for edit failures,
 * distinguishing between the edit window expiry and other errors.
 */
export function getEditErrorMessage(err: unknown): string {
  if (isEditWindowExpired(err)) {
    return 'Your 5-minute edit window has closed. This post can no longer be edited.';
  }
  const e = err as { response?: { data?: { message?: string; error?: string } }; message?: string };
  return (
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    'Failed to save changes. Please try again.'
  );
}
