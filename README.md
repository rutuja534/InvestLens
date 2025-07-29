# InvestLens
InvestLens is an AI-powered platform designed to accelerate the venture capital due diligence process. It transforms a raw PowerPoint pitch deck into a comprehensive, actionable investment thesis, enabling investors to make faster, more informed screening decisions.
The end-to-end workflow is fully automated: from a secure Google OAuth login and file upload to a sophisticated analysis by the Google Gemini API. The system culminates in a professional-grade PDF report, which is uploaded to AWS S3 and delivered directly to the user's inbox via a SendGrid email notification.
## Live Demo & Video

[![InvestLens Demo Video](https://raw.githubusercontent.com/rutuja534/InvestLens/ac3f579c11ae4ec8a6ca10f964a3ec6c493867ee/thumbnail.png)](https://vimeo.com/1105530159?share=copy)

*Click the image above to watch the full video walkthrough.*


### ✨ Key Features

*   **Full User Authentication:** Secure user registration and login with both traditional email/password and seamless **Google OAuth 2.0**. All protected routes are secured with JWT (JSON Web Tokens).

*   **Dynamic File Processing:** Accepts `.pptx` uploads and extracts all text content using a Python backend script, providing the raw material for AI analysis.

*   **AI-Powered Analysis:** Leverages the **Google Gemini 1.5 Flash API** with sophisticated prompt engineering to evaluate the pitch deck across 9 distinct categories, assigning quantitative scores and generating qualitative feedback.

*   **Automated PDF Reporting:** Dynamically generates a professional, multi-page PDF report from the AI analysis results using `pdfkit`.

*   **Cloud Integration:**
    *   **AWS S3:** All generated PDF reports are automatically uploaded to and stored in a secure AWS S3 bucket for scalable and persistent access.
    *   **SendGrid:** Upon completion, users receive a beautifully formatted HTML **email notification** with a direct, public download link to their new report.

---

### 🔧 Technologies Used

| Category   | Technology                                               |
| :--------- | :---------------------------------------------------     |
| **Frontend** | React.js, Material-UI (MUI), Axios, React Router     |
| **Backend**  | Node.js, Express.js, Sequelize, Passport.js (for OAuth) |
| **Database** | PostgreSQL                                           |
| **AI Model and ML** | Google Gemini 1.5 Flash, Tesseract (via pytesseract)                              |
| **Cloud**    | AWS S3 (Storage), SendGrid (Email)                     |
| **Python**   | python-pptx                                          |
| **Tools**    | Git, VS Code                                         |

---
### ⚙️ Local Setup & Installation

To run this project on your local machine, please follow these steps:

#### 1. Prerequisites:
*   [Node.js](https://nodejs.org/) (which includes npm) installed.
*   [Python](https://www.python.org/) installed.
*   [Git](https://git-scm.com/) installed.
*   A running PostgreSQL instance (e.g., via [PostgreSQL installer](https://www.postgresql.org/download/) or a tool like pgAdmin).

#### 2. Clone the Repository:
```bash
git clone https://github.com/rutuja534/InvestLens.git
cd InvestLens

