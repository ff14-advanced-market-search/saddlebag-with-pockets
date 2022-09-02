import {Outlet}                      from "@remix-run/react"
import type {ErrorBoundaryComponent} from "@remix-run/cloudflare"

export default function Queries()
    {
        return (<div>
            <Outlet/>
        </div>)
    }

export const ErrorBoundary: ErrorBoundaryComponent = ({error}) =>
    {
        return (<>
            <p>Erg! Something's broken! Maybe try again. </p>
            <pre>{error.message}</pre>
        </>)
    }
