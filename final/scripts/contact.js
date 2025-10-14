const bookingForm = document.querySelector("[data-booking-form]");
const bookingStatus = document.querySelector("[data-booking-status]");

const formatDate = (dateString) => {
  if (!dateString) return "your chosen date";
  const date = new Date(dateString);
  if (Number.isNaN(date.valueOf())) return dateString;

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(date);
};

const handleBookingSubmit = (event) => {
  if (!bookingForm || !bookingStatus) return;
  event.preventDefault();

  const formData = new FormData(bookingForm);
  const name = (formData.get("name") || "Rider").toString().trim();
  const email = formData.get("email");
  const date = formData.get("date");
  const slot = formData.get("slot");
  const services = formData.getAll("services");
  const notes = formData.get("notes") || "";

  if (services.length === 0) {
    bookingStatus.textContent =
      "Select at least one service focus so we can prep the right tools.";
    bookingStatus.classList.remove("status-tag", "live");
    return;
  }

  const formattedServices = services.join(", ");
  const message = [
    `Thanks, ${name}!`,
    `We are holding ${formatDate(date)} · ${slot || "flex slot"} for your ${formattedServices.toLowerCase()}.`,
    "Watch your inbox for prep notes within the next two hours."
  ].join(" ");

  bookingStatus.textContent = message;
  bookingStatus.classList.add("status-tag", "live");

  const noteSummary = notes.toString().trim();
  if (noteSummary) {
    console.table({
      name,
      email,
      date,
      slot,
      services: formattedServices,
      notes: noteSummary
    });
  }

  bookingForm.reset();
};

if (bookingForm) {
  bookingForm.addEventListener("submit", handleBookingSubmit);
}
