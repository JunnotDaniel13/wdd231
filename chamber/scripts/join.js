(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {
        updateTimestampField();
        initModalInteractions();
    });

    window.addEventListener("pageshow", () => {
        updateTimestampField();
    });

    function updateTimestampField() {
        const field = document.getElementById("formTimestamp");
        if (!field) {
            return;
        }

        const now = new Date();
        field.value = now.toISOString();
    }

    function initModalInteractions() {
        const triggers = document.querySelectorAll("[data-modal-target]");
        if (triggers.length === 0) {
            return;
        }

        let activeTrigger = null;

        triggers.forEach((trigger) => {
            const targetId = trigger.getAttribute("data-modal-target");
            if (!targetId) {
                return;
            }

            const dialog = document.getElementById(targetId);
            if (!dialog) {
                return;
            }

            trigger.addEventListener("click", (event) => {
                event.preventDefault();
                activeTrigger = trigger;
                openDialog(dialog);
            });

            if (!dialog.dataset.modalBound) {
                bindDialog(dialog, () => {
                    if (activeTrigger) {
                        activeTrigger.focus();
                        activeTrigger = null;
                    }
                });
            }
        });
    }

    function bindDialog(dialog, onClose) {
        dialog.dataset.modalBound = "true";

        const closeButton = dialog.querySelector("[data-modal-close]");
        if (closeButton) {
            closeButton.addEventListener("click", (event) => {
                event.preventDefault();
                closeDialog(dialog);
            });
        }

        dialog.addEventListener("close", () => {
            if (typeof onClose === "function") {
                onClose();
            }
        });

        dialog.addEventListener("cancel", (event) => {
            event.preventDefault();
            closeDialog(dialog);
        });

        dialog.addEventListener("click", (event) => {
            if (!isClickInsideDialog(event, dialog)) {
                closeDialog(dialog);
            }
        });
    }

    function openDialog(dialog) {
        if (typeof dialog.showModal === "function") {
            dialog.showModal();
        } else {
            dialog.setAttribute("open", "open");
            dispatchFallbackEvent(dialog, "open");
        }

        const focusTarget = dialog.querySelector("[data-modal-close]") || dialog.querySelector("a, button, input, textarea, select");
        if (focusTarget) {
            focusTarget.focus();
        }
    }

    function closeDialog(dialog) {
        if (dialog.open && typeof dialog.close === "function") {
            dialog.close();
        } else {
            dialog.removeAttribute("open");
            dispatchFallbackEvent(dialog, "close");
        }
    }

    function isClickInsideDialog(event, dialog) {
        const rect = dialog.getBoundingClientRect();
        const { clientX, clientY } = event;
        const withinHorizontalBounds = clientX >= rect.left && clientX <= rect.right;
        const withinVerticalBounds = clientY >= rect.top && clientY <= rect.bottom;
        return withinHorizontalBounds && withinVerticalBounds;
    }

    function dispatchFallbackEvent(element, type) {
        const evt = new Event(type);
        element.dispatchEvent(evt);
    }
})();
