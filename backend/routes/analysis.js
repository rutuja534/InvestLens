// routes/analysis.js
const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const upload = require('../uploads/file-upload');
const authMiddleware = require('../middleware/authMiddleware');
const { analyzePitchDeckText } = require('../services/aiService');
const { generateInvestmentThesisPDF } = require('../reports/pdfService'); // Assuming this path is correct
// --- 1. Import the new email service ---
const { sendAnalysisCompleteEmail } = require('../services/emailService'); 

const router = express.Router();

router.post('/upload', [authMiddleware, upload.single('pitchDeck')], async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = req.file.path;

  try {
    // Step 1: Extract text from the uploaded file
    const extractedText = await new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', ['scripts/extract_text.py', filePath]);
      let text = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        text += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python script error: ${errorOutput}`);
          reject(new Error('Failed to extract text from file.'));
        } else {
          resolve(text);
        }
      });
    });

    // Step 2: Get the analysis from the Gemini AI service
    const analysisResult = await analyzePitchDeckText(extractedText);

    // Step 3: Generate the PDF and get the public S3 URL
    const startupName = req.file.originalname.replace(/\.pptx?/i, '').replace(/[^a-zA-Z0-9]/g, ' ');
    const downloadUrl = await generateInvestmentThesisPDF(analysisResult, startupName);

    // --- 2. NEW STEP: Send the confirmation email ---
    // We wrap this in its own try...catch so that if the email fails,
    // the user still gets their download link on the frontend.
    try {
      // The authMiddleware attaches the logged-in user's info to req.user
      const userEmail = req.user.email; 
      if (userEmail) {
        await sendAnalysisCompleteEmail(userEmail, downloadUrl);
      }
    } catch (emailError) {
      console.error("Non-critical error: Failed to send confirmation email.", emailError);
    }

    // Step 4: Send the successful response back to the frontend
    res.status(200).json({
      message: 'Analysis complete! Report uploaded to cloud.',
      downloadUrl: downloadUrl
    });

  } catch (error) {
    console.error('An error occurred during the analysis process:', error);
    res.status(500).json({ message: 'Failed to process the report.' });
  } finally {
    // Step 5: Clean up the temporary uploaded file
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting temporary upload file:", err);
    });
  }
});

module.exports = router;