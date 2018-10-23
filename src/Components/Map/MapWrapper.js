import makeAsyncScriptLoader from 'react-async-script';
import Map from './Map';

const key = 'AIzaSyCQfJgnHnO6LlY_DxE-VaYEB_qWV-W9O7c';
const url = `https://maps.googleapis.com/maps/api/js?key=${key}`;
const globalName = 'google';

export default makeAsyncScriptLoader(url, {
  globalName: globalName
})(Map);