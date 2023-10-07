import { Paper, Skeleton } from "@mui/material";
import React from "react";
import { BubleMap } from "../components/BubleMap";
import { EntityCountCard } from "../components/EntityCountCard";
import { NotificationsTable } from "../components/NotificationsTable";
import { PaginationBloc, PaginationBlocData, PaginationBlocEventType } from "../bloc/pagination_bloc";
import { INotification } from "../models/notification_model";
import { Api } from "../services/api";
import { PromiseBuilder } from "../components/PromiseBuilder";
import { INotificationStats, getNotificationCountFromStats } from "../models/notification_stats";
import { NotificationFilterComponent } from "../NotificationFilterComponent";
import { NearMap } from "../components/NearMap";
import { Marker } from "react-leaflet";

type Props = {

};

type State = {
    stats: Promise<INotificationStats>|null;
    data: PaginationBlocData<INotification>;
};

class NotificationsPage extends React.Component<Props, State> {

    private bloc: PaginationBloc<INotification, any> = new PaginationBloc(
        11,
        null,
        (count, page, params) => Api.getNotifications(count, page, params)
    );

    constructor(props: Props) {
        super(props);

        this.state = {
            stats: null,
            data: new PaginationBlocData(PaginationBlocEventType.loading)
        };

        this.onUpdate = this.onUpdate.bind(this);
        this.listen = this.listen.bind(this);
    }

    componentDidMount(): void {
        this.bloc.listen(this.listen);
        this.bloc.next();
        this.setState({ stats: Api.getNotificationStats() });
    }

    componentWillUnmount(): void {
       this.bloc.dispose(); 
    }

    listen(data: PaginationBlocData<INotification>) {
        this.setState({ data });
    }

    onUpdate() {
        this.setState({ stats: Api.getNotificationStats() });
    }

    render() {
        return (
            <div className="bg-[#E5E5E5] px-8 py-2 h-[1440px]">

                {/* First row */}
                <div className="flex space-x-4 mt-12">
                    {/* Notifications, Alert */}
                    <div className="flex flex-col space-y-2" style={{ flex: '1 1 0' }}>

                        <div className="h-[120px] grow flex flex-col justify-between bg-white px-4 rounded-md">
                            <div className="relative">
                                <Paper elevation={2} sx={{ backgroundColor: 'var(--primary)' }} className="absolute top-[-24px] flex justify-center items-center w-[80px] h-[80px]">
                                    <span className="material-symbols-rounded text-3xl text-white">notifications</span>
                                </Paper>

                                <div className="flex items-center h-[56px]">
                                    <div className="flex items-center h-full">
                                        <div className="w-[80px] mr-4"></div> {/* ml marge de l'icone a gauche, 68px (largeur) taille de l'icone */}
                                        <div className="flex flex-col justify-around h-full">
                                            <p className="text-2xl text-[#3C4858]">Notifications</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="py-4">
                                <p className="text-xl text-[#999999]">Current Date:</p>
                            </div>
                        </div>

                        {/* Alert */}
                        <PromiseBuilder
                            promise={this.state.stats}
                            dataBuilder={data => (
                                <EntityCountCard
                                    fullWidth
                                    elevation={0}
                                    label="Alerts"
                                    count={getNotificationCountFromStats(data).toString().padStart(3, '0')}
                                    items={[
                                        { label: 'Temperatures', count: data.temperatures.toString().padStart(3, '0') },
                                        { label: 'Humidity', count: data.humidities.toString().padStart(3, '0') },
                                        { label: 'UV Exposure', count: data.uvExposure.toString().padStart(3, '0') },
                                        { label: 'Battery Level', count: data.batteryLevels.toString().padStart(3, '0') },
                                        { label: 'Disconnect issues', count: data.diconnectIssues.toString().padStart(3, '0') },
                                    ]}
                                />
                            )}
                            loadingBuilder={() => (<Skeleton variant='rounded' height={140} />)}
                            errorBuilder={(err) => (<p>Une erreur s'est produite</p>)}
                        />
                    </div>

                    {/* Map */}
                    <div style={{ flex: '1 1 0' }}>
                        {/* <BubleMap /> */}

                        <NearMap zoom={3}>
                            {getCoordinates(this.state.data).map(c => <Marker position={c}></Marker>)}
                        </NearMap>
                    </div>
                </div>

                <NotificationFilterComponent
                    bloc={this.bloc}
                    // onSearch={() => {}}
                />

                {/* Table */}
                <div className="mt-4">
                    <NotificationsTable bloc={this.bloc} onDeleted={this.onUpdate} />
                </div>

            </div>
        );
    }
}

function getCoordinates(data: PaginationBlocData<INotification>) {
    if (!data.hasData)
        return [];

    const coords = new Set([...data.data!.items.map(v => `${v.coordinates.latitude} ${v.coordinates.longitude}`)]);

    return Array.from(coords).map(v => {
        const s = v.split(' ');
        return { lat: parseFloat(s[0]), lng: parseFloat(s[1]) };
    });
}

export { NotificationsPage };