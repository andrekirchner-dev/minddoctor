export function registerServiceWorker(): void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch((err) => console.warn("SW registration failed:", err));
  });
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) return "denied";
  if (Notification.permission === "granted") return "granted";
  return Notification.requestPermission();
}

export function scheduleFlashcardReminder(): void {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const lastCheck = localStorage.getItem("axon_notif_flashcards_check");
  const today = new Date().toISOString().slice(0, 10);
  if (lastCheck === today) return;

  const progress = localStorage.getItem("md_flashcard_progress");
  if (!progress) return;

  try {
    const parsed = JSON.parse(progress) as Record<string, { nextReview?: string }>;
    const vencidos = Object.values(parsed).filter((card) => {
      if (!card.nextReview) return false;
      return new Date(card.nextReview) <= new Date();
    }).length;

    if (vencidos > 0) {
      new Notification("Axon Med — Flashcards pendentes", {
        body: `Você tem ${vencidos} flashcard${vencidos > 1 ? "s" : ""} para revisar hoje.`,
        icon: "/icon.png",
        tag: "flashcards-vencidos",
      });
    }
    localStorage.setItem("axon_notif_flashcards_check", today);
  } catch {}
}

export function scheduleDailyEventReminder(eventTitle: string, eventTime: string): void {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  new Notification("Axon Med — Compromisso hoje", {
    body: `${eventTitle} às ${eventTime}`,
    icon: "/icon.png",
    tag: "evento-dia",
  });
}
