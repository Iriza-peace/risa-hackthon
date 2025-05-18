import { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  FormControl,
  TextField,
  Typography,
  Autocomplete,
  Modal
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40rem',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

const departments = [
  { id: 1, name: 'MINEMA' },
  { id: 2, name: 'RISA' },
  { id: 3, name: 'RIB' }
];

const TransferTicket = ({ open, onClose, ticketId }) => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [transferNote, setTransferNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const transferData = {
      ticketId,
      transferType: 'department',
      destination: selectedDepartment,
      note: transferNote
    };

    console.log('Transfer Data:', transferData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5" gutterBottom>
          Transfer Ticket
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Transfer to Department:
            </Typography>
            <Autocomplete
              options={departments}
              getOptionLabel={(option) => option.name}
              value={selectedDepartment}
              onChange={(_, newValue) => setSelectedDepartment(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Select Department" variant="outlined" required />
              )}
            />
          </FormControl>

          <TextField
            fullWidth
            label="Transfer Note"
            multiline
            rows={4}
            value={transferNote}
            onChange={(e) => setTransferNote(e.target.value)}
            placeholder="Add a note about why you're transferring this ticket..."
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Transfer Ticket
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default TransferTicket;
