import {Outlet} from "@remix-run/react";
import {ErrorBoundaryComponent} from "@remix-run/node";

export default function Queries() {
    return (<div>
        <Outlet/>
    </div>)
}

export const ErrorBoundary: ErrorBoundaryComponent = ({error}) => {
    return (<>
            <p>Erg! Something's broken! Maybe try again. </p>
            <pre>{error.message}</pre>
        </>)
}
