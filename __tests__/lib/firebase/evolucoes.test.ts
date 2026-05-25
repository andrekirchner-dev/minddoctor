import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const {
  mockAddDoc, mockUpdateDoc, mockDeleteDoc, mockGetDocs,
  mockWhere, mockQuery, mockDoc, mockCollection, mockOrderBy,
} = vi.hoisted(() => ({
  mockAddDoc:     vi.fn(),
  mockUpdateDoc:  vi.fn(),
  mockDeleteDoc:  vi.fn(),
  mockGetDocs:    vi.fn(),
  mockWhere:      vi.fn(),
  mockQuery:      vi.fn(),
  mockDoc:        vi.fn(),
  mockCollection: vi.fn(),
  mockOrderBy:    vi.fn(),
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
  orderBy:         mockOrderBy,
  serverTimestamp: () => "__SERVER_TIMESTAMP__",
  Timestamp:       { fromDate: (d: Date) => ({ seconds: Math.floor(d.getTime() / 1000) }) },
}));

vi.mock("@/lib/firebase/config", () => ({ db: {} }));

// ── Import after mocks ────────────────────────────────────────────────────────

import {
  saveEvolucao,
  updateEvolucao,
  getEvolucoes,
  deleteEvolucao,
  clearEvolucoesCache,
} from "@/lib/firebase/evolucoes";

// ── Helpers ───────────────────────────────────────────────────────────────────

const MOCK_TIMESTAMP = { seconds: 1700000000, nanoseconds: 0 };

function makeEvolucaoData(userId = "user-001", pacienteNome = "João Silva") {
  return {
    userId,
    pacienteNome,
    data:            MOCK_TIMESTAMP as any,
    humorGeral:      7,
    ansiedade:       4,
    sono:            6,
    funcionamento:   7,
    sintomas:        [],
    medicamentos:    [],
    texto:           "Paciente relata melhora parcial do humor.",
  };
}

function makeSnapDocs(userId = "user-001", pacienteNome = "João Silva", count = 2) {
  return Array.from({ length: count }, (_, i) => ({
    id: `evol-${i + 1}`,
    data: () => ({
      userId,
      pacienteNome,
      humorGeral:  5 + i,
      data:        MOCK_TIMESTAMP,
      sintomas:    [],
      medicamentos:[],
      texto:       `Sessão ${i + 1}`,
    }),
  }));
}

// ── saveEvolucao ──────────────────────────────────────────────────────────────

describe("saveEvolucao", () => {
  beforeEach(() => vi.clearAllMocks());

  it("stores userId and pacienteNome in the Firestore document", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "evol-abc" });

    await saveEvolucao(makeEvolucaoData("user-001", "Maria Lima"));

    const [, written] = mockAddDoc.mock.calls[0];
    expect(written.userId).toBe("user-001");
    expect(written.pacienteNome).toBe("Maria Lima");
  });

  it("returns the generated document ID", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "evol-xyz" });

    const id = await saveEvolucao(makeEvolucaoData());

    expect(id).toBe("evol-xyz");
  });

  it("attaches server timestamps on creation", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "evol-ts" });

    await saveEvolucao(makeEvolucaoData());

    const [, written] = mockAddDoc.mock.calls[0];
    expect(written.createdAt).toBe("__SERVER_TIMESTAMP__");
    expect(written.updatedAt).toBe("__SERVER_TIMESTAMP__");
  });

  it("persists all required clinical fields", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "evol-1" });

    await saveEvolucao(makeEvolucaoData("user-002", "Ana Souza"));

    const [, written] = mockAddDoc.mock.calls[0];
    expect(written).toMatchObject({
      userId:       "user-002",
      pacienteNome: "Ana Souza",
      humorGeral:   7,
      ansiedade:    4,
      sono:         6,
      funcionamento:7,
      sintomas:     [],
      medicamentos: [],
    });
  });
});

// ── getEvolucoes ──────────────────────────────────────────────────────────────

