import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
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
      onClose={() => props.completer?.complete(false)}
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