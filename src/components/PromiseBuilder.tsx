import React from "react";
import { PromiseData, PromiseState } from "../models/pomise_data";

type Props<T> = {
    promise?: Promise<T>|null;
    loadingBuilder: () => React.ReactNode;
    dataBuilder: (data: T) => React.ReactNode;
    errorBuilder: (error?: any) => React.ReactNode;
};

type State<T> = {
    data: PromiseData<T>;
};

class PromiseBuilder<T> extends React.Component<Props<T>, State<T>> {

    constructor(props: Props<T>) {
        super(props);

        this.state = {
            data: PromiseData.pending()
        };
    }

    componentDidMount(): void {
        this.wait();
    }

    componentDidUpdate(prevProps: Readonly<Props<T>>, prevState: Readonly<State<T>>, snapshot?: any): void {
        if (prevProps.promise != this.props.promise) {
            this.wait();
        }
    }

    wait() {
        this.props.promise
            ?.then(result => this.setState({ data: PromiseData.resolve(result) }))
            .catch(err => this.setState({ data: PromiseData.reject(err) }));
    }

    render(): React.ReactNode {
        const value = this.state.data;
        switch(value.state) {
            case PromiseState.pending:
                return this.props.loadingBuilder();
            case PromiseState.resolved:
                return this.props.dataBuilder(value.data!);
            default:
                return this.props.errorBuilder(value.error);
        }
    }

}

export { PromiseBuilder };