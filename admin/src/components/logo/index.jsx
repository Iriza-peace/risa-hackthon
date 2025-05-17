import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase, Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';


//project import
// import Logo from '../../assets/images/logo/logo.png';
import config from 'config';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ sx, to }) => {
  return (
    <ButtonBase disableRipple component={Link} to={!to ? config.defaultPath : to} sx={sx}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Box 
                      component="span" 
                      sx={{ 
                        bgcolor: 'primary.main', 
                        color: 'white', 
                        // borderRadius: '4px', 
                        px: 1, 
                        m:3,
                        
                      }}
                    >
                      NSOBANURIRA
                    </Box>
      </Stack>
    </ButtonBase>
  );
};

LogoSection.propTypes = {
  sx: PropTypes.object,
  to: PropTypes.string
};

export default LogoSection;
