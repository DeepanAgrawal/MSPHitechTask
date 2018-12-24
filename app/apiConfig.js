import url from 'url';
import getApiUrl from 'react-sugar-ui/lib/utils/getApiUrl';

var app_apis = {
  getAgreementType: { port: 9059, relativePath: "/agreements/types" },
  
};



const INCLUDE_LOCAL_BASE = [];

const getAPIUrl = getApiUrl(app_apis, {
  env: 'test',
  mock: (apiKey) => {
    if (INCLUDE_LOCAL_BASE.indexOf(apiKey) > -1) {
      return {env: 'cft-v-mt-linsbx', port: '9094'};
    } else {
      return {};
    }
  }
});

export function getParsedApiUrl(api, params) {
  return url.parse(getAPIUrl(api, params));
}

export default getAPIUrl;
