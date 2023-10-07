import React from 'react';
import { alpha, Box, Table, TableHead, TableBody, TableCell, TableContainer, TablePagination, TableRow, Toolbar, Typography, Paper, Checkbox, IconButton, Tooltip, Skeleton, Button  } from '@mui/material';
import { Link } from 'react-router-dom';
import { routes } from '../constants/routes';
import { Utils } from '../services/utils';
import { INotification } from '../models/notification_model';
import { DialogService } from './dialogs/DialogsComponent';
import { PaginationBloc, PaginationBlocData, PaginationBlocEventType } from '../bloc/pagination_bloc';
import { Api } from '../services/api';

type NotificationsTableProps = {
  bloc: PaginationBloc<INotification, void>;
  onDeleted: () => void;
}

type NotificationsTableState = {
  selected: string[];
  data: PaginationBlocData<INotification>;
}

class NotificationsTable extends React.Component<NotificationsTableProps, NotificationsTableState> {

  constructor(props: NotificationsTableProps) {
    super(props);

    this.state = {
      selected: [],
      data: new PaginationBlocData(PaginationBlocEventType.loading)
    };

    this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.listen = this.listen.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onMarkAsImportant = this.onMarkAsImportant.bind(this);
  }

  componentDidMount(): void {
    this.props.bloc.listen(this.listen);
  }

  listen(data: PaginationBlocData<INotification>) {
    this.setState({ data });
  }

  handleSelectAllClick(event: React.ChangeEvent<HTMLInputElement>) {
    if (!this.state.data.hasData)
      return;

    if (event.target.checked) {
      const newSelected = this.state.data.data!.items.map(n => n.id);
      this.setState({ selected: newSelected });
      return;
    }

    this.setState({ selected: [] });
  };

  handleClick(event: React.MouseEvent<unknown>, id: string) {
    event.stopPropagation();
    const selected = this.state.selected;
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

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

    this.setState({ selected: newSelected });
  };

  handleChangePage(event: unknown, newPage: number) {
    // bloc
    // console.log(newPage);
    this.props.bloc.changePage(newPage);
  };

  onTap(value: INotification) {
    DialogService.showNotificationDetails(value, this.onMarkAsImportant);
  }

  /**
   * Mark as important / Mark as unimportant
   * @param event 
   * @param id 
   */
  async onMarkAsImportant(event: React.MouseEvent<unknown>, ids: string[]) {
    if (!this.state.data.hasData)
      return;

    event.stopPropagation();

    const items = this.state.data.data!.items!;

    const map = Object.fromEntries(ids
      .map(id => items.find(e => e.id == id))
      .filter(e => e)
      .map(e => [e!.id, !e!.isImportant])
    );

    DialogService.showLoadingDialog();

    try {
      await Api.markAsImportant(Object.entries(map).map(v => ({ id: v[0], isImportant: v[1] })));

      Object.entries(map).forEach(item => {
        items.find(e => e.id == item[0])!.isImportant = item[1];
      });

      // @ts-ignore
      this.setState({ data: new PaginationBlocData(PaginationBlocEventType.data, { ...this.state.data!.data }) });
      DialogService.closeLoadingDialog()
    } catch (error) {
      DialogService.closeLoadingDialog()
      DialogService.showSnackbar({ severity: 'error', message: 'Une erreur s\'est produite' });
      throw error;
    }
  }

  async onDelete(event: React.MouseEvent<unknown>, ids: string[]) {
    event.stopPropagation();

    const result = await DialogService.showDeleteConfirmation(
      'Cette action est irréversible',
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore officiis ipsam incidunt ratione nam'
    );

    if (!result)
      return;
    
    DialogService.showLoadingDialog()
    const one = ids.length == 1;

    Api.deleteNotification(ids)
      .then(() => {
        DialogService.closeLoadingDialog()
        this.props.bloc.reload();

        if (this.state.selected.length > 0)
          this.setState({ selected: [] });

        DialogService.showSnackbar({ severity: 'success', message: `Notification${one ? '' : 's'} supprimée${one ? '' : 's'} avec succès` });
        this.props.onDeleted();
      }).catch(err => {
        DialogService.closeLoadingDialog();

        if (this.state.selected.length > 0)
          this.setState({ selected: [] });

        DialogService.showSnackbar({ severity: 'error', message: `Une erreur s\'est produite lors de la suppression ${one ? 'de la' : 'des'} notification${one ? '' : 's'}` });
      });
  }

