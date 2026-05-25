import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const {
  mockAddDoc, mockUpdateDoc, mockDeleteDoc, mockGetDocs,
  mockWhere, mockQuery, mockDoc, mockCollection,
} = vi.hoisted(() => ({
  mockAddDoc:     vi.fn(),
  mockUpdateDoc:  vi.fn(),
  mockDeleteDoc:  vi.fn(),
  mockGetDocs:    vi.fn(),
  mockWhere:      vi.fn(),
  mockQuery:      vi.fn(),
  mockDoc:        vi.fn(),
  mockCollection: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  collection:      mockCollection,
  addDoc:          mockAddDoc,
  updateDoc:       mockUpdateDoc,
  deleteDoc:       mockDeleteDoc,
  doc:             mockDoc,
  getDocs:         mockGetDocs,
  query:           mockQuery,
  where:           mockWhere,
  serverTimestamp: () => "__SERVER_TIMESTAMP__",
  Timestamp:       { fromDate: (d: Date) => ({ seconds: Math.floor(d.getTime() / 1000) }) },
}));

vi.mock("@/lib/firebase/config", () => ({ db: {} }));

// ── Import after mocks ────────────────────────────────────────────────────────

import {
  saveEvento,
  updateEvento,
  getEventos,
  deleteEvento,
  clearEventosCache,
} from "@/lib/firebase/eventos";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeEventoData(userId = "user-001") {
  return {
    userId,
    titulo:     "Consulta inicial",
    tipo:       "consulta" as const,
    dataInicio: "2026-06-01",
    dataFim:    "2026-06-01",
    hora:       "09:00",
    local:      "",
    notas:      "",
  };
}

function makeSnapDocs(userId = "user-001", count = 3) {
  return Array.from({ length: count }, (_, i) => ({
    id: `evento-${i + 1}`,
    data: () => ({
      userId,
      titulo:     `Evento ${i + 1}`,
      tipo:       "consulta",
      dataInicio: `2026-06-0${i + 1}`,
      dataFim:    `2026-06-0${i + 1}`,
      hora:       "09:00",
    }),
  }));
}

// ── saveEvento ────────────────────────────────────────────────────────────────

describe("saveEvento", () => {
  beforeEach(() => vi.clearAllMocks());

  it("stores userId in the Firestore document", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "evento-abc" });

    await saveEvento(makeEventoData("user-001"));

    const [, written] = mockAddDoc.mock.calls[0];
    expect(written.userId).toBe("user-001");
  });

  it("returns the generated document ID", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "evento-xyz" });

    const id = await saveEvento(makeEventoData());

    expect(id).toBe("evento-xyz");
  });

  it("attaches a server timestamp on creation", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "evento-ts" });

    await saveEvento(makeEventoData());

    const [, written] = mockAddDoc.mock.calls[0];
    expect(written.createdAt).toBe("__SERVER_TIMESTAMP__");
  });

  it("persists all required fields", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "evento-1" });

    await saveEvento(makeEventoData("user-002"));

    const [, written] = mockAddDoc.mock.calls[0];
    expect(written).toMatchObject({
      userId:     "user-002",
      titulo:     "Consulta inicial",
      tipo:       "consulta",
      dataInicio: "2026-06-01",
      dataFim:    "2026-06-01",
      hora:       "09:00",
    });
  });
});

// ── getEventos ────────────────────────────────────────────────────────────────

