// const defaultAddress = `http://api.saddlebagexchange.com`
const defaultAddress = `http://localhost:8000`

export const address = defaultAddress
// @todo update via env var
// export const address =
//   process.env.NODE_ENV === 'development'
//     ? process.env.API_ADDRESS
//     : defaultAddress

export const UserAgent = 'Saddlebag/1.0'
export const defaultMaxAge = 60 * 60 * 24 * 365 // 1 year in seconds
