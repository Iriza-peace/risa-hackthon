import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';

const agentsData = [
  {
    name: 'Grocery Store',
    status: 'online',
    avatar: avatar1,
    chats: 224,
    tickets: 224
  },
  {
    name: 'Grocery Store',
    status: 'online',
    avatar: avatar2,
    chats: 456,
    tickets: 456
  },
  {
    name: 'Fulgence Ndahiro',
    status: 'online',
    avatar: avatar3,
    chats: 189,
    tickets: 189
  },
  {
    name: 'Grocery Store',
    status: 'offline',
    avatar: avatar4,
    chats: 190,
    tickets: 190
  }
];

export default function SupportTeam() {
  return (
    <Grid container spacing={2} sx={{ backgroundColor: 'white', p: 2, borderRadius: 2 }}>
      <Grid item xs={12}>
        <Typography variant="h5">Support Team</Typography>
      </Grid>

      {/* Header Row with Team, Chats Resolved, Tickets Resolved */}
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={4}>
            <Typography sx={{ paddingLeft: '22px' }} variant="subtitle1" fontWeight="bold">
              Team
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1" fontWeight="bold">
              Chats Resolved
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1" fontWeight="bold">
              Tickets Resolved
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <List>
          {agentsData.map((agent, index) => (
            <ListItem
              key={index}
              divider
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'white'
              }}
            >
              {/* Agent Info */}
              <Grid container spacing={2} sx={{ width: '100%' }}>
                <Grid item xs={4}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar alt={agent.name} src={agent.avatar} />
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="bold">
                          {agent.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color={agent.status === 'online' ? 'success.main' : 'text.secondary'}>
                          {agent.status}
                        </Typography>
                      }
                    />
                  </Stack>
                </Grid>

                {/* Chats Resolved */}
                <Grid item xs={4}>
                  <Typography variant="subtitle2">
                    <strong>Chats:</strong> {agent.chats}
                  </Typography>
                </Grid>

                {/* Tickets Resolved */}
                <Grid item xs={4}>
                  <Typography variant="subtitle2" sx={{paddingLeft: "6px"}}>
                    <strong>Tickets:</strong> {agent.tickets}
                  </Typography>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}
