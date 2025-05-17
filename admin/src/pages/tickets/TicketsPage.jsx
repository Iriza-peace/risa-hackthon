import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import PropTypes from 'prop-types';
// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

// project import
import Dot from 'components/@extended/Dot';

import TicketModal from './TicketModal';

import useTicketStore from 'store/useTicketStore.js';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
function OrderTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} padding={headCell.disablePadding ? 'none' : 'normal'}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function OrderStatus({ status }) {
  let color;
  let title;

  switch (status) {
    case 'In Progress':
      color = 'warning';
      title = 'In Progress';
      break;
    case 'Completed':
      color = 'success';
      title = 'Completed';
      break;
    case 'Received':
      color = 'error';
      title = 'Received';
      break;
    default:
      color = 'primary';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

// ==============================|| ORDER TABLE ||============================== //

export default function TicketsTable() {
  const setTickets = useTicketStore((state) => state.setTickets);
  const tickets = useTicketStore((state) => state.tickets);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const navigateToChat = () => {
    navigate('/chats', { state: { id: 1121214 } });
  };

  function handleViewClick(ticketDetails) {
    setSelectedTicket(ticketDetails);
    setModalOpen((prevState) => !prevState);
    console.log('Ticket Details:', ticketDetails);
    console.log('Modal Open:', modalOpen);
  }

  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/tickets`);
        if (!response.ok) {
          throw new Error('Failed to fetch tickets');
        }

        const responseData = await response.json();

        const transformedTickets = responseData.map((ticket) => ({
          national_id: ticket.issuer_id_number,
          name: ticket.issuer_full_name,
          title: ticket.ticket_title,
          position: ticket.issuer_job_position,
          assigned: ticket.agent_id ? `Agent ${ticket.agent_id}` : 'Unassigned',
          status: ticket.ticket_status,
          content: ticket.ticket_description,
          doc: [] // Assuming no documents from the backend for now
        }));

        setTickets(transformedTickets);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAllTickets();
  }, []);

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title="Total Tickets" count={tickets.length} />
        </Grid>
      </Grid>
      <Box>
        <TableContainer
          sx={{
            width: '100%',
            overflowX: 'auto',
            position: 'relative',
            display: 'block',
            maxWidth: '100%',
            '& td, & th': { whiteSpace: 'nowrap' }
          }}
        >
          <Table aria-labelledby="tableTitle">
            <OrderTableHead />
            <TableBody>
              {tickets.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell component="th" id={labelId} scope="row">
                      <Link color="secondary">{row.national_id}</Link>
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.position}</TableCell>
                    <TableCell>{row.assigned}</TableCell>
                    <TableCell>
                      <OrderStatus status={row.status} />
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" size="small" color="primary" onClick={() => handleViewClick(row)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {modalOpen && (
          <TicketModal
            navigateToChat={navigateToChat}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            ticketDetails={selectedTicket}
          />
        )}
      </Box>
    </>
  );
}

const headCells = [
  {
    id: 'national_id',
    align: 'left',
    disablePadding: false,
    label: 'National ID'
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: 'Names'
  },
  {
    id: 'title',
    align: 'left',
    disablePadding: false,
    label: 'Title'
  },
  {
    id: 'position',
    align: 'left',
    disablePadding: false,
    label: 'Position'
  },
  {
    id: 'assigned',
    align: 'left',
    disablePadding: false,
    label: 'Assigned to'
  },
  {
    id: 'status',
    align: 'left',
    disablePadding: false,
    label: 'Document Status'
  },
  {
    id: 'action',
    align: 'left',
    disablePadding: false,
    label: 'Action'
  }
];

OrderTableHead.propTypes = {};
OrderStatus.propTypes = { status: PropTypes.string };
TicketsTable.propTypes = {
  tickets: PropTypes.arrayOf(
    PropTypes.shape({
      national_id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      position: PropTypes.string.isRequired,
      assigned: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    })
  )
};
