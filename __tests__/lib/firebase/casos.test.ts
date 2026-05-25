import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const {
  mockAddDoc, mockUpdateDoc, mockDeleteDoc, mockGetDocs,
  mockWhere, mockQuery, mockDoc, mockCollection,
} = vi.hoisted(() => ({
  mockAddDoc:      vi.fn(),
  mockUpdateDoc:   vi.fn(),
  mockDeleteDoc:   vi.fn(),
  mockGetDocs:     vi.fn(),
  mockWhere:       vi.fn(),
  mockQuery:       vi.fn(),
  mockDoc:         vi.fn(),
  mockCollection:  vi.fn(),
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
  saveCaso,
  updateCaso,
  getCasos,
  deleteCaso,
} from "@/lib/firebase/casos";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeCasoData(userId = "user-001") {
  return {
    userId,
    titulo:               "Caso Depressão Maior",
    idade:                35,
    sexo:                 "F" as const,
    diagnosticoCID:       "F32.1",
    hipotese:             "Depressão moderada",
    historico:            "Histórico de dois episódios prévios",
    historicoFamiliar:    "Mãe com transtorno bipolar",
    exameMental:          "Humor deprimido, pensamentos lentos",
    medicamentosAtuais:   "Sertralina 100mg/dia",
    conduta:              "Manter medicamento e psicoterapia",
    observacoesEstudo:    "Avaliar resposta em 4 semanas",
    tags:                 ["depressão", "ambulatorial"],
    status:               "ativo" as const,
    identificador_enc:    "enc-id-base64",
    dataNascimento_enc:   "enc-dn-base64",
    contato_enc:          "enc-ct-base64",
  };
}

function makeSnapDocs(userId = "user-001", count = 2) {
  return Array.from({ length: count }, (_, i) => ({
    id: `caso-${i + 1}`,
    data: () => ({
      userId,
      titulo: `Caso ${i + 1}`,
      updatedAt: { seconds: 1000 * (i + 1) },
    }),
  }));
}

// ── saveCaso ──────────────────────────────────────────────────────────────────

describe("saveCaso", () => {
  beforeEach(() => vi.clearAllMocks());

  it("stores userId in the Firestore document", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "caso-abc" });

    await saveCaso(makeCasoData("user-001"));

    const [, writtenData] = mockAddDoc.mock.calls[0];
    expect(writtenData.userId).toBe("user-001");
  });

  it("returns the generated document ID", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "caso-xyz" });

    const id = await saveCaso(makeCasoData());

    expect(id).toBe("caso-xyz");
  });

  it("attaches server timestamps on creation", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "caso-ts" });

    await saveCaso(makeCasoData());

    const [, written] = mockAddDoc.mock.calls[0];
    expect(written.createdAt).toBe("__SERVER_TIMESTAMP__");
    expect(written.updatedAt).toBe("__SERVER_TIMESTAMP__");
  });

  it("persists all required clinical fields", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "caso-1" });

    await saveCaso(makeCasoData("user-002"));

    const [, written] = mockAddDoc.mock.calls[0];
    expect(written).toMatchObject({
      userId:         "user-002",
      titulo:         "Caso Depressão Maior",
      diagnosticoCID: "F32.1",
      status:         "ativo",
    });
  });
});

// ── getCasos ──────────────────────────────────────────────────────────────────

