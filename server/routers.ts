import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { insertSeminarRegistration } from "./db";
import { sendAdminNotification, sendApplicantConfirmation } from "./sendgrid";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  seminar: router({
    submitRegistration: publicProcedure
      .input(
        z.object({
          company: z.string().min(1, "会社名は必須です"),
          name: z.string().min(1, "氏名は必須です"),
          position: z.string().min(1, "役職は必須です"),
          email: z.string().email("有効なメールアドレスを入力してください"),
          phone: z.string().min(1, "電話番号は必須です"),
          challenge: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Save to database
          await insertSeminarRegistration({
            companyName: input.company,
            name: input.name,
            position: input.position,
            email: input.email,
            phone: input.phone,
            challenge: input.challenge,
          });

          // Send admin notification email
          const adminEmailSent = await sendAdminNotification({
            companyName: input.company,
            name: input.name,
            position: input.position,
            email: input.email,
            phone: input.phone,
            challenge: input.challenge,
          });

          // Send applicant confirmation email
          const applicantEmailSent = await sendApplicantConfirmation({
            companyName: input.company,
            name: input.name,
            position: input.position,
            email: input.email,
            phone: input.phone,
            challenge: input.challenge,
          });

          console.log(
            `[Seminar] Registration saved. Admin email: ${adminEmailSent}, Applicant email: ${applicantEmailSent}`
          );

          return {
            success: true,
            message: "申し込みが完了しました。確認メールをご確認ください。",
          };
        } catch (error) {
          console.error("[Seminar] Registration error:", error);
          throw new Error("申し込み処理中にエラーが発生しました。");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