describe("getEventos", () => {
  beforeEach(() => { vi.resetAllMocks(); clearEventosCache(); });

  it("returns an empty array when there are no documents", async () => {
    mockWhere.mockReturnValue("where-clause");
    mockQuery.mockReturnValue("scoped-query");
    mockGetDocs.mockResolvedValueOnce({ docs: [] });

    const result = await getEventos("user-empty-eventos");

    expect(result).toEqual([]);
  });

  it("queries Firestore scoped to the requesting userId", async () => {
    mockWhere.mockReturnValue("where-clause");
    mockQuery.mockReturnValue("scoped-query");
    mockGetDocs.mockResolvedValueOnce({ docs: [] });

    await getEventos("user-scoped-ev");

    expect(mockWhere).toHaveBeenCalledWith("userId", "==", "user-scoped-ev");
  });

  it("returns eventos with id attached and userId intact", async () => {
    mockWhere.mockReturnValue("where-clause");
    mockQuery.mockReturnValue("scoped-query");
    mockGetDocs.mockResolvedValueOnce({ docs: makeSnapDocs("user-list-ev") });

    const result = await getEventos("user-list-ev");

    expect(result).toHaveLength(3);
    expect(result[0].id).toBeDefined();
    expect(result[0].userId).toBe("user-list-ev");
  });

  it("sorts results by dataInicio ascending", async () => {
    mockWhere.mockReturnValue("where-clause");
    mockQuery.mockReturnValue("scoped-query");
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        {
          id: "later-event",
          data: () => ({
            userId: "user-sort-ev", titulo: "B", tipo: "consulta",
            dataInicio: "2026-07-15", dataFim: "2026-07-15", hora: "10:00",
          }),
        },
        {
          id: "earlier-event",
          data: () => ({
            userId: "user-sort-ev", titulo: "A", tipo: "consulta",
            dataInicio: "2026-06-01", dataFim: "2026-06-01", hora: "08:00",
          }),
        },
      ],
    });

    const result = await getEventos("user-sort-ev");

    expect(result[0].id).toBe("earlier-event");
    expect(result[1].id).toBe("later-event");
  });

  it("uses cache on second call (getDocs called only once)", async () => {
    mockWhere.mockReturnValue("where-clause");
    mockQuery.mockReturnValue("scoped-query");
    mockGetDocs.mockResolvedValue({ docs: makeSnapDocs("user-cache-ev") });

    await getEventos("user-cache-ev");
    await getEventos("user-cache-ev");

    expect(mockGetDocs).toHaveBeenCalledTimes(1);
  });
});

// ── updateEvento ──────────────────────────────────────────────────────────────

describe("updateEvento", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls updateDoc with the correct document ID", async () => {
    const fakeRef = { id: "evento-upd" };
    mockDoc.mockReturnValueOnce(fakeRef);
    mockUpdateDoc.mockResolvedValueOnce(undefined);

    await updateEvento("evento-upd", { titulo: "Consulta de retorno" });

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), "eventos", "evento-upd");
    expect(mockUpdateDoc).toHaveBeenCalledWith(
      fakeRef,
      expect.objectContaining({ titulo: "Consulta de retorno" }),
    );
  });

  it("passes through all provided update fields", async () => {
    mockDoc.mockReturnValueOnce({});
    mockUpdateDoc.mockResolvedValueOnce(undefined);

    await updateEvento("evento-fields", { tipo: "retorno" as const, hora: "14:30" });

    const [, payload] = mockUpdateDoc.mock.calls[0];
    expect(payload.tipo).toBe("retorno");
    expect(payload.hora).toBe("14:30");
  });
});

// ── deleteEvento ──────────────────────────────────────────────────────────────

describe("deleteEvento", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls deleteDoc with the correct document ref", async () => {
    const fakeRef = { id: "evento-del" };
    mockDoc.mockReturnValueOnce(fakeRef);
    mockDeleteDoc.mockResolvedValueOnce(undefined);

    await deleteEvento("evento-del", "user-001");

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), "eventos", "evento-del");
    expect(mockDeleteDoc).toHaveBeenCalledWith(fakeRef);
  });

  it("invalidates the cache for the userId so next getEventos hits Firestore", async () => {
    // Seed the cache
    mockWhere.mockReturnValue("where-clause");
    mockQuery.mockReturnValue("scoped-query");
    mockGetDocs.mockResolvedValue({ docs: makeSnapDocs("user-del-ev") });

    await getEventos("user-del-ev");
    expect(mockGetDocs).toHaveBeenCalledTimes(1);

    // Delete should clear cache for that userId
    mockDoc.mockReturnValueOnce({});
    mockDeleteDoc.mockResolvedValueOnce(undefined);
    await deleteEvento("evento-1", "user-del-ev");

    // Next call should hit Firestore again
    await getEventos("user-del-ev");
    expect(mockGetDocs).toHaveBeenCalledTimes(2);
  });
});
