import { INotification } from "../models/notification_model";

type Listener = (count: number, value?: INotification) => void;

class NotificationCounterBloc {

    private count: number = 0;
    private listeners: Listener[] = [];

    get currentCount() {
        return this.count;
    }

    listen(listener: Listener) {
        this.listeners.push(listener);
    }

    increment(value: INotification) {
        this.count += 1;
        this.notify(value);
    }

    decrement() {
        if (this.count <= 0)
            return;
        this.count -= 1;
        this.notify();
    }

    reset() {
        this.count = 0;
        this.notify();
    }

    notify(value?: INotification) {
        for (const listener of this.listeners)
            listener(this.count, value);
    }

    removeListener(listener: Listener) {
        let index = this.listeners.indexOf(listener);

        if (index != -1)
            this.listeners.splice(index, 1);
    }

    // fetch notification count from server
    // dispose ???
}

const notificationCounterBloc = new NotificationCounterBloc();

export { notificationCounterBloc };