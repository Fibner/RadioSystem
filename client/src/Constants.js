const prod = {
    url: {
     APP_URL: 'https://radio.lo-niepolomice.pl',
     API_URL: 'https://radio.lo-niepolomice.pl',
     WS_URL: 'wss://radio.lo-niepolomice.pl/ws'}
   };
const dev = {
    url: {
     APP_URL: 'http://localhost:3000',
     API_URL: 'http://localhost:4999',
     WS_URL: 'ws://localhost:4999'}
   };
export const config = process.env.NODE_ENV === 'development' ? dev : prod;