import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";
import * as sendgrid from "./sendgrid";

// Mock database and email functions
vi.mock("./db", () => ({
  insertSeminarRegistration: vi.fn(),
  getDb: vi.fn(),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
  getAllSeminarRegistrations: vi.fn(),
}));

vi.mock("./sendgrid", () => ({
  sendAdminNotification: vi.fn(),
  sendApplicantConfirmation: vi.fn(),
  sendEmail: vi.fn(),
}));

function createContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("seminar.submitRegistration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully register a seminar applicant", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    // Mock successful database insert
    vi.mocked(db.insertSeminarRegistration).mockResolvedValue(undefined as any);
    
    // Mock successful email sends
    vi.mocked(sendgrid.sendAdminNotification).mockResolvedValue(true);
    vi.mocked(sendgrid.sendApplicantConfirmation).mockResolvedValue(true);

    const input = {
      company: "テストシステム株式会社",
      name: "山田太郎",
      position: "営業部長",
      email: "yamada@test-system.co.jp",
      phone: "03-1234-5678",
      challenge: "提案書作成に時間がかかる",
    };

    const result = await caller.seminar.submitRegistration(input);

    expect(result.success).toBe(true);
    expect(result.message).toContain("申し込みが完了しました");

    // Verify database insert was called
    expect(db.insertSeminarRegistration).toHaveBeenCalledWith({
      companyName: input.company,
      name: input.name,
      position: input.position,
      email: input.email,
      phone: input.phone,
      challenge: input.challenge,
    });

    // Verify emails were sent
    expect(sendgrid.sendAdminNotification).toHaveBeenCalledWith({
      companyName: input.company,
      name: input.name,
      position: input.position,
      email: input.email,
      phone: input.phone,
      challenge: input.challenge,
    });

    expect(sendgrid.sendApplicantConfirmation).toHaveBeenCalledWith({
      companyName: input.company,
      name: input.name,
      position: input.position,
      email: input.email,
      phone: input.phone,
      challenge: input.challenge,
    });
  });

  it("should validate required fields", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const invalidInput = {
      company: "",
      name: "",
      position: "",
      email: "invalid-email",
      phone: "",
    };

    await expect(
      caller.seminar.submitRegistration(invalidInput)
    ).rejects.toThrow();
  });

  it("should handle database errors gracefully", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    // Mock database error
    vi.mocked(db.insertSeminarRegistration).mockRejectedValue(
      new Error("Database connection failed")
    );

    const input = {
      company: "テストシステム株式会社",
      name: "山田太郎",
      position: "営業部長",
      email: "yamada@test-system.co.jp",
      phone: "03-1234-5678",
    };

    await expect(caller.seminar.submitRegistration(input)).rejects.toThrow(
      "申し込み処理中にエラーが発生しました"
    );
  });

  it("should work without optional challenge field", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(db.insertSeminarRegistration).mockResolvedValue(undefined as any);
    vi.mocked(sendgrid.sendAdminNotification).mockResolvedValue(true);
    vi.mocked(sendgrid.sendApplicantConfirmation).mockResolvedValue(true);

    const input = {
      company: "テストシステム株式会社",
      name: "山田太郎",
      position: "営業部長",
      email: "yamada@test-system.co.jp",
      phone: "03-1234-5678",
      // challenge is optional
    };

    const result = await caller.seminar.submitRegistration(input);

    expect(result.success).toBe(true);
    expect(db.insertSeminarRegistration).toHaveBeenCalled();
  });
});
