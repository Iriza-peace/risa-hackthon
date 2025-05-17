import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import ComplaintCard from '../components/ComplaintCard';
import { getComplaintById } from '../utils/mockData';

const ComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // In a real application, you would fetch the complaint data from an API
  const complaint = id ? getComplaintById(id) : undefined;

  if (!complaint) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        {id ? (
          <Box sx={{ textAlign: 'center' }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              Complaint not found
            </Alert>
            <Button onClick={() => navigate('/')} startIcon={<ArrowLeft size={18} />}>
              Back to Home
            </Button>
          </Box>
        ) : (
          <CircularProgress />
        )}
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Button 
          startIcon={<ArrowLeft size={18} />} 
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        
        <Paper 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" fontWeight="bold">
              Complaint Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tracking ID: {complaint.id}
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <ComplaintCard complaint={complaint} isDetailed />
        </Paper>

        <Paper 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Timeline
          </Typography>
          
          <Box sx={{ position: 'relative', ml: 2, pl: 3, borderLeft: '2px dashed', borderColor: 'divider' }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                mb: 3,
                position: 'relative',
              }}
            >
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  bgcolor: 'primary.main',
                  position: 'absolute',
                  left: -31,
                  top: 6,
                  zIndex: 1,
                }}
              />
              <Box>
                <Typography variant="subtitle2" fontWeight="medium">
                  Complaint Submitted
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(complaint.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Your complaint has been received and is pending review.
                </Typography>
              </Box>
            </Box>
            
            {complaint.status !== 'Pending' && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  mb: 3,
                  position: 'relative',
                }}
              >
                <Box 
                  sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    bgcolor: 'info.main',
                    position: 'absolute',
                    left: -31,
                    top: 6,
                    zIndex: 1,
                  }}
                />
                <Box>
                  <Typography variant="subtitle2" fontWeight="medium">
                    Under Review
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(complaint.updatedAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Your complaint is being reviewed by the relevant department.
                  </Typography>
                </Box>
              </Box>
            )}
            
            {complaint.status === 'Resolved' && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  position: 'relative',
                }}
              >
                <Box 
                  sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    bgcolor: 'success.main',
                    position: 'absolute',
                    left: -31,
                    top: 6,
                    zIndex: 1,
                  }}
                />
                <Box>
                  <Typography variant="subtitle2" fontWeight="medium">
                    Resolved
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date().toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Your complaint has been resolved. Thank you for your patience.
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ComplaintDetail;