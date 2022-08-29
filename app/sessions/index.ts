import {createCookieSessionStorage} from '@remix-run/cloudflare';
import { WorldsArray} from "~/utils/locations/Worlds";
import {DataCenterArray} from "~/utils/locations/DataCenters";

const {getSession, commitSession, destroySession} = createCookieSessionStorage({
    cookie: {
        name: "__session",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        path: "/",
    }
})



async function getUserSessionData(request: Request) {
    const session = await getSession(request.headers.get('Cookie'));
    return {
        getWorld: () => {
            try {
                const world = session.get('world');
                if (!WorldsArray.includes(world)) {
                    // @todo select a default
                    throw new Error(`World not an available option. [${world}]`);
                }
                return world;
            }catch(err) {
                return WorldsArray.at(0);
            }
        },
        getDataCenter: () => {
            const dataCenter = session.get('data_center');
            return DataCenterArray.includes(dataCenter) && dataCenter;
        },
    }
}

export {getUserSessionData, getSession, commitSession, destroySession}
