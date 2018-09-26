const domain = process.env.REACT_APP_DOMAIN || "http://localhost";
const port = process.env.REACT_APP_BACKENDPORT || 4000;

export let url = `${domain}:${port}`
