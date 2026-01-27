import axios from "axios";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_API_URL = "https://api.sendgrid.com/v3/mail/send";

interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.error("[SendGrid] API key not configured");
    return false;
  }

  try {
    const response = await axios.post(
      SENDGRID_API_URL,
      {
        personalizations: [
          {
            to: [{ email: options.to }],
          },
        ],
        from: { email: options.from },
        subject: options.subject,
        content: [
          {
            type: "text/html",
            value: options.html,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.status === 202;
  } catch (error) {
    console.error("[SendGrid] Failed to send email:", error);
    return false;
  }
}

/**
 * Send admin notification email
 */
export async function sendAdminNotification(data: {
  companyName: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  challenge?: string;
}): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0891b2 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
    .info-row { margin: 15px 0; padding: 15px; background: white; border-left: 4px solid #0891b2; border-radius: 4px; }
    .label { font-weight: bold; color: #0891b2; margin-bottom: 5px; }
    .value { color: #1e293b; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🎉 新規セミナー申込</h1>
      <p style="margin: 10px 0 0 0;">SI・開発営業向けGemini活用セミナー</p>
    </div>
    <div class="content">
      <p>新しいセミナー申込がありました。</p>
      
      <div class="info-row">
        <div class="label">会社名</div>
        <div class="value">${data.companyName}</div>
      </div>
      
      <div class="info-row">
        <div class="label">氏名</div>
        <div class="value">${data.name}</div>
      </div>
      
      <div class="info-row">
        <div class="label">役職</div>
        <div class="value">${data.position}</div>
      </div>
      
      <div class="info-row">
        <div class="label">メールアドレス</div>
        <div class="value">${data.email}</div>
      </div>
      
      <div class="info-row">
        <div class="label">電話番号</div>
        <div class="value">${data.phone}</div>
      </div>
      
      ${
        data.challenge
          ? `
      <div class="info-row">
        <div class="label">課題に感じていること</div>
        <div class="value">${data.challenge}</div>
      </div>
      `
          : ""
      }
      
      <div class="footer">
        <p>このメールは自動送信されています。</p>
        <p>© 2026 anyenv株式会社</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return await sendEmail({
    to: "info@anyenv-inc.com",
    from: "noreply@anyenv-inc.com",
    subject: "【Geminiセミナー】新規登録通知",
    html,
  });
}

/**
 * Send confirmation email to applicant
 */
export async function sendApplicantConfirmation(data: {
  companyName: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  challenge?: string;
}): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0891b2 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #0891b2; }
    .seminar-info { margin: 15px 0; }
    .label { font-weight: bold; color: #0891b2; }
    .value { color: #1e293b; margin-left: 10px; }
    .note { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">✅ 申込完了</h1>
      <p style="margin: 10px 0 0 0;">SI・開発営業向けGemini活用セミナー</p>
    </div>
    <div class="content">
      <p>${data.name} 様</p>
      <p>この度は「SI・開発営業向けGemini活用セミナー」にお申し込みいただき、誠にありがとうございます。</p>
      <p>以下の内容で受付いたしました。</p>
      
      <div class="info-box">
        <h3 style="margin-top: 0; color: #0891b2;">📋 登録情報</h3>
        <div class="seminar-info">
          <span class="label">会社名:</span>
          <span class="value">${data.companyName}</span>
        </div>
        <div class="seminar-info">
          <span class="label">氏名:</span>
          <span class="value">${data.name}</span>
        </div>
        <div class="seminar-info">
          <span class="label">役職:</span>
          <span class="value">${data.position}</span>
        </div>
        <div class="seminar-info">
          <span class="label">メールアドレス:</span>
          <span class="value">${data.email}</span>
        </div>
        <div class="seminar-info">
          <span class="label">電話番号:</span>
          <span class="value">${data.phone}</span>
        </div>
      </div>
      
      <div class="info-box">
        <h3 style="margin-top: 0; color: #0891b2;">📅 セミナー情報</h3>
        <div class="seminar-info">
          <span class="label">日時:</span>
          <span class="value">2026年2月3日(火) 14:00～15:00</span>
        </div>
        <div class="seminar-info">
          <span class="label">形式:</span>
          <span class="value">オンライン（Google Meet）</span>
        </div>
        <div class="seminar-info">
          <span class="label">参加費:</span>
          <span class="value">無料</span>
        </div>
      </div>
      
      <div class="note">
        <p style="margin: 0;"><strong>📧 参加URLについて</strong></p>
        <p style="margin: 10px 0 0 0;">セミナー開催の前日までに、参加用のURLをメールにてお送りいたします。</p>
      </div>
      
      <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
      <p>当日のご参加を心よりお待ちしております。</p>
      
      <div class="footer">
        <p><strong>anyenv株式会社</strong></p>
        <p>Email: info@anyenv-inc.com</p>
        <p>© 2026 anyenv株式会社</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return await sendEmail({
    to: data.email,
    from: "noreply@anyenv-inc.com",
    subject: "【登録完了】Gemini活用セミナー 営業改革シリーズ",
    html,
  });
}
