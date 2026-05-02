const nodemailer = require('nodemailer');

function parsePort(value, fallback) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

class EmailService {
  constructor() {
    this.transporter = null;
    this.fromAddress = null;
    this.init();
  }

  init() {
    const smtpHost = (process.env.SMTP_HOST || '').trim();
    const smtpPort = parsePort(process.env.SMTP_PORT, 587);
    const smtpUser = (process.env.SMTP_USER || '').trim();
    const smtpPass = (process.env.SMTP_PASS || '').trim();
    const schoolFromEmail = (process.env.SCHOOL_FROM_EMAIL || '').trim();
    const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || smtpPort === 465;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !schoolFromEmail) {
      console.error(
        '[email] Email transport not configured. Required env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SCHOOL_FROM_EMAIL'
      );
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure,
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      ...(smtpHost.toLowerCase().includes('gmail') ? { tls: { minVersion: 'TLSv1.2' } } : {})
    });

    this.fromAddress = schoolFromEmail;
    console.log(`[email] Transport initialized (host=${smtpHost}, port=${smtpPort}, secure=${secure})`);

    this.transporter.verify((error) => {
      if (error) {
        console.error('[email] Transport verify failed:', error.code || error.message);
      } else {
        console.log('[email] Transport verify successful');
      }
    });
  }

  isConfigured() {
    return Boolean(this.transporter && this.fromAddress);
  }

  async sendMailSafe(mailOptions, label) {
    if (!this.isConfigured()) {
      return { success: false, error: 'Email transport not configured', label };
    }

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(`[email] ${label} sent (messageId=${result.messageId})`);
      return { success: true, messageId: result.messageId, label };
    } catch (error) {
      console.error(`[email] ${label} failed:`, error.code || error.message);
      return { success: false, error: error.message || 'Failed to send email', label };
    }
  }

  buildAdminTemplate(applicant) {
    const gradeText = applicant.grade === 'kg' ? 'Kindergarten' : `Grade ${applicant.grade}`;
    const currentDate = new Date().toLocaleDateString('en-IN');
    const subject = `New Application Received - ${applicant.reference_number}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${subject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a3986; color: #fff; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
            .card { background: #fff; border: 1px solid #e2e2e2; border-radius: 8px; padding: 16px; margin-top: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Alpha Model's International School</h2>
              <p>New Enrollment Application</p>
            </div>
            <div class="content">
              <div class="card">
                <p><strong>Reference:</strong> ${applicant.reference_number}</p>
                <p><strong>Parent Name:</strong> ${applicant.parent_name}</p>
                <p><strong>Email:</strong> ${applicant.email}</p>
                <p><strong>Phone:</strong> ${applicant.phone}</p>
                <p><strong>City:</strong> ${applicant.city}</p>
                <p><strong>Grade:</strong> ${gradeText}</p>
                <p><strong>Date:</strong> ${currentDate}</p>
                ${applicant.message ? `<p><strong>Message:</strong> ${applicant.message}</p>` : ''}
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = [
      `New Application Received - ${applicant.reference_number}`,
      `Parent Name: ${applicant.parent_name}`,
      `Email: ${applicant.email}`,
      `Phone: ${applicant.phone}`,
      `City: ${applicant.city}`,
      `Grade: ${gradeText}`,
      `Date: ${currentDate}`,
      applicant.message ? `Message: ${applicant.message}` : ''
    ]
      .filter(Boolean)
      .join('\n');

    return { subject, html, text };
  }

  buildParentTemplate(applicant) {
    const gradeText = applicant.grade === 'kg' ? 'Kindergarten' : `Grade ${applicant.grade}`;
    const subject = `Application Received - ${applicant.reference_number}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${subject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a3986; color: #fff; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Alpha Model's International School</h2>
              <p>Application Confirmation</p>
            </div>
            <div class="content">
              <p>Dear ${applicant.parent_name},</p>
              <p>Thank you for submitting your application for <strong>${gradeText}</strong>.</p>
              <p><strong>Your reference number:</strong> ${applicant.reference_number}</p>
              <p>Our admissions team will contact you soon.</p>
              <p>Regards,<br/>Admissions Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = [
      `Dear ${applicant.parent_name},`,
      '',
      `Thank you for submitting your application for ${gradeText}.`,
      `Your reference number: ${applicant.reference_number}`,
      '',
      'Our admissions team will contact you soon.',
      '',
      'Regards,',
      'Admissions Team'
    ].join('\n');

    return { subject, html, text };
  }

  async sendEnrollmentEmails(applicant) {
    if (!this.isConfigured()) {
      const error = 'Email transport not configured';
      console.error(`[email] ${error}`);
      return {
        success: false,
        error,
        admin: { success: false, error },
        parent: { success: false, error }
      };
    }

    const adminTo = (process.env.SCHOOL_FROM_EMAIL || '').trim();
    const parentTo = (applicant.email || '').trim();

    if (!adminTo) {
      const error = 'SCHOOL_FROM_EMAIL is missing';
      console.error(`[email] ${error}`);
      return {
        success: false,
        error,
        admin: { success: false, error },
        parent: { success: false, error: 'Parent email skipped because admin email config is missing' }
      };
    }

    const adminTemplate = this.buildAdminTemplate(applicant);
    const parentTemplate = this.buildParentTemplate(applicant);

    const [adminResult, parentResult] = await Promise.allSettled([
      this.sendMailSafe(
        {
          from: `"Alpha Model's International School" <${this.fromAddress}>`,
          to: adminTo,
          replyTo: parentTo || this.fromAddress,
          subject: adminTemplate.subject,
          text: adminTemplate.text,
          html: adminTemplate.html
        },
        'Admin notification email'
      ),
      parentTo
        ? this.sendMailSafe(
            {
              from: `"Alpha Model's International School" <${this.fromAddress}>`,
              to: parentTo,
              subject: parentTemplate.subject,
              text: parentTemplate.text,
              html: parentTemplate.html
            },
            'Parent confirmation email'
          )
        : Promise.resolve({ success: false, error: 'Parent email is missing', label: 'Parent confirmation email' })
    ]);

    const admin =
      adminResult.status === 'fulfilled'
        ? adminResult.value
        : { success: false, error: adminResult.reason?.message || 'Admin email promise rejected' };

    const parent =
      parentResult.status === 'fulfilled'
        ? parentResult.value
        : { success: false, error: parentResult.reason?.message || 'Parent email promise rejected' };

    return {
      success: admin.success || parent.success,
      admin,
      parent
    };
  }
}

module.exports = new EmailService();
