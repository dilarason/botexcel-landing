import axios from 'axios';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Doğrulama anahtarı eksik' }, { status: 400 });
    }

    // Verify Turnstile Token
    const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const result = await axios.post(verifyUrl, {
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    });

    if (!result.data.success) {
      return NextResponse.json({ error: 'Doğrulama başarısız' }, { status: 400 });
    }

    // Send Email via SMTP (Brevo/Gmail/etc.)
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      if (!process.env.SMTP_PASS) {
        console.error('SMTP_PASS is missing in environment variables');
        return NextResponse.json(
          { error: 'E-posta servisi doğru yapılandırılmamış' },
          { status: 500 }
        );
      }

      // Brevo-specific configuration
      const isBrevo = process.env.SMTP_HOST.includes('brevo.com') ||
        process.env.SMTP_HOST.includes('sendinblue.com');

      const smtpPort = Number(process.env.SMTP_PORT) || 587;
      const isSecurePort = smtpPort === 465;

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: smtpPort,
        secure: isSecurePort, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER.trim(), // Remove any whitespace
          pass: process.env.SMTP_PASS.trim(), // Remove any whitespace
        },
        // Brevo-specific TLS configuration
        ...(isBrevo && {
          tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false,
          },
          requireTLS: !isSecurePort, // Require TLS for port 587
        }),
        // General TLS options for other providers
        ...(!isBrevo && {
          tls: {
            rejectUnauthorized: false,
          },
        }),
      });

      // Log configuration (without sensitive data)
      if (process.env.NODE_ENV === 'development') {
        console.log('SMTP Configuration:', {
          host: process.env.SMTP_HOST,
          port: smtpPort,
          secure: isSecurePort,
          user: process.env.SMTP_USER,
          passLength: process.env.SMTP_PASS?.length,
          isBrevo,
        });
      }

      // Verify connection configuration
      try {
        await transporter.verify();
        if (process.env.NODE_ENV === 'development') {
          console.log('SMTP connection verified successfully');
        }
      } catch (verifyError: unknown) {
        const error = verifyError as { code?: string; message?: string; response?: string; responseCode?: number };
        console.error('SMTP connection verification failed:', {
          code: error.code,
          message: error.message,
          response: error.response,
          responseCode: error.responseCode,
        });

        // More specific error message for Brevo
        if (isBrevo && error.code === 'EAUTH') {
          return NextResponse.json(
            {
              error: 'Brevo SMTP kimlik doğrulaması başarısız.',
              details: 'Lütfen doğrulayın: 1) SMTP_USER tam e-posta adresiniz, 2) SMTP_PASS SMTP anahtarınız (API anahtarı değil), 3) Bilgiler Brevo SMTP ayarlarından alınmış olmalı'
            },
            { status: 500 }
          );
        }

        return NextResponse.json(
          { error: 'E-posta doğrulaması başarısız. SMTP bilgilerini kontrol edin.' },
          { status: 500 }
        );
      }

      await transporter.sendMail({
        from: process.env.SMTP_FROM || `BotExcel İletişim <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
        replyTo: email,
        subject: `Yeni iletişim talebi: ${name}`,
        text: `Ad: ${name}\nE-posta: ${email}\n\nMesaj:\n${message}`,
        html: `
          <h3>Yeni iletişim talebi</h3>
          <p><strong>Ad:</strong> ${name}</p>
          <p><strong>E-posta:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Mesaj:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });
    } else {
      console.log('E-posta gönderimi atlandı (kimlik bilgisi yok). Veri:', { name, email, message });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Contact error:', error);
    const err = error as { code?: string; message?: string };

    // Provide more specific error messages
    if (err.code === 'EAUTH') {
      return NextResponse.json(
        {
          error: 'E-posta doğrulaması başarısız. SMTP bilgilerini kontrol edin.',
          details: 'Geçersiz SMTP kullanıcı adı veya parola'
        },
        { status: 500 }
      );
    }

    if (err.code === 'ECONNECTION' || err.code === 'ETIMEDOUT') {
      return NextResponse.json(
        {
          error: 'E-posta sunucusuna bağlanılamadı. SMTP host ve port ayarlarını kontrol edin.',
          details: err.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'E-posta gönderilemedi. Lütfen tekrar deneyin.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      },
      { status: 500 }
    );
  }
}
