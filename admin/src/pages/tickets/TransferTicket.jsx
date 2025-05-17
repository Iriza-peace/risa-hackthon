import { useState } from 'react';
import { Box, Button, Divider, FormControl, FormControlLabel, Modal, Radio, RadioGroup, TextField, Typography, Autocomplete } from '@mui/material';

// Add the missing style object
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
  { id: 1, name: 'IT Support' },
  { id: 2, name: 'Developers' },
  { id: 3, name: 'Customer Support' }
];

const people = [
  { id: 1, name: 'Patrick Nyiringabo', department: 'IT Support' },
  { id: 2, name: 'Damour Smith', department: 'Developers' },
  { id: 3, name: 'John Smith', department: 'Customer Support' }
];

const TransferTicket = ({open, onClose, ticketId}) => {
    const [transferType, setTransferType] = useState('department');
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [transferNote, setTransferNote] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); 
        
        const transferData = {
            ticketId,
            transferType,
            destination: transferType === 'department' ? selectedDepartment : selectedPerson,
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
                    <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Transfer to:
                        </Typography>
                        <RadioGroup
                            row
                            value={transferType}
                            onChange={(e) => {
                                setTransferType(e.target.value)
                                setSelectedDepartment(null)
                                setSelectedPerson(null)
                            }}
                        >
                            <FormControlLabel value="department" control={<Radio />} label="Department" />
                            <FormControlLabel value="person" control={<Radio />} label="Person" />
                        </RadioGroup>
                    </FormControl>

                    {transferType === 'department' ? (
                        <Autocomplete
                            options={departments}
                            getOptionLabel={(option) => option.name}
                            value={selectedDepartment}
                            onChange={(_, newValue) => setSelectedDepartment(newValue)}
                            renderInput={(params) => (
                                <TextField {...params} label="Select Department" variant="outlined" required />
                            )}
                            sx={{ mb: 3 }}
                        />
                    ) : (
                        <Autocomplete
                            options={people}
                            getOptionLabel={(option) => `${option.name} (${option.department})`}
                            value={selectedPerson}
                            onChange={(_, newValue) => setSelectedPerson(newValue)}
                            renderInput={(params) => (
                                <TextField {...params} label="Select Person" variant="outlined" required />
                            )}
                            sx={{ mb: 3 }}
                        />
                    )}

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