  render() {

    const { selected, data } = this.state;

    // Avoid a layout jump when reaching the last page with empty rows.
    const rowCount = data.data?.items.length ?? 0;
    // const emptyRows = data.hasData && this.props.bloc.page > 0 ? Math.max(0, (1 + this.props.bloc.page) * this.props.bloc.count - rowCount) : 0;

    return (
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar selected={selected} onDelete={this.onDelete} onMarkAsImportant={this.onMarkAsImportant} />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size='medium'
            >
              <EnhancedTableHead
                numSelected={selected.length}
                onSelectAllClick={this.handleSelectAllClick}
                rowCount={rowCount}
              />
              <TableBody>
                {this.content()}
                {/* {emptyRows > 0 && (
                  <TableRow
                    style={{ height: 53 * emptyRows }}
                  >
                    <TableCell colSpan={8} />
                  </TableRow>
                )} */}
              </TableBody>
            </Table>
          </TableContainer>
          {data.hasData && (
            <TablePagination
              component="div"
              rowsPerPageOptions={[this.props.bloc.count]}
              count={data.data!.totalCount}
              rowsPerPage={this.props.bloc.count}
              page={data.data!.page}
              onPageChange={this.handleChangePage}
              // onRowsPerPageChange={this.handleChangeRowsPerPage}
            />
          )}
        </Paper>
      </Box>
    );
  }

  content() {
    switch(this.state.data.type) {
      case PaginationBlocEventType.data:
        return this.state.data.data!.items.map((row, index) => {
          const isSelected = this.state.selected.indexOf(row.id) !== -1;
          const labelId = `enhanced-table-checkbox-${index}`;
          return (
            <TableRow
              hover
              onClick={() => this.onTap(row)}
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={-1}
              key={row.id}
              selected={isSelected}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  onClick={(event) => this.handleClick(event, row.id)}
                  color="primary"
                  checked={isSelected}
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </TableCell>
              <TableCell
                // component="th"
                // id={labelId}
                // scope="row"
                padding="none"
              >
                <NotificationAlertTypeComponent alertType={row.type} withIcon />
              </TableCell>
              <TableCell>{Utils.formatDate(new Date(row.triggerAt))}</TableCell>
              <TableCell>{row.userName}</TableCell>
              <TableCell><Tooltip title='View activity'><Link to={routes.ANOTHER_LAAFI_MONITOR_DEVICE_DATA.build(row.activityId)} style={{ color: '#2196F3 ' }}>{row.activityName}</Link></Tooltip></TableCell>
              <TableCell>{row.infrastructureId}</TableCell>
              <TableCell>{row.deviceId}</TableCell>
              <TableCell>
                <div className='flex space-x-2'>
                  <Tooltip title='View map'><span className="material-symbols-outlined text-[#4E7FFF] cursor-pointer">map</span></Tooltip>
                  <Tooltip title='Delete'><span onClick={event => this.onDelete(event, [row.id])} className="material-symbols-outlined text-[#FF4B4B]">delete</span></Tooltip>
                  <Tooltip title={row.isImportant ? 'Mark as unimportant' : 'Mark as important'}><span onClick={event => this.onMarkAsImportant(event, [row.id])} className="material-symbols-rounded" style={{ color: row.isImportant ? '#FDD835' : '#999999' }}>flag</span></Tooltip>
                </div>
              </TableCell>
            </TableRow>
          );
        });
      case PaginationBlocEventType.loading:
        return Array.from({ length: this.props.bloc.count }, (_, index) => {
          return (
            <TableRow key={index} style={{ height: 53 }}>
              <TableCell colSpan={8}><Skeleton className='text-xl' /></TableCell>
            </TableRow>
          )
        });
      case PaginationBlocEventType.error:
        return <TableRow style={{ height: 53 }}>
          <TableCell colSpan={8}>
            <div className='flex flex-col items-center space-y-2'>
              <span className="material-symbols-outlined text-[32px] text-[#D32F2F]">error</span>
              <p className='text-[#D32F2F]'>{Utils.isNetworkError(this.state.data!.error) ? 'Aucune connexion internet, Réessayer plus tard' : 'Une erreur s\'est produite' }</p>
              <Button onClick={() => this.props.bloc.reload()} startIcon={<span className="material-symbols-outlined text-[32px]">refresh</span>}>Réessayer</Button>
            </div>
          </TableCell>
        </TableRow>;
    }
  }

}

interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
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
        {['Alert type', 'Date', 'Agent', 'Activity', 'Infrastructure', 'Device / Tag' , 'Action'].map((value, index) => (
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
  selected: string[];
  onDelete: (e: any, ids: string[]) => void;
  onMarkAsImportant: (e: any, ids: string[]) => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {

  if (!(props.selected.length > 0))
    return (<></>);

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(props.selected.length > 0 && {
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
        {props.selected.length} selected
      </Typography>
      <Tooltip title="Delete">
        <span onClick={(e) => props.onDelete(e, props.selected)} className="material-symbols-rounded text-[#FF4B4B] cursor-pointer mr-2">delete</span>
      </Tooltip>
      <Tooltip title="Mark as important">
        <span onClick={(e) => props.onMarkAsImportant(e, props.selected)} className="material-symbols-rounded text-[#FDD835] cursor-pointer">flag</span>
      </Tooltip>
    </Toolbar>
  );
}

type NotificationAlertTypeComponentProps = {
  alertType: 'TemperatureMin'|'TemperatureMax'|'HumidityMin'|'HumidityMax'|'SunExposure'|'BatteryLevel'|'BluetoothLinkLost'|'UserDisconnected';
  withIcon?: boolean;
}

function NotificationAlertTypeComponent(props: NotificationAlertTypeComponentProps) {

  let color;
  let backgroundColor;
  let label;
  let icon;

  switch(props.alertType) {
    case 'TemperatureMin':
      color = '#FF4747';
      backgroundColor = '#FFF0F0';
      icon = 'thermostat';
      label = 'Temp Min';
    break;
    case 'TemperatureMax':
      color = '#FF4747';
      backgroundColor = '#FFF0F0';
      icon = 'thermostat';
      label = 'Temp Max';
    break;
    case 'HumidityMin':
      color = '#2196F3'
      backgroundColor = '#E3F2FD';
      icon = 'humidity_percentage';
      label = 'Hum Min';
    break;
    case 'HumidityMax':
      color = '#2196F3'
      backgroundColor = '#E3F2FD';
      icon = 'humidity_percentage';
      label = 'Hum Max';
    break;
    case 'SunExposure':
      color = '#ED9B22';
      backgroundColor = '#FFF6E8';
      icon = 'brightness_alert';
      label = 'Sun Expo';
    break;
    case 'BatteryLevel':
      color = '#673AB7';
      backgroundColor = '#EDE7F6';
      icon = 'battery_alert';
      label = 'Batt level';
    break;
    case 'UserDisconnected':
      color = '#9E9E9E';
      backgroundColor = '#FAFAFA';
      icon = 'signal_cellular_off';
      label = 'Disconnect';
    break;
    case 'BluetoothLinkLost':
      color = '#795548';
      backgroundColor = '#EFEBE9';
      icon = 'bluetooth_disabled';
      label = 'BT Link';
    break;
  }

  var card = (<div className='inline-flex justify-center items-center w-[80px] h-[24px] text-xs font-medium rounded-[5px]' style={{ backgroundColor, border: `1px solid ${color}`, color: color }}>{label}</div>);

  if (!props.withIcon)
    return card;

  return (
    <div className='inline-flex space-x-2'>
      {card}

      <span className="material-symbols-rounded" style={{ color }}>{icon}</span>
    </div>
  );
}

export { NotificationsTable, NotificationAlertTypeComponent };