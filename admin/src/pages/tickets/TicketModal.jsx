import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Box, Typography, Button, Divider, Grid, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TransferTicket from './TransferTicket';
import useAuthStore from 'store/useAuthStore';

const modalStyles = {
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

const previewStyles = {
  ...modalStyles,
  maxHeight: '90vh',
  overflowY: 'auto'
};

export default function TicketModal({ open, onClose, ticketDetails }) {
  const [previewDoc, setPreviewDoc] = useState(null);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const navigate = useNavigate();

  // const user = useAuthStore((state) => state.userName);
  // const userName = user?.full_name || 'Unknown User';
  const userName = useAuthStore((state) => state.userName || 'Unknown User');
  const handleContinueToChat = () => {
    const ticketId = ticketDetails?.ticket_id || ticketDetails?.id;
    if (ticketId) {
      onClose();
      navigate(`/chat/${ticketId}`);
    } else {
      alert('Error: Ticket ID is missing.');
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={modalStyles}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">Ticket Details</Typography>
            <Button variant="outlined" onClick={() => setTransferModalOpen(true)}>
              Transfer Ticket
            </Button>
          </Box>

          <TransferTicket open={transferModalOpen} onClose={() => setTransferModalOpen(false)} ticketId={ticketDetails?.ticket_id} />

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth label="Ticket ID" value={ticketDetails?.ticket_id || 'N/A'} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Requester Name" value={ticketDetails?.issuer_full_name || ticketDetails?.name || 'N/A'} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Ticket Title" value={ticketDetails?.ticket_title || ticketDetails?.title || 'N/A'} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Assigned To" value={ticketDetails?.assigned || 'Unassigned'} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Ticket Status" value={ticketDetails?.ticket_status || ticketDetails?.status || 'N/A'} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Location" value={ticketDetails?.issuer_location || ticketDetails?.location || 'N/A'} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Content
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#F6F8FB',
                  minHeight: 200,
                  overflowY: 'auto'
                }}
                dangerouslySetInnerHTML={{
                  __html: ticketDetails?.ticket_description || ticketDetails?.content || '<p>No content available</p>'
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Documents Attached</Typography>
              {ticketDetails?.doc?.length > 0 ? (
                ticketDetails.doc.map((doc, index) => (
                  <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography>{doc.name}</Typography>
                    <Button onClick={() => setPreviewDoc(doc)}>View</Button>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No documents attached.
                </Typography>
              )}
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="center" gap={8} mt={3}>
            <Button variant="contained" onClick={onClose}>
              Mark as Resolved
            </Button>
            <Button variant="outlined" onClick={handleContinueToChat}>
              Continue to Chat
            </Button>
          </Box>
        </Box>
      </Modal>

      {previewDoc && (
        <Modal open={Boolean(previewDoc)} onClose={() => setPreviewDoc(null)}>
          <Box sx={previewStyles}>
            <Typography variant="h6">{previewDoc.name || 'Document'}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2">{previewDoc.doc || 'No content available'}</Typography>
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
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ticket_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    issuer_full_name: PropTypes.string,
    name: PropTypes.string,
    ticket_title: PropTypes.string,
    title: PropTypes.string,
    ticket_module: PropTypes.string,
    assigned: PropTypes.string,

    ticket_status: PropTypes.string,
    status: PropTypes.string,
    issuer_location: PropTypes.string,
    location: PropTypes.string,
    ticket_description: PropTypes.string,
    content: PropTypes.string,
    doc: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        doc: PropTypes.string
      })
    )
  }).isRequired
};
