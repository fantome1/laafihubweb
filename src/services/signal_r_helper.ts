import { Utils } from "./utils";

class SignRHelper {

    public connection = Utils.signalRConnectionBuilder();
    private startPromie: Promise<void>|null = null;

    start() {
        if (this.startPromie == null)
            this.startPromie = this.connection.start();
        return this.startPromie;
    }

}

const signalRHelper = new SignRHelper();
export { signalRHelper };