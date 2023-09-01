import React from "react";
import { Completer } from "../../services/completer";
import { RegisterDevicesGroupDialog } from "./RegisterDevicesGroupDialog ";
import { ConfirmSuppressionDialog } from "./ConfirmSuppressionDialog";

class DialogService {

    static showDeleteConfirmation: (title: string, description: string) => Promise<boolean>;
    static showRegisterDevicesGroup: (id?: string) => Promise<boolean>;


}

type Props = {
    
}

type State = {
    deleteConfirmation: { title: string, description: string, completer: Completer<boolean> }|null;
    registerDevicesGroup: { id?: string, completer: Completer<boolean> }|null;
};

class DialogsComponent extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            deleteConfirmation: null,
            registerDevicesGroup: null
        };
    }

    componentDidMount(): void {
        DialogService.showDeleteConfirmation = this.showDeleteConfirmation.bind(this);
        DialogService.showRegisterDevicesGroup = this.showRegisterDevicesGroup.bind(this);
    }

    async showRegisterDevicesGroup(id?: string) {
        const completer = new Completer<boolean>();
        this.setState({ registerDevicesGroup: { id, completer } });

        const result = await completer.promise;
        this.setState({ registerDevicesGroup: null });

        return result;
    }

    async showDeleteConfirmation(title: string, description: string) {
        const completer = new Completer<boolean>();
        this.setState({ deleteConfirmation: { title, description, completer } });

        const result = await completer.promise;
        this.setState({ deleteConfirmation: null });

        return result;
    }

    render() {
        const state = this.state;

        return (
            <>

                {state.deleteConfirmation && <ConfirmSuppressionDialog completer={state.deleteConfirmation.completer} title={state.deleteConfirmation.title} description={state.deleteConfirmation.description}/>}

                {state.registerDevicesGroup && (<RegisterDevicesGroupDialog completer={state.registerDevicesGroup.completer} id={state.registerDevicesGroup.id} />)}
            
            </>
        );
    }
}

export { DialogsComponent, DialogService };