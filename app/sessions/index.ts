import {createCookieSessionStorage} from '@remix-run/node';

const {getSession, commitSession, destroySession} = createCookieSessionStorage({
    cookie: {
        name: "__session",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        path: "/",
    }
})

export {getSession, commitSession, destroySession}
