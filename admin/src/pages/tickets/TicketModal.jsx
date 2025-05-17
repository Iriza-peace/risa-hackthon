import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Grid, TextField } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link } from '@mui/material';
import TransferTicket from './TransferTicket';
import useAuthStore from 'store/useAuthStore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60rem',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

const previewStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60rem',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
  borderRadius: 2
};

export default function TicketModal({ open, onClose, navigateToChat, ticketDetails }) {
  const [previewDoc, setPreviewDoc] = useState(null);
  const togglePreviewDoc = () => setPreviewDoc((prevState) => !prevState);
  const [transferModalOpen, setTransferModalOpen] = useState(false);

  const userName = useAuthStore((state) => state.user?.full_name);
  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <Box display="flex" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5">Ticket Details</Typography>
            <Button variant="outlined" onClick={() => setTransferModalOpen(true)}>
              Transfer Ticket
            </Button>
            <TransferTicket 
            open={transferModalOpen} 
            onClose={() => setTransferModalOpen(false)} 
            ticketId={ticketDetails.id} />
          </Box>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            {/* Article Title */}
            <Grid item xs={6}>
              <TextField fullWidth label="Requester Name" variant="outlined" value={ticketDetails.name || 'N/A'} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Ticket Title" variant="outlined" value={ticketDetails.title || 'N/A'} />
            </Grid>

            <Grid item xs={6}>
              {/* value={ticketDetails.Agent?.agent_full_name || 'Unassigned'} /> */}
              <TextField fullWidth label="Assigned To" variant="outlined" value={useAuthStore.getState().isAuthenticated ? useAuthStore.getState().userName : 'User'}/>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Ticket Status" variant="outlined" value={ticketDetails.status || 'N/A'} />
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth label="Position" variant="outlined" value={ticketDetails.position || 'N/A'} />
            </Grid>

            {/**Content Preview */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Content</Typography>
              <Box
                sx={{
                  padding: 2,
                  borderRadius: 2,
                  backgroundColor: '#F6F8FB',
                  minHeight: '200px',
                  overflowY: 'auto'
                }}
                dangerouslySetInnerHTML={{ __html: ticketDetails.content || '<p>No content available</p>' }}
              />
            </Grid>

            {/* Documents Attached */}
            {/* <Grid item xs={12}>
              <Typography variant="subtitle1">Documents Attached</Typography>
              {ticketDetails.doc && ticketDetails.doc.length > 0 ? (
                ticketDetails.doc.map((doc, index) => (
                  <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography>{doc.name}</Typography>
                    <Button onClick={() => togglePreviewDoc(doc)}>View</Button>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No documents attached.
                </Typography>
              )}
            </Grid> */}
          </Grid>

          <Box display="flex" sx={{ justifyContent: 'center', gap: '10rem', mt: 2 }}>
            <Button variant="contained" sx={{ mt: 3 }} onClick={onClose}>
              Mark as Resolved
            </Button>
            <Button variant="outlined" sx={{ mt: 3 }} onClick={navigateToChat}>
              Continue to Chat
            </Button>
          </Box>
        </Box>
      </Modal>

      {previewDoc && (
        <Modal open={Boolean(previewDoc)} onClose={() => togglePreviewDoc(null)}>
          <Box sx={previewStyle}>
            <Typography variant="body3" gutterBottom>
              {previewDoc.name || 'Content Name not available'}
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box>
              <Typography variant="body2">{previewDoc.doc || 'Opps! No content is avaible'}</Typography>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
}
TicketModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ticketDetails: PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string,
    assigned: PropTypes.string,
    status: PropTypes.string,
    position: PropTypes.string
  }).isRequired
};
