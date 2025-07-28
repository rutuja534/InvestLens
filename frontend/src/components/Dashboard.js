// src/components/Dashboard.js
import React, { useState } from 'react';
import axios from '../api';
import { 
  Container, 
  Box, 
  Button, 
  Typography, 
  Alert, 
  CircularProgress,
  Paper,
  Stack
} from '@mui/material';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline'; 

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(''); 
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError('');
      setDownloadUrl(''); 
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setDownloadUrl('');

    const formData = new FormData();
    formData.append('pitchDeck', selectedFile);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/analysis/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      setDownloadUrl(response.data.downloadUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during upload.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper 
        elevation={2} 
        sx={{ 
          my: 4, 
          p: 4, 
          textAlign: 'center', 
          borderRadius: 3 
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{
            background: 'linear-gradient(90deg,rgb(236, 91, 203), #3f51b5)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            mb: 1
          }}>
            Pitch Deck Analyzer
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '80%' }}>
            Get instant, AI-powered analysis of your startup's pitch deck.
          </Typography>

          {/* --- THIS IS THE CORRECTED AND RESTORED FILE UPLOAD AREA --- */}
          <Box
            component="label"
            htmlFor="file-upload-input"
            sx={{
              border: '2px dashed',
              borderColor: 'grey.400',
              borderRadius: 2,
              p: 4,
              width: '100%',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <input 
              id="file-upload-input" 
              type="file" 
              hidden 
              onChange={handleFileChange} 
              accept=".ppt,.pptx" 
            />
            {selectedFile ? (
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                <CheckCircleOutlineIcon color="success" />
                <Typography fontWeight="medium">{selectedFile.name}</Typography>
              </Stack>
            ) : (
              <Stack spacing={1} alignItems="center">
                <UploadFileOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                <Typography>
                  Drag & drop your file here, or{' '}
                  <Typography component="span" color="primary">
                    click to browse
                  </Typography>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supports: .ppt, .pptx
                </Typography>
              </Stack>
            )}
          </Box>

          <Box sx={{ width: '100%' }}>
            <Button 
              variant="contained" 
              color="secondary"
              size="large"
              disabled={isLoading || !selectedFile}
              onClick={handleUpload}
              sx={{ 
                width: '100%', 
                maxWidth: '300px',
                minHeight: 48,
                fontWeight: 'bold'
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Analyze Deck'}
            </Button>
          </Box>
          
          {/* --- This feedback area correctly handles both errors and the download button --- */}
          <Box sx={{ mt: 3, width: '100%', minHeight: '90px' }}>
            {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
            
            {downloadUrl && (
              <Alert severity="success" icon={<CheckCircleOutlineIcon fontSize="inherit" />} sx={{ width: '100%' }}>
                <Typography fontWeight="bold">Analysis Complete!</Typography>
                <Typography sx={{ mb: 2 }}>Your report is ready to download.</Typography>
                <Button
                  variant="contained"
                  color="success"
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer" 
                  startIcon={<DownloadForOfflineIcon />}
                >
                  Download Report
                </Button>
              </Alert>
            )}
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Dashboard;