import React from "react";
import * as signalR from '@microsoft/signalr';

type Props = {

};

type State = {
    connected: boolean;
    error: any;
}

class RealtimeTestPage extends React.PureComponent<Props, State> {

    private connection = new signalR.HubConnectionBuilder()
        .withUrl('http://192.168.99.22:5276/auth/connect', {
            // skipNegotiation: false,
            // transport: signalR.HttpTransportType.WebSockets

        })
        .build();

    constructor(props: any) {
        super(props);

        this.state = {
            connected: false,
            error: null
        };
    }

    componentDidMount(): void {
        if (this.connection.state !=  signalR.HubConnectionState.Disconnected)
            return;

        this.connection.start()
            .then(() => {
                this.setState({ connected: true })
                this.connection.invoke('SendMessage', 'Willy', 'Hello');

                this.connection.on('a', (args) => {

                });

            }).catch(err => {
                console.log(err);
                this.setState({ error: true });
            });

        // this.connection.on('')
    }

    componentWillUnmount(): void {
        // if (this.connection.state != signalR.HubConnectionState.Connected) {
        //     this.connection.stop();
        // }
    }

    render() {
        return (
            <>
                <div className="w-full h-[100vh] flex justify-center items-center">
                    <p className="text-4xl">{this.getState()}</p>
                </div>
            </>
        );
    }

    getState() {
        if (this.state.error) 
            return (<span className="text-red-500">Erreur</span>);
        if (this.state.connected)
            return (<span className="text-green-500">Connecte</span>);
        return 'Chargement...';
    }

}

export { RealtimeTestPage };