import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';

const rows = [
  { id: '1', agent: 'Ethan Noah', date: '10 March, 2023', alertType: 'success', activity: '00 000 00000', infrastructure: 'abc@abc.com', deviceOrTag: '132, My Street, Kingston, New York 12401' },
  { id: '2', agent: 'Ethan Noah', date: '10 March, 2023', alertType: 'failled', activity: '00 000 00000', infrastructure: 'abc@abc.com', deviceOrTag: '132, My Street, Kingston, New York 12401' },
  { id: '3', agent: 'Ethan Noah', date: '10 March, 2023', alertType: 'inProgress', activity: '00 000 00000', infrastructure: 'abc@abc.com', deviceOrTag: '132, My Street, Kingston, New York 12401' },
  { id: '4', agent: 'Ethan Noah', date: '10 March, 2023', alertType: 'success', activity: '00 000 00000', infrastructure: 'abc@abc.com', deviceOrTag: '132, My Street, Kingston, New York 12401' },
  { id: '5', agent: 'Ethan Noah', date: '10 March, 2023', alertType: 'success', activity: '00 000 00000', infrastructure: 'abc@abc.com', deviceOrTag: '132, My Street, Kingston, New York 12401' },
  { id: '6', agent: 'Ethan Noah', date: '10 March, 2023', alertType: 'failled', activity: '00 000 00000', infrastructure: 'abc@abc.com', deviceOrTag: '132, My Street, Kingston, New York 12401' },
  { id: '7', agent: 'Ethan Noah', date: '10 March, 2023', alertType: 'success', activity: '00 000 00000', infrastructure: 'abc@abc.com', deviceOrTag: '132, My Street, Kingston, New York 12401' },
  { id: '8', agent: 'Ethan Noah', date: '10 March, 2023', alertType: 'inProgress', activity: '00 000 00000', infrastructure: 'abc@abc.com', deviceOrTag: '132, My Street, Kingston, New York 12401' },
  { id: '9', agent: 'Ethan Noah', date: '10 March, 2023', alertType: 'inProgress', activity: '00 000 00000', infrastructure: 'abc@abc.com', deviceOrTag: '132, My Street, Kingston, New York 12401' },
  { id: '10', agent: 'Ethan Noah', date: '10 March, 2023', alertType: 'success', activity: '00 000 00000', infrastructure: 'abc@abc.com', deviceOrTag: '132, My Street, Kingston, New York 12401' },
  { id: '11', agent: 'Ethan Noah', date: '10 March, 2023', alertType: 'success', activity: '00 000 00000', infrastructure: 'abc@abc.com', deviceOrTag: '132, My Street, Kingston, New York 12401' }
];

interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
  isFirstVariant: boolean;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, numSelected, rowCount } =props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {['Agent', 'Date', 'Alert Type', 'Activity', 'Infrastructure', props.isFirstVariant ? 'Device / Tag' : 'Address', 'Action'].map((value, index) => (
          <TableCell
            key={value}
            padding={index == 0 ? 'none' : 'normal'}
          >
            {value}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;

  if (!(numSelected > 0))
    return (<></>);

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
    </Toolbar>
  );
}

function NotificationsTable({ firstVariant }: { firstVariant: boolean }) {
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map(n => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size='medium'
          >
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={rows.length}
              isFirstVariant={firstVariant}
            />
            <TableBody>
              {rows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.agent}
                    </TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{getAlertTypeComponent(row.alertType)}</TableCell>
                    <TableCell>{row.activity}</TableCell>
                    <TableCell>{row.infrastructure}</TableCell>
                    <TableCell>{row.deviceOrTag}</TableCell>
                    <TableCell>
                        <span className='mr-4'>{firstVariant ? getActionFirstIcon(index) : getActionFirstIcon(1)}</span>
                        <span className="material-symbols-outlined text-[#FF4B4B]">delete</span>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}


function getAlertTypeComponent(alertType: string) {

    let color;
    let backgroundColor;
    let label;

    switch(alertType) {
        case 'success':
            color = '#00B448'
            backgroundColor = '#F2FFF7';
            label = 'Success';
            break;
        case 'failled':
            color = '#FF4747';
            backgroundColor = '#FFF0F0';
            label = 'Failled';
            break;
        case 'inProgress':
            color = '#ED9B22';
            backgroundColor = '#FFF6E8';
            label = 'In Progess';
            break;
    }

    return (
        <div className='flex justify-center items-center h-[26px] font-medium rounded-[5px]' style={{ backgroundColor, border: `1px solid ${color}`, color: color }}>{label}</div>
    );
}


function getActionFirstIcon(index: number) {
    switch((index + 1) % 3) {
        case 0:
            return <span className="material-symbols-outlined text-[#4E7FFF] cursor-pointer">my_location</span>
        case 1:
            return <span className="material-symbols-outlined text-[#4E7FFF] cursor-pointer">location_disabled</span>
        case 2:
            return <span className="material-symbols-outlined text-[#4E7FFF] cursor-pointer">border_color</span>
    }
}

export { NotificationsTable };