const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const DatabaseService = require('../services/database');
const EmailService = require('../services/email');

const enrollmentValidation = [
  body('parent_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Parent name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('phone')
    .matches(/^[+]?[0-9]{10,15}$/)
    .withMessage('Please provide a valid phone number (10-15 digits)'),
  body('city')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),
  body('grade')
    .isIn(['kg', '1', '2', '3', '4', '5', '6', '7'])
    .withMessage('Please select a valid grade'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Message must not exceed 1000 characters')
];

router.post('/', enrollmentValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        ok: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { parent_name, email, phone, city, grade, message = '' } = req.body;

    const referenceNumber = `AMS${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const applicant = {
      id: uuidv4(),
      reference_number: referenceNumber,
      parent_name,
      email,
      phone,
      city,
      grade,
      message,
      status: 'new',
      created_at: new Date().toISOString()
    };

    const dbResult = await DatabaseService.saveApplicant(applicant);
    if (!dbResult.success) {
      console.error('[enroll] Database error:', dbResult.error);
      return res.status(500).json({
        ok: false,
        error: 'Failed to save application. Please try again.'
      });
    }

    Promise.resolve()
      .then(() => EmailService.sendEnrollmentEmails(applicant))
      .then((result) => {
        if (result.admin?.success) {
          console.log('[enroll] Admin notification email sent');
        } else {
          console.error('[enroll] Admin notification email failed:', result.admin?.error || 'unknown');
        }

        if (result.parent?.success) {
          console.log('[enroll] Parent confirmation email sent');
        } else {
          console.error('[enroll] Parent confirmation email failed:', result.parent?.error || 'unknown');
        }
      })
      .catch((error) => {
        console.error('[enroll] Email async error:', error.message || error);
      });

    return res.json({
      ok: true,
      message: 'Application submitted successfully!',
      reference_number: referenceNumber,
      applicant_id: applicant.id
    });
  } catch (error) {
    console.error('[enroll] Enrollment error:', error);
    return res.status(500).json({
      ok: false,
      error: 'Internal server error. Please try again later.'
    });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const result = await DatabaseService.getEnrollmentStats();
    if (!result.success) {
      return res.status(500).json({
        ok: false,
        error: result.error || 'Failed to fetch statistics'
      });
    }

    return res.json({
      ok: true,
      stats: result.stats
    });
  } catch (error) {
    console.error('[enroll] Stats error:', error);
    return res.status(500).json({
      ok: false,
      error: 'Failed to fetch statistics'
    });
  }
});

module.exports = router;
