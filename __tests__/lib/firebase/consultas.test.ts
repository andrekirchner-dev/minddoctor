import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Hoisted mocks (available inside vi.mock factories) ────────────────────────

const {
  mockAddDoc, mockUpdateDoc, mockDeleteDoc, mockGetDoc, mockGetDocs,
  mockWhere, mockQuery, mockDoc, mockCollection, mockGetCountFromServer,
} = vi.hoisted(() => ({
  mockAddDoc:             vi.fn(),
  mockUpdateDoc:          vi.fn(),
  mockDeleteDoc:          vi.fn(),
  mockGetDoc:             vi.fn(),
  mockGetDocs:            vi.fn(),
  mockWhere:              vi.fn(),
  mockQuery:              vi.fn(),
  mockDoc:                vi.fn(),
  mockCollection:         vi.fn(),
  mockGetCountFromServer: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  collection:           mockCollection,
  addDoc:               mockAddDoc,
  updateDoc:            mockUpdateDoc,
  deleteDoc:            mockDeleteDoc,
  doc:                  mockDoc,
  getDoc:               mockGetDoc,
  getDocs:              mockGetDocs,
  query:                mockQuery,
  where:                mockWhere,
  serverTimestamp:      () => "__SERVER_TIMESTAMP__",
  getCountFromServer:   mockGetCountFromServer,
  Timestamp:            { fromDate: (d: Date) => ({ seconds: Math.floor(d.getTime() / 1000) }) },
}));

vi.mock("@/lib/firebase/config", () => ({ db: {} }));

// ── Import after mocks ────────────────────────────────────────────────────────

import {
  saveConsulta,
  updateConsulta,
  getConsultas,
  getConsulta,
  deleteConsulta,
  getAllConsultasCount,
} from "@/lib/firebase/consultas";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeConsultaData(userId = "user-001") {
  return {
    userId,
    patientName:          "Maria Souza",
    tipo:                 "ambulatorial",
    diagnosticoPrincipal: "F32.0",
    nivelRisco:           "baixo",
    condutaFarma:         "Sertralina 50mg/dia",
    prontuarioBase:       "Prontuário completo...",
    state:                { step: 8 } as Record<string, unknown>,
    completed:            true,
  };
}

// ── saveConsulta ──────────────────────────────────────────────────────────────

describe("saveConsulta", () => {
  beforeEach(() => vi.clearAllMocks());

  it("stores userId in the Firestore document", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "doc-abc" });

    await saveConsulta(makeConsultaData("user-001"));

    const [, writtenData] = mockAddDoc.mock.calls[0];
    expect(writtenData.userId).toBe("user-001");
  });

  it("returns the generated document ID", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "doc-xyz" });

    const id = await saveConsulta(makeConsultaData());

    expect(id).toBe("doc-xyz");
  });

  it("persists all required clinical fields", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "doc-1" });

    await saveConsulta(makeConsultaData("user-002"));

    const [, written] = mockAddDoc.mock.calls[0];
    expect(written).toMatchObject({
      userId:               "user-002",
      patientName:          "Maria Souza",
      tipo:                 "ambulatorial",
      diagnosticoPrincipal: "F32.0",
      nivelRisco:           "baixo",
      condutaFarma:         "Sertralina 50mg/dia",
      prontuarioBase:       "Prontuário completo...",
      completed:            true,
    });
  });

  it("attaches server timestamps on creation", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "doc-ts" });

    await saveConsulta(makeConsultaData());

    const [, written] = mockAddDoc.mock.calls[0];
    expect(written.createdAt).toBe("__SERVER_TIMESTAMP__");
    expect(written.updatedAt).toBe("__SERVER_TIMESTAMP__");
  });

  it("saves two consultations for different users independently", async () => {
    mockAddDoc
      .mockResolvedValueOnce({ id: "doc-u1" })
      .mockResolvedValueOnce({ id: "doc-u2" });

    const id1 = await saveConsulta(makeConsultaData("user-001"));
    const id2 = await saveConsulta(makeConsultaData("user-002"));

    expect(id1).toBe("doc-u1");
    expect(id2).toBe("doc-u2");
    expect(mockAddDoc.mock.calls[0][1].userId).toBe("user-001");
    expect(mockAddDoc.mock.calls[1][1].userId).toBe("user-002");
  });
});

// ── getConsultas ──────────────────────────────────────────────────────────────

