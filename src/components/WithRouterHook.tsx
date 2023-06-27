import { useNavigate, useParams } from "react-router-dom";

const WithRouter = (WrappedComponent: any) => (props: any) => {
    return (<WrappedComponent {...props} navigate={useNavigate()} />);
}

const WithUseParams = (WrappedComponent: any) => (props: any) => {
    return (<WrappedComponent {...props} params={useParams()} />);
}

export { WithRouter, WithUseParams };