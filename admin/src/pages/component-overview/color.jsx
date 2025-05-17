import PropTypes from 'prop-types';
// material-ui
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';
import ComponentWrapper from './ComponentWrapper';
import ComponentSkeleton from './ComponentSkeleton';

function ColorBox({ bgcolor, title, data, dark, main }) {
  return (
    <Card sx={{ '&.MuiPaper-root': { borderRadius: '0px' } }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 2.5,
          bgcolor,
          color: dark ? 'grey.800' : '#ffffff',
          border: main ? '1px dashed' : '1px solid transparent'
        }}
      >
        {title && (
          <Grid container justifyContent="space-around" alignItems="center">
            <Grid item>
              {data && (
                <Stack spacing={0.75} alignItems="center">
                  <Typography variant="subtitle2">{data.label}</Typography>
                  <Typography variant="subtitle1">{data.color}</Typography>
                </Stack>
              )}
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" color="inherit">
                {title}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Box>
    </Card>
  );
}

// ===============================|| COMPONENT - COLOR ||=============================== //

export default function ComponentColor() {
  return (
    <ComponentSkeleton>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <MainCard title="Primary Color">
            <Stack>
              <ColorBox bgcolor="primary.lighter" data={{ label: 'Orange-1', color: '#fff3e6' }} title="primary.lighter" dark />
              <ColorBox bgcolor="primary.100" data={{ label: 'Orange-2', color: '#ffe0bf' }} title="primary[100]" dark />
              <ColorBox bgcolor="primary.200" data={{ label: 'Orange-3', color: '#ffc799' }} title="primary[200]" dark />
              <ColorBox bgcolor="primary.light" data={{ label: 'Orange-4', color: '#ffae66' }} title="primary.light" dark />
              <ColorBox bgcolor="primary.400" data={{ label: 'Orange-5', color: '#ff9440' }} title="primary[400]" />
              <ColorBox bgcolor="primary.main" data={{ label: 'Orange-6', color: '#ff7a00' }} title="primary.main" main />
              <ColorBox bgcolor="primary.dark" data={{ label: 'Orange-7', color: '#e66900' }} title="primary.dark" />
              <ColorBox bgcolor="primary.700" data={{ label: 'Orange-8', color: '#b35400' }} title="primary[700]" />
              <ColorBox bgcolor="primary.darker" data={{ label: 'Orange-9', color: '#803f00' }} title="primary.darker" />
              <ColorBox bgcolor="primary.900" data={{ label: 'Orange-10', color: '#4d2900' }} title="primary.900" />
            </Stack>
          </MainCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MainCard title="Secondary Color">
            <Stack>
              <ColorBox bgcolor="secondary.lighter" data={{ label: 'Grey-1', color: '#fafafa' }} title="secondary.lighter" dark />
              <ColorBox bgcolor="secondary.100" data={{ label: 'Grey-2', color: '#f5f5f5' }} title="secondary[100]" dark />
              <ColorBox bgcolor="secondary.200" data={{ label: 'Grey-3', color: '#f0f0f0' }} title="secondary[200]" dark />
              <ColorBox bgcolor="secondary.light" data={{ label: 'Grey-4', color: '#d9d9d9' }} title="secondary.light" dark />
              <ColorBox bgcolor="secondary.400" data={{ label: 'Grey-5', color: '#bfbfbf' }} title="secondary[400]" dark />
              <ColorBox bgcolor="secondary.main" data={{ label: 'Grey-6', color: '#8c8c8c' }} title="secondary.main" main />
              <ColorBox bgcolor="secondary.600" data={{ label: 'Grey-7', color: '#595959' }} title="secondary.600" />
              <ColorBox bgcolor="secondary.dark" data={{ label: 'Grey-8', color: '#262626' }} title="secondary.dark" />
              <ColorBox bgcolor="secondary.800" data={{ label: 'Grey-9', color: '#141414' }} title="secondary[800]" />
              <ColorBox bgcolor="secondary.darker" data={{ label: 'Grey-10', color: '#000000' }} title="secondary.darker" />
            </Stack>
          </MainCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MainCard title="Other Color">
            <Stack>
              <ColorBox bgcolor="secondary.A100" data={{ label: 'Grey-A1', color: '#ffffff' }} title="secondary.A100" dark />
              <ColorBox bgcolor="secondary.A200" data={{ label: 'Grey-A2', color: '#434343' }} title="secondary.A200" />
              <ColorBox bgcolor="secondary.A300" data={{ label: 'Grey-A3', color: '#1f1f1f' }} title="secondary.A300" />
            </Stack>
          </MainCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MainCard title="Success Color">
            <Stack>
              <ColorBox bgcolor="success.lighter" data={{ label: 'Green-1', color: '#f6ffed' }} title="success.lighter" dark />
              <ColorBox bgcolor="success.light" data={{ label: 'Green-4', color: '#95de64' }} title="success.light" dark />
              <ColorBox bgcolor="success.main" data={{ label: 'Green-6', color: '#52c41a' }} title="success.main" main />
              <ColorBox bgcolor="success.dark" data={{ label: 'Green-8', color: '#237804' }} title="success.dark" />
              <ColorBox bgcolor="success.darker" data={{ label: 'Green-10', color: '#092b00' }} title="success.darker" />
            </Stack>
          </MainCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MainCard title="Error Color">
            <Stack>
              <ColorBox bgcolor="error.lighter" data={{ label: 'Red-1', color: '#fff1f0' }} title="error.lighter" dark />
              <ColorBox bgcolor="error.light" data={{ label: 'Red-4', color: '#ff7875' }} title="error.light" dark />
              <ColorBox bgcolor="error.main" data={{ label: 'Red-6', color: '#f5222d' }} title="error.main" main />
              <ColorBox bgcolor="error.dark" data={{ label: 'Red-8', color: '#a8071a' }} title="error.dark" />
              <ColorBox bgcolor="error.darker" data={{ label: 'Red-10', color: '#5c0011' }} title="error.darker" />
            </Stack>
          </MainCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MainCard title="Warning Color">
            <Stack>
              <ColorBox bgcolor="warning.lighter" data={{ label: 'Gold-1', color: '#fffbe6' }} title="warning.lighter" dark />
              <ColorBox bgcolor="warning.light" data={{ label: 'Gold-4', color: '#ffd666' }} title="warning.light" dark />
              <ColorBox bgcolor="warning.main" data={{ label: 'Gold-6', color: '#faad14' }} title="warning.main" main />
              <ColorBox bgcolor="warning.dark" data={{ label: 'Gold-8', color: '#ad6800' }} title="warning.dark" />
              <ColorBox bgcolor="warning.darker" data={{ label: 'Gold-10', color: '#613400' }} title="warning.darker" />
            </Stack>
          </MainCard>
        </Grid>
      </Grid>
    </ComponentSkeleton>
  );
}

ColorBox.propTypes = {
  bgcolor: PropTypes.string,
  title: PropTypes.string,
  data: PropTypes.object,
  dark: PropTypes.bool,
  main: PropTypes.bool
};
