import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Completer } from '../../services/completer';

type Props = {
  completer: Completer<boolean>|null;
  title: string;
  description: string;
};

function ConfirmSuppressionDialog(props: Props) {
  return (
    <Dialog
      open={Boolean(props.completer)}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent><DialogContentText></DialogContentText>{props.description}</DialogContent>
      <DialogActions>
        <Button onClick={() => props.completer?.complete(false)}>Annuler</Button>
        <Button onClick={() => props.completer?.complete(true)}>Supprimer</Button>
      </DialogActions>
    </Dialog>
  );
}

export { ConfirmSuppressionDialog };