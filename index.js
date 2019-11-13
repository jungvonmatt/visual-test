#!/usr/bin/env node
'use strict';
const path = require('path');
const fs = require('fs');
const os = require('os');
const { URL } = require('url');
const chalk = require('chalk');
const backstopjs = require('backstopjs');
var xdgBasedir = require('xdg-basedir');
var dataDir = path.join(xdgBasedir.data || os.tmpdir(), 'visual-regression-testing');

const defaultConfig = {
  query: '',
  delay: 1000,
  debug: false,
  asyncCaptureLimit: 5,
  asyncCompareLimit: 50,
  onBeforeScript: path.join(__dirname, 'engine/scripts/puppet/onBefore.js'),
  onReadyScript: path.join(__dirname, 'engine/scripts/puppet/onReady.js'),
  viewports: [
    {
      label: 'mobile',
      width: 375,
      height: 812,
    },
    {
      label: 'desktop',
      width: 1024,
      height: 768,
    },
  ],
};

const getConfig = async environment => {
  const { delay: defaultDelay, ...defaults } = defaultConfig;
  const { urls, uid, query, delay = defaultDelay, debug, cookiePath, selectors = [], ...envConfig } = environment;
  const reportsPath = path.join(__dirname, 'reports', uid);
  const dataPath = path.join(dataDir, uid);

  return {
    ...defaults,
    ...envConfig,
    id: uid,
    report: ['browser', 'CI'],
    engine: 'puppeteer',
    engineFlags: [],
    debug,
    debugWindow: debug,
    paths: {
      engine_scripts: path.join(__dirname, 'engine/scripts'),
      bitmaps_reference: path.join(dataPath, 'bitmaps_reference'),
      bitmaps_test: path.join(dataPath, 'bitmaps_test'),
      html_report: path.join(reportsPath, 'html'),
      ci_report: path.join(reportsPath, 'ci'),
    },

    scenarios: urls.map(u => {
      const url = new URL(u);
      if (query) {
        const searchParams = new URLSearchParams(url.search);
        Array.from(query.replace(/^\?/, '').split('&')).forEach(param => {
          const [key, value] = param.split('=');
          if (key) {
            searchParams.append(key, value);
          }
        });
        url.search = searchParams.toString();
      }

      const result = {
        label: url.pathname.replace(/\.[^.]+$/, ''),
        url: url.href,
        selectors: ['document', ...selectors],
        delay,
      };

      if (cookiePath && fs.existsSync(cookiePath)) {
        result.cookiePath = cookiePath;
      }

      return result;
    }),
  };
};

module.exports = async (environment, cmd = 'test') => {
  const config = await getConfig(environment);

  if (cmd === 'test' && !fs.existsSync(config.paths.bitmaps_reference)) {
    console.log(chalk.yellow("Can't compare without references. Creating reference images now ..."));
    cmd = 'reference';
  }

  return await backstopjs(cmd, { config });
};
