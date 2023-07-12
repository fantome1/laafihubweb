import { useNavigate, useParams } from "react-router-dom";

const WithRouter = (WrappedComponent: any) => (props: any) => {
    return (<WrappedComponent {...props} navigate={useNavigate()} params={useParams()} />);
}

export { WithRouter };