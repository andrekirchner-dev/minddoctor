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
  savePlanoCrise,
  updatePlanoCrise,
  getPlanosCrise,
  deletePlanoCrise,
  clearPlanosCriseCache,
} from "@/lib/firebase/planosCrise";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makePlanoData(userId = "user-001", pacienteNome = "Ana Lima") {
  return {
    userId,
    pacienteNome,
    sinaisAlerta:      ["insônia intensa", "agitação psicomotora"],
    medidasImediatas:  ["ligar para familiar", "procurar UPA"],
    contatoEmergencia: "CVV 188",
    textoCompleto:     "Plano detalhado de crise para a paciente Ana Lima.",
    status:            "ativo" as const,
  };
}

function makeSnapDocs(userId = "user-001", pacienteNome = "Ana Lima", count = 2) {
  return Array.from({ length: count }, (_, i) => ({
    id: `plano-${i + 1}`,
    data: () => ({
      userId,
      pacienteNome,
      status:        i === 0 ? "ativo" : "arquivado",
      sinaisAlerta:  [],
      medidasImediatas: [],
      contatoEmergencia: "CVV 188",
      textoCompleto: `Plano ${i + 1}`,
      criadoEm:      { seconds: 1000 * (i + 1) },
    }),
  }));
}

// ── savePlanoCrise ────────────────────────────────────────────────────────────

describe("savePlanoCrise", () => {
  beforeEach(() => vi.clearAllMocks());

  it("stores userId and pacienteNome in the Firestore document", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "plano-abc" });

    await savePlanoCrise(makePlanoData("user-001", "Carlos Mendes"));

    const [, written] = mockAddDoc.mock.calls[0];
    expect(written.userId).toBe("user-001");
    expect(written.pacienteNome).toBe("Carlos Mendes");
  });

  it("returns the generated document ID", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "plano-xyz" });

    const id = await savePlanoCrise(makePlanoData());

    expect(id).toBe("plano-xyz");
  });

  it("attaches server timestamps on creation", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "plano-ts" });

    await savePlanoCrise(makePlanoData());

    const [, written] = mockAddDoc.mock.calls[0];
    expect(written.criadoEm).toBe("__SERVER_TIMESTAMP__");
    expect(written.updatedAt).toBe("__SERVER_TIMESTAMP__");
  });

  it("persists all required fields including arrays and status", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "plano-1" });

    await savePlanoCrise(makePlanoData("user-002", "Beatriz Costa"));

    const [, written] = mockAddDoc.mock.calls[0];
    expect(written).toMatchObject({
      userId:            "user-002",
      pacienteNome:      "Beatriz Costa",
      sinaisAlerta:      ["insônia intensa", "agitação psicomotora"],
      medidasImediatas:  ["ligar para familiar", "procurar UPA"],
      contatoEmergencia: "CVV 188",
      status:            "ativo",
    });
  });
});

// ── getPlanosCrise ────────────────────────────────────────────────────────────

