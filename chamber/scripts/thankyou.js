(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {
        populateSubmissionSummary();
    });

    function populateSubmissionSummary() {
        const params = new URLSearchParams(window.location.search);
        const fieldMappings = [
            { param: "firstName", elementId: "confirm-first-name" },
            { param: "lastName", elementId: "confirm-last-name" },
            { param: "email", elementId: "confirm-email" },
            { param: "phone", elementId: "confirm-phone" },
            { param: "organization", elementId: "confirm-organization" },
            { param: "timestamp", elementId: "confirm-timestamp", formatter: formatTimestamp }
        ];

        fieldMappings.forEach(({ param, elementId, formatter }) => {
            const element = document.getElementById(elementId);
            if (!element) {
                return;
            }

            const rawValue = params.get(param) || "";
            const trimmedValue = rawValue.trim();
            const formattedValue = formatter ? formatter(trimmedValue) : trimmedValue;

            element.textContent = formattedValue || "Not provided";
        });
    }

    function formatTimestamp(value) {
        if (!value) {
            return "Not captured";
        }

        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) {
            return value;
        }

        return parsed.toLocaleString(undefined, {
            dateStyle: "long",
            timeStyle: "short"
        });
    }
})();
