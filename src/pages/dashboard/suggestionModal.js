import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
} from '@mui/material';

const SuggestionModal = ({ isOpen, handleClose, suggestion }) => {
  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h6" style={{ textAlign: 'center' }}>
          Your Suggestion
        </Typography>
      </DialogTitle>
      <DialogContent style={{ textAlign: 'center' }}>
        <Typography variant="body1" style={{fontSize: '30px'}}>{suggestion}</Typography>
        <Button onClick={handleClose} color="primary" variant="contained" style={{ marginTop: '50px' }}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestionModal;