describe("getEvolucoes", () => {
  beforeEach(() => { vi.resetAllMocks(); clearEvolucoesCache(); });

  it("returns an empty array when there are no documents", async () => {
    mockWhere.mockReturnValue("where-clause");
    mockOrderBy.mockReturnValue("order-clause");
    mockQuery.mockReturnValue("scoped-query");
    mockGetDocs.mockResolvedValueOnce({ docs: [] });

    const result = await getEvolucoes("user-empty", "PacienteX");

    expect(result).toEqual([]);
  });

  it("queries Firestore filtered by userId and pacienteNome", async () => {
    mockWhere.mockReturnValue("where-clause");
    mockOrderBy.mockReturnValue("order-clause");
    mockQuery.mockReturnValue("scoped-query");
    mockGetDocs.mockResolvedValueOnce({ docs: [] });

    await getEvolucoes("user-q", "Paciente Q");

    expect(mockWhere).toHaveBeenCalledWith("userId", "==", "user-q");
    expect(mockWhere).toHaveBeenCalledWith("pacienteNome", "==", "Paciente Q");
  });

  it("returns evolucoes with id attached", async () => {
    mockWhere.mockReturnValue("where-clause");
    mockOrderBy.mockReturnValue("order-clause");
    mockQuery.mockReturnValue("scoped-query");
    mockGetDocs.mockResolvedValueOnce({ docs: makeSnapDocs("user-list", "Pedro") });

    const result = await getEvolucoes("user-list", "Pedro");

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("evol-1");
    expect(result[0].userId).toBe("user-list");
  });

  it("uses cache on second call (getDocs called only once)", async () => {
    mockWhere.mockReturnValue("where-clause");
    mockOrderBy.mockReturnValue("order-clause");
    mockQuery.mockReturnValue("scoped-query");
    mockGetDocs.mockResolvedValue({ docs: makeSnapDocs("user-cache-evol", "Cached") });

    await getEvolucoes("user-cache-evol", "Cached");
    await getEvolucoes("user-cache-evol", "Cached");

    expect(mockGetDocs).toHaveBeenCalledTimes(1);
  });
});

// ── updateEvolucao ────────────────────────────────────────────────────────────

describe("updateEvolucao", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls updateDoc with the correct document ID", async () => {
    const fakeRef = { id: "evol-upd" };
    mockDoc.mockReturnValueOnce(fakeRef);
    mockUpdateDoc.mockResolvedValueOnce(undefined);

    await updateEvolucao("evol-upd", { humorGeral: 9 });

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), "evolucoes", "evol-upd");
    expect(mockUpdateDoc).toHaveBeenCalledWith(
      fakeRef,
      expect.objectContaining({ humorGeral: 9 }),
    );
  });

  it("always includes updatedAt on every update", async () => {
    mockDoc.mockReturnValueOnce({});
    mockUpdateDoc.mockResolvedValueOnce(undefined);

    await updateEvolucao("evol-ts", { ansiedade: 2 });

    const [, payload] = mockUpdateDoc.mock.calls[0];
    expect(payload.updatedAt).toBe("__SERVER_TIMESTAMP__");
  });
});

// ── deleteEvolucao ────────────────────────────────────────────────────────────

describe("deleteEvolucao", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls deleteDoc with the correct document ref", async () => {
    const fakeRef = { id: "evol-del" };
    mockDoc.mockReturnValueOnce(fakeRef);
    mockDeleteDoc.mockResolvedValueOnce(undefined);

    await deleteEvolucao("evol-del", "user-001", "João Silva");

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), "evolucoes", "evol-del");
    expect(mockDeleteDoc).toHaveBeenCalledWith(fakeRef);
  });

  it("invalidates cache for the specific userId+pacienteNome key", async () => {
    // Seed cache
    mockWhere.mockReturnValue("where-clause");
    mockOrderBy.mockReturnValue("order-clause");
    mockQuery.mockReturnValue("scoped-query");
    mockGetDocs.mockResolvedValue({ docs: makeSnapDocs("user-del-evol", "Carlos") });

    await getEvolucoes("user-del-evol", "Carlos");
    expect(mockGetDocs).toHaveBeenCalledTimes(1);

    // Delete invalidates the cache key
    mockDoc.mockReturnValueOnce({});
    mockDeleteDoc.mockResolvedValueOnce(undefined);
    await deleteEvolucao("evol-1", "user-del-evol", "Carlos");

    // Next call should hit Firestore again
    await getEvolucoes("user-del-evol", "Carlos");
    expect(mockGetDocs).toHaveBeenCalledTimes(2);
  });
});
