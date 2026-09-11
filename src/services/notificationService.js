/**
 * Centralized Notification & Feedback Service
 * Replaces native browser alert() and confirm() with an on-screen animated popup modal.
 */

class NotificationManager {
    constructor() {
        this.listener = null;
        this.queue = [];
        this.initAlertOverride();
    }

    subscribe(fn) {
        this.listener = fn;
        if (this.queue.length > 0 && this.listener) {
            const next = this.queue.shift();
            this.listener(next);
        }
        return () => {
            if (this.listener === fn) {
                this.listener = null;
            }
        };
    }

    emit(dialog) {
        if (this.listener) {
            this.listener(dialog);
        } else {
            this.queue.push(dialog);
        }
    }

    close() {
        if (this.listener) {
            this.listener(null);
        }
    }

    /**
     * Overrides window.alert to guarantee that zero native browser alert popups ever appear
     */
    initAlertOverride() {
        if (typeof window !== 'undefined' && !window.__notificationServiceInstalled) {
            window.__notificationServiceInstalled = true;
            window.alert = (message) => {
                const text = String(message || '');
                const isError = /fail|error|wrong|invalid|missing|denied|reject|unable/i.test(text);
                if (isError) {
                    notify.error(text, 'Notice');
                } else {
                    notify.success(text, 'Notice');
                }
            };
        }
    }
}

export const notificationManager = new NotificationManager();

export const notify = {
    /**
     * "Correct" Success Modal with expanding green circle & bounce checkmark animation
     */
    success(message, title = 'Action Completed', options = {}) {
        return new Promise((resolve) => {
            notificationManager.emit({
                id: Date.now() + Math.random(),
                type: 'success', // "correct"
                title: title || 'Success',
                message: String(message || 'Operation successful.'),
                doneText: options.doneText || 'Done',
                onDone: () => {
                    if (options.onDone) options.onDone();
                    resolve(true);
                }
            });
        });
    },

    /**
     * "Wrong" Error Modal with crimson shake & wobble cross animation
     */
    error(message, title = 'Action Failed', options = {}) {
        return new Promise((resolve) => {
            notificationManager.emit({
                id: Date.now() + Math.random(),
                type: 'error', // "wrong"
                title: title || 'Error',
                message: String(message || 'An unexpected error occurred.'),
                doneText: options.doneText || 'Done',
                onDone: () => {
                    if (options.onDone) options.onDone();
                    resolve(false);
                }
            });
        });
    },

    /**
     * Confirmation Modal (e.g. for Deleting items)
     */
    confirm(message, title = 'Are you sure?', options = {}) {
        return new Promise((resolve) => {
            notificationManager.emit({
                id: Date.now() + Math.random(),
                type: 'confirm',
                title: title || 'Confirm Action',
                message: String(message || 'Are you sure you want to proceed?'),
                confirmText: options.confirmText || 'Confirm',
                cancelText: options.cancelText || 'Cancel',
                isDestructive: options.isDestructive !== false,
                onConfirm: () => {
                    if (options.onConfirm) options.onConfirm();
                    resolve(true);
                },
                onCancel: () => {
                    if (options.onCancel) options.onCancel();
                    resolve(false);
                }
            });
        });
    }
};

if (typeof window !== 'undefined') {
    window.notify = notify;
}

export default notify;
