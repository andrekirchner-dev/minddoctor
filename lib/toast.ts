// Module-level toast API — dispatch CustomEvents, picked up by <Toaster />
// Works from any client component without prop drilling or context.

export type ToastType = "success" | "error" | "info";

export interface ToastPayload {
  msg: string;
  type: ToastType;
  id: number;
}

let _id = 0;

function dispatch(msg: string, type: ToastType) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ToastPayload>("axon:toast", {
      detail: { msg, type, id: ++_id },
    })
  );
}

export const toast = {
  success: (msg: string) => dispatch(msg, "success"),
  error:   (msg: string) => dispatch(msg, "error"),
  info:    (msg: string) => dispatch(msg, "info"),
};
