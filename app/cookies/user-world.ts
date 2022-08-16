import {createCookieSessionStorage} from "@remix-run/node";

const {getSession, commitSession, destroySession} = createCookieSessionStorage({
    cookie: {
        name: "__world",
    }
})