describe("getPlanosCrise", () => {
  beforeEach(() => { vi.resetAllMocks(); clearPlanosCriseCache(); });

  it("returns an empty array when there are no documents", async () => {
    mockWhere.mockReturnValue("where-clause");
    mockQuery.mockReturnValue("scoped-query");
    mockGetDocs.mockResolvedValueOnce({ docs: [] });

    const result = await getPlanosCrise("user-empty", "PacienteX");

    expect(result).toEqual([]);
  });

  it("queries Firestore filtered by userId and pacienteNome", async () => {
    mockWhere.mockReturnValue("where-clause");
    mockQuery.mockReturnValue("scoped-query");
    mockGetDocs.mockResolvedValueOnce({ docs: [] });

    await getPlanosCrise("user-q", "Paciente Q");

    expect(mockWhere).toHaveBeenCalledWith("userId", "==", "user-q");
    expect(mockWhere).toHaveBeenCalledWith("pacienteNome", "==", "Paciente Q");
  });

  it("returns planos with id attached", async () => {
    mockWhere.mockReturnValue("where-clause");
    mockQuery.mockReturnValue("scoped-query");
    mockGetDocs.mockResolvedValueOnce({ docs: makeSnapDocs("user-list", "Diana") });

    const result = await getPlanosCrise("user-list", "Diana");

    expect(result).toHaveLength(2);
    expect(result[0].id).toBeDefined();
    expect(result[0].userId).toBe("user-list");
  });

  it("sorts active plans first", async () => {
    mockWhere.mockReturnValue("where-clause");
    mockQuery.mockReturnValue("scoped-query");
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        {
          id: "archived-plano",
          data: () => ({
            userId: "user-sort", pacienteNome: "Paciente Sort",
            status: "arquivado", sinaisAlerta: [], medidasImediatas: [],
            contatoEmergencia: "", textoCompleto: "", criadoEm: { seconds: 9000 },
          }),
        },
        {
          id: "active-plano",
          data: () => ({
            userId: "user-sort", pacienteNome: "Paciente Sort",
            status: "ativo", sinaisAlerta: [], medidasImediatas: [],
            contatoEmergencia: "", textoCompleto: "", criadoEm: { seconds: 1000 },
          }),
        },
      ],
    });

    const result = await getPlanosCrise("user-sort", "Paciente Sort");

    expect(result[0].id).toBe("active-plano");
    expect(result[1].id).toBe("archived-plano");
  });

  it("uses cache on second call (getDocs called only once)", async () => {
    mockWhere.mockReturnValue("where-clause");
    mockQuery.mockReturnValue("scoped-query");
    mockGetDocs.mockResolvedValue({ docs: makeSnapDocs("user-cache-plano", "Cached") });

    await getPlanosCrise("user-cache-plano", "Cached");
    await getPlanosCrise("user-cache-plano", "Cached");

    expect(mockGetDocs).toHaveBeenCalledTimes(1);
  });
});

// ── updatePlanoCrise ──────────────────────────────────────────────────────────

describe("updatePlanoCrise", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls updateDoc with the correct document ID", async () => {
    const fakeRef = { id: "plano-upd" };
    mockDoc.mockReturnValueOnce(fakeRef);
    mockUpdateDoc.mockResolvedValueOnce(undefined);

    await updatePlanoCrise("plano-upd", { status: "revisado" as const });

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), "planosCrise", "plano-upd");
    expect(mockUpdateDoc).toHaveBeenCalledWith(
      fakeRef,
      expect.objectContaining({ status: "revisado" }),
    );
  });

  it("always includes updatedAt on every update", async () => {
    mockDoc.mockReturnValueOnce({});
    mockUpdateDoc.mockResolvedValueOnce(undefined);

    await updatePlanoCrise("plano-ts", { contatoEmergencia: "SAMU 192" });

    const [, payload] = mockUpdateDoc.mock.calls[0];
    expect(payload.updatedAt).toBe("__SERVER_TIMESTAMP__");
  });
});

// ── deletePlanoCrise ──────────────────────────────────────────────────────────

describe("deletePlanoCrise", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls deleteDoc with the correct document ref", async () => {
    const fakeRef = { id: "plano-del" };
    mockDoc.mockReturnValueOnce(fakeRef);
    mockDeleteDoc.mockResolvedValueOnce(undefined);

    await deletePlanoCrise("plano-del", "user-001", "Ana Lima");

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), "planosCrise", "plano-del");
    expect(mockDeleteDoc).toHaveBeenCalledWith(fakeRef);
  });

  it("invalidates cache for the specific userId+pacienteNome key", async () => {
    // Seed the cache
    mockWhere.mockReturnValue("where-clause");
    mockQuery.mockReturnValue("scoped-query");
    mockGetDocs.mockResolvedValue({ docs: makeSnapDocs("user-del-plano", "Felipe") });

    await getPlanosCrise("user-del-plano", "Felipe");
    expect(mockGetDocs).toHaveBeenCalledTimes(1);

    // Delete should invalidate cache for that key
    mockDoc.mockReturnValueOnce({});
    mockDeleteDoc.mockResolvedValueOnce(undefined);
    await deletePlanoCrise("plano-1", "user-del-plano", "Felipe");

    // Next call should hit Firestore again
    await getPlanosCrise("user-del-plano", "Felipe");
    expect(mockGetDocs).toHaveBeenCalledTimes(2);
  });
});
