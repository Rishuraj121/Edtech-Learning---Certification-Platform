const PDFDocument = require('pdfkit');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Generate and download certificate PDF
// @route   GET /api/certificate/:courseId
exports.getCertificate = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { courseId } = req.params;

    // Find completed enrollment
    const enrollment = await Enrollment.findOne({
      userId,
      courseId,
      paymentStatus: 'paid',
      isCompleted: true
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'Course not completed yet. Complete all lessons to earn your certificate.'
      });
    }

    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    if (!course || !user) {
      return res.status(404).json({ success: false, message: 'Course or user not found' });
    }

    const completionDate = enrollment.completedAt
      ? new Date(enrollment.completedAt).toLocaleDateString('en-IN', {
          year: 'numeric', month: 'long', day: 'numeric'
        })
      : new Date().toLocaleDateString('en-IN', {
          year: 'numeric', month: 'long', day: 'numeric'
        });

    // Generate PDF
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margins: { top: 0, bottom: 0, left: 0, right: 0 }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="SkillHub_Certificate_${user.name.replace(/\s/g, '_')}.pdf"`
    );
    doc.pipe(res);

    const W = 841.89;
    const H = 595.28;

    // ── Background gradient simulation ──────────────────────
    doc.rect(0, 0, W, H).fill('#0f0c29');
    doc.rect(0, 0, W, H / 2).fill('#1a1560');

    // Decorative border
    doc.roundedRect(20, 20, W - 40, H - 40, 12)
      .lineWidth(3)
      .strokeColor('#6c5ce7')
      .stroke();

    doc.roundedRect(28, 28, W - 56, H - 56, 10)
      .lineWidth(1)
      .strokeColor('#a29bfe')
      .stroke();

    // Top accent bar
    doc.rect(20, 20, W - 40, 6).fill('#6c5ce7');

    // ── Header ───────────────────────────────────────────────
    doc.fillColor('#a29bfe')
      .fontSize(13)
      .font('Helvetica')
      .text('S K I L L H U B', 0, 55, { align: 'center', characterSpacing: 6 });

    doc.fillColor('#ffffff')
      .fontSize(36)
      .font('Helvetica-Bold')
      .text('Certificate of Completion', 0, 78, { align: 'center' });

    // Divider line
    doc.moveTo(W / 2 - 160, 128).lineTo(W / 2 + 160, 128)
      .lineWidth(1.5)
      .strokeColor('#6c5ce7')
      .stroke();

    // ── Body ─────────────────────────────────────────────────
    doc.fillColor('#c8c8e8')
      .fontSize(14)
      .font('Helvetica')
      .text('THIS IS TO CERTIFY THAT', 0, 145, { align: 'center', characterSpacing: 3 });

    // Student name
    doc.fillColor('#ffffff')
      .fontSize(42)
      .font('Helvetica-BoldOblique')
      .text(user.name, 0, 172, { align: 'center' });

    doc.fillColor('#c8c8e8')
      .fontSize(14)
      .font('Helvetica')
      .text('has successfully completed the course', 0, 228, { align: 'center' });

    // Course name
    doc.fillColor('#a29bfe')
      .fontSize(24)
      .font('Helvetica-Bold')
      .text(course.title, 60, 255, { align: 'center', width: W - 120 });

    // ── Footer metadata ───────────────────────────────────────
    const footerY = H - 120;

    // Date
    doc.fillColor('#8888aa')
      .fontSize(11)
      .font('Helvetica')
      .text('DATE OF COMPLETION', 80, footerY, { characterSpacing: 2 });
    doc.fillColor('#ffffff')
      .fontSize(13)
      .font('Helvetica-Bold')
      .text(completionDate, 80, footerY + 18);

    // Instructor
    doc.fillColor('#8888aa')
      .fontSize(11)
      .font('Helvetica')
      .text('INSTRUCTOR', W / 2 - 60, footerY, { characterSpacing: 2 });
    doc.fillColor('#ffffff')
      .fontSize(13)
      .font('Helvetica-Bold')
      .text(course.instructor || 'SkillHub Expert', W / 2 - 60, footerY + 18);

    // Certificate ID
    const certId = `SKH-${enrollment._id.toString().slice(-8).toUpperCase()}`;
    doc.fillColor('#8888aa')
      .fontSize(11)
      .font('Helvetica')
      .text('CERTIFICATE ID', W - 220, footerY, { characterSpacing: 2 });
    doc.fillColor('#ffffff')
      .fontSize(13)
      .font('Helvetica-Bold')
      .text(certId, W - 220, footerY + 18);

    // Bottom bar
    doc.rect(20, H - 44, W - 40, 4).fill('#6c5ce7');

    // Watermark ribbon icon area
    doc.circle(W / 2, H - 85, 20)
      .lineWidth(2)
      .strokeColor('#6c5ce7')
      .stroke();
    doc.fillColor('#6c5ce7')
      .fontSize(18)
      .text('✓', W / 2 - 7, H - 95);

    doc.end();
  } catch (error) {
    console.error('Certificate error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Error generating certificate' });
    }
  }
};
