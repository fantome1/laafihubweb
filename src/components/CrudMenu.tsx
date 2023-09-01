import React from "react";
import { ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";

type Props = {
    actions: { icon: string, label: string, action: string, color?: string }[];
    position: { top: number, left: number }|null;
    disabled?: boolean;
    onSelected: (action: string) => void;
    onClose: () => void;
}

// function equals(prevProps: Props, nextProps: Props) {
//     if (prevProps.actions.length != nextProps.actions.length)
//         return false;

//     const a1 = prevProps.actions;
//     const a2 = nextProps.actions;

//     for (let i=0; i<a1.length; ++i) {
//         if (a1[i].action !=  a2[i].action) // FIXME add icon
//             return false;
//     }

//     return true;
// }

function CrudMenu(props: Props) {
    return (
        <Menu
            open={props.position != null}
            onClose={props.onClose}
            anchorReference="anchorPosition"
            anchorPosition={props.position ? { top: props.position.top, left: props.position.left } : undefined}
        >
            {props.actions.map(e => (
                <MenuItem key={e.action} onClick={() => props.onSelected(e.action)} disabled={props.disabled}>
                    <ListItemIcon><span className={`material-symbols-rounded ${e.color ?? ''}`}>{e.icon}</span></ListItemIcon>
                    <Typography className={e.color}>{e.label}</Typography>
                </MenuItem>
            ))}
        </Menu>
    );
}

export default React.memo(CrudMenu);