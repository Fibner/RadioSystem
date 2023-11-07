const prod = {
    url: {
     APP_URL: 'https://radio.lo-niepolomice.pl',
     API_URL: 'https://radio.lo-niepolomice.pl',
     WS_URL: 'wss://radio.lo-niepolomice.pl/ws'}
   };
const dev = {
    url: {
     APP_URL: 'http://10.0.1.26:3000',
     API_URL: 'http://10.0.1.26:4999',
     WS_URL: 'ws://10.0.1.26:4999'}
   };
export const config = process.env.NODE_ENV === 'development' ? dev : prod;