describe("getConsultas", () => {
  beforeEach(() => vi.clearAllMocks());

  it("queries Firestore scoped to the requesting userId", async () => {
    mockWhere.mockReturnValueOnce("where-clause");
    mockQuery.mockReturnValueOnce("scoped-query");
    mockGetDocs.mockResolvedValueOnce({ docs: [] });

    await getConsultas("user-001");

    expect(mockWhere).toHaveBeenCalledWith("userId", "==", "user-001");
  });

  it("uses a different WHERE clause for a different user", async () => {
    mockWhere.mockReturnValueOnce("where-clause");
    mockQuery.mockReturnValueOnce("scoped-query");
    mockGetDocs.mockResolvedValueOnce({ docs: [] });

    await getConsultas("user-002");

    const [field, op, value] = mockWhere.mock.calls[0];
    expect(field).toBe("userId");
    expect(op).toBe("==");
    expect(value).toBe("user-002");
    expect(value).not.toBe("user-001");
  });

  it("returns records sorted newest-first", async () => {
    mockWhere.mockReturnValueOnce("where-clause");
    mockQuery.mockReturnValueOnce("scoped-query");
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        { id: "old", data: () => ({ userId: "user-001", createdAt: { seconds: 1000 } }) },
        { id: "new", data: () => ({ userId: "user-001", createdAt: { seconds: 9000 } }) },
      ],
    });

    const result = await getConsultas("user-001");

    expect(result[0].id).toBe("new");
    expect(result[1].id).toBe("old");
  });

  it("returns an empty array when the user has no consultations", async () => {
    mockWhere.mockReturnValueOnce("where-clause");
    mockQuery.mockReturnValueOnce("scoped-query");
    mockGetDocs.mockResolvedValueOnce({ docs: [] });

    const result = await getConsultas("user-no-data");

    expect(result).toEqual([]);
  });

  it("includes the Firestore document ID in each returned record", async () => {
    mockWhere.mockReturnValueOnce("where-clause");
    mockQuery.mockReturnValueOnce("scoped-query");
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        { id: "doc-999", data: () => ({ userId: "user-001", createdAt: { seconds: 1 } }) },
      ],
    });

    const [record] = await getConsultas("user-001");

    expect(record.id).toBe("doc-999");
  });
});

// ── updateConsulta ────────────────────────────────────────────────────────────

describe("updateConsulta", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates the document by the provided ID", async () => {
    const fakeRef = { id: "doc-abc" };
    mockDoc.mockReturnValueOnce(fakeRef);
    mockUpdateDoc.mockResolvedValueOnce(undefined);

    await updateConsulta("doc-abc", { completed: true });

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), "consultas", "doc-abc");
    expect(mockUpdateDoc).toHaveBeenCalledWith(
      fakeRef,
      expect.objectContaining({ completed: true }),
    );
  });

  it("always bumps updatedAt on every update", async () => {
    mockDoc.mockReturnValueOnce({});
    mockUpdateDoc.mockResolvedValueOnce(undefined);

    await updateConsulta("doc-abc", { nivelRisco: "alto" });

    const [, payload] = mockUpdateDoc.mock.calls[0];
    expect(payload.updatedAt).toBe("__SERVER_TIMESTAMP__");
  });
});

// ── getConsulta ───────────────────────────────────────────────────────────────

describe("getConsulta", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns the record when the document exists", async () => {
    mockDoc.mockReturnValueOnce({});
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      id: "doc-abc",
      data: () => ({ userId: "user-001", patientName: "João" }),
    });

    const record = await getConsulta("doc-abc");

    expect(record).not.toBeNull();
    expect(record?.id).toBe("doc-abc");
    expect(record?.userId).toBe("user-001");
  });

  it("returns null when the document does not exist", async () => {
    mockDoc.mockReturnValueOnce({});
    mockGetDoc.mockResolvedValueOnce({ exists: () => false });

    const record = await getConsulta("does-not-exist");

    expect(record).toBeNull();
  });
});

// ── deleteConsulta ────────────────────────────────────────────────────────────

describe("deleteConsulta", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deletes only the specified document", async () => {
    const fakeRef = { id: "doc-del" };
    mockDoc.mockReturnValueOnce(fakeRef);
    mockDeleteDoc.mockResolvedValueOnce(undefined);

    await deleteConsulta("doc-del");

    expect(mockDoc).toHaveBeenCalledWith(expect.anything(), "consultas", "doc-del");
    expect(mockDeleteDoc).toHaveBeenCalledWith(fakeRef);
  });
});

// ── getAllConsultasCount ───────────────────────────────────────────────────────

describe("getAllConsultasCount", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns total and current-month counts", async () => {
    mockWhere.mockReturnValueOnce("date-filter");
    mockQuery.mockReturnValueOnce("month-query");
    mockGetCountFromServer
      .mockResolvedValueOnce({ data: () => ({ count: 42 }) })
      .mockResolvedValueOnce({ data: () => ({ count: 7 }) });

    const result = await getAllConsultasCount();

    expect(result.total).toBe(42);
    expect(result.mes).toBe(7);
  });
});