describe("getCasos", () => {
  // Reset all mocks AND clear cache between tests by saving a different userId each time
  beforeEach(() => vi.resetAllMocks());

  it("returns an empty array when there are no documents", async () => {
    mockWhere.mockReturnValueOnce("where-clause");
    mockQuery.mockReturnValueOnce("scoped-query");
    mockGetDocs.mockResolvedValueOnce({ docs: [] });

    const result = await getCasos("user-no-data-casos");

    expect(result).toEqual([]);
  });

  it("queries Firestore scoped to the requesting userId", async () => {
    mockWhere.mockReturnValueOnce("where-clause");
    mockQuery.mockReturnValueOnce("scoped-query");
    mockGetDocs.mockResolvedValueOnce({ docs: [] });

    await getCasos("user-scoped");

    expect(mockWhere).toHaveBeenCalledWith("userId", "==", "user-scoped");
  });

  it("returns casos belonging to the userId with id attached", async () => {
    mockWhere.mockReturnValueOnce("where-clause");
    mockQuery.mockReturnValueOnce("scoped-query");
    mockGetDocs.mockResolvedValueOnce({ docs: makeSnapDocs("user-fetch") });

    const result = await getCasos("user-fetch");

    expect(result).toHaveLength(2);
    expect(result[0].id).toBeDefined();
    expect(result[0].userId).toBe("user-fetch");
  });

  it("sorts results by updatedAt descending (newest first)", async () => {
    mockWhere.mockReturnValueOnce("where-clause");
    mockQuery.mockReturnValueOnce("scoped-query");
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        { id: "old-caso", data: () => ({ userId: "user-sort", updatedAt: { seconds: 500 } }) },
        { id: "new-caso", data: () => ({ userId: "user-sort", updatedAt: { seconds: 9000 } }) },
      ],
    });

    const result = await getCasos("user-sort");

    expect(result[0].id).toBe("new-caso");
    expect(result[1].id).toBe("old-caso");
  });

  it("uses cache on second call (getDocs called only once)", async () => {
    mockWhere.mockReturnValue("where-clause");
    mockQuery.mockReturnValue("scoped-query");
    mockGetDocs.mockResolvedValue({ docs: makeSnapDocs("user-cache-casos") });

    await getCasos("user-cache-casos");
    await getCasos("user-cache-casos");

    expect(mockGetDocs).toHaveBeenCalledTimes(1);
  });
});

// ── updateCaso ────────────────────────────────────────────────────────────────

describe("updateCaso", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls updateDoc with the correct document ID", async () => {
    const fakeRef = { id: "caso-upd" };
    mockDoc.mockReturnValueOnce(fakeRef);
    mockUpdateDoc.mockResolvedValueOnce(undefined);

    await updateCaso("caso-upd", { titulo: "Novo Título" });

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), "casos", "caso-upd");
    expect(mockUpdateDoc).toHaveBeenCalledWith(
      fakeRef,
      expect.objectContaining({ titulo: "Novo Título" }),
    );
  });

  it("always includes updatedAt on every update", async () => {
    mockDoc.mockReturnValueOnce({});
    mockUpdateDoc.mockResolvedValueOnce(undefined);

    await updateCaso("caso-ts", { status: "alta" as const });

    const [, payload] = mockUpdateDoc.mock.calls[0];
    expect(payload.updatedAt).toBe("__SERVER_TIMESTAMP__");
  });
});

// ── deleteCaso ────────────────────────────────────────────────────────────────

describe("deleteCaso", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls deleteDoc with the correct document ref", async () => {
    const fakeRef = { id: "caso-del" };
    mockDoc.mockReturnValueOnce(fakeRef);
    mockDeleteDoc.mockResolvedValueOnce(undefined);

    await deleteCaso("caso-del");

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), "casos", "caso-del");
    expect(mockDeleteDoc).toHaveBeenCalledWith(fakeRef);
  });

  it("clears the cache so next getCasos hits Firestore again", async () => {
    // Seed the cache for a user
    mockWhere.mockReturnValue("where-clause");
    mockQuery.mockReturnValue("scoped-query");
    mockGetDocs.mockResolvedValue({ docs: makeSnapDocs("user-del-cache") });

    await getCasos("user-del-cache");
    expect(mockGetDocs).toHaveBeenCalledTimes(1);

    // Delete a caso — this clears the entire cache
    mockDoc.mockReturnValueOnce({});
    mockDeleteDoc.mockResolvedValueOnce(undefined);
    await deleteCaso("caso-1");

    // Cache is cleared; next getCasos must hit Firestore
    await getCasos("user-del-cache");
    expect(mockGetDocs).toHaveBeenCalledTimes(2);
  });
});
