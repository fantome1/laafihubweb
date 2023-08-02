import { ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";

type Props = {
    position: { top: number, left: number }|null;
    onSelected: (value: 'view'|'update'|'delete') => void;
    onClose: () => void;
    hideView?: boolean;
}

function CrudMenu(props: Props) {
    return (
        <Menu
            open={props.position != null}
            onClose={props.onClose}
            anchorReference="anchorPosition"
            anchorPosition={props.position ? { top: props.position.top, left: props.position.left } : undefined}
        >
            {!props.hideView && (<MenuItem onClick={() => props.onSelected('view')}>
                <ListItemIcon><span className="material-symbols-rounded">edit</span></ListItemIcon>
                <Typography>Voir</Typography>
            </MenuItem>)}
            <MenuItem onClick={() => props.onSelected('update')}>
                <ListItemIcon><span className="material-symbols-rounded">visibility</span></ListItemIcon>
                <Typography>Modifier</Typography>
            </MenuItem>
            <MenuItem onClick={() => props.onSelected('delete')}>
                <ListItemIcon><span className="material-symbols-rounded text-red-500">delete</span></ListItemIcon>
                <Typography className="text-red-500">Supprimer de l'infrastructure</Typography>
            </MenuItem>
        </Menu>
    );
}

export { CrudMenu };