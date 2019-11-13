const { URL } = require('url');
const got = require('got');
const { getAuthToken, getUrlsFromSitemap } = require('../lib/utils');

module.exports = {
  environments: [
    {
      name: 'Dispatcher (JvM)',
      value: {
        host: 'https://bmw-aem-dispatcher.jvm.de',
        base: '/en',
        user: 'admin',
        pass: 'P3rf3ctW0rld',
      },
    },
    {
      name: 'Perfect World (JvM)',
      value: {
        host: 'https://www.perfectworld.bmw-int1.com',
        base: '/en',
        user: 'stage2user',
        pass: 'Wdin4twf',
      },
    },
    {
      name: 'Int A4',
      value: {
        host: 'https://m1.bmw-int4.com',
        base: '/en',
        user: 'stage2user',
        pass: 'Wdin4twf',
      },
    },
    {
      name: 'Int A6',
      value: {
        host: 'https://m1.bmw-int6.com',
        base: '/en',
        user: 'stage2user',
        pass: 'Wdin4twf',
      },
    },
    {
      name: 'Preprod',
      value: {
        host: 'https://m1.bmw-preprod.com',
        base: '/en',
        user: 'stage2user',
        pass: 'Wdin4twf',
      },
    },
    {
      name: 'Live',
      value: {
        host: 'https://www.bmw.com',
        base: '/en',
      },
    },
  ],

  urls: async environment => {
    const { author, host, base = '/', user, pass } = environment || {};
    const resource = `${host}${base}/sitemap.txt`;

    const options = {
      method: 'get',
      rejectUnauthorized: false,
    };

    if (user && pass) {
      options.headers = { Authorization: getAuthToken(user, pass) };
    }

    const { body } = await got(resource, options);
    const rawUrls = getUrlsFromSitemap(body);
    return rawUrls
      .map(url => {
        const query = author ? '?wcmmode=disabled' : '';
        if (!url) {
          return;
        }
        if (url.startsWith(host)) {
          return url + query;
        }

        if (/:\/\//.test(url)) {
          return url.replace(/^https?:\/\/[^\/]+\/[^\/]+/, `${host}${base}`) + query;
        }
      })

      .filter(u => u)
      .map(url => {
        if (user && pass) {
          const urlObj = new URL(url);
          urlObj.username = user;
          urlObj.password = pass;
          return urlObj.href;
        }

        return urlObj;
      });
  },
};
