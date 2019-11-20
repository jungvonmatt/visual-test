#!/usr/bin/env node

'use strict';
const inquirer = require('inquirer');
const chalk = require('chalk');
const meow = require('meow');
const { URL } = require('url');
const { getHostame, getSitemap, readConfigs } = require('./lib/utils');
const run = require('.');

// Initialize cli
const cli = meow(
  `
	Usage
    $ visual-tester <cmd>

  Cmd
    test      Compare with reference images
    approve   Approve test
    reference Generate reference images

	Options
    --query       Add query params to page request
    --config      Manually specify a <project>.visualtest.config.js file
    --config-dir  Specify custom directory to search for project configs
    --output-dir  Specify custom output directory
    --uid         Manually set uid to make references from different domains (live - staging)

	Examples
	  $ visual-tester test --query 'optimize-css=0'
`,
  {
    flags: {
      query: {
        type: 'string',
      },
      config: {
        type: 'string',
      },
      configDir: {
        type: 'string',
      },
      outputDir: {
        type: 'string',
      },
      uid: {
        type: 'string',
      },
    },
  }
);

/**
 * Get project from configs
 * @param {*} configs Config data
 */
const getProject = async configs => {
  if (configs.length === 0) {
    return null;
  }

  // Return the first  project if only one exists
  if (configs.length === 1) {
    return configs[0];
  }

  // Ask the user if there are more than one projects available
  const choices = [...new Set(configs.filter(config => config.name).map(config => config.name))];
  const { project } = await inquirer.prompt({
    type: 'list',
    name: 'project',
    message: 'Choose project',
    choices,
  });

  return configs.find(config => config.name === project);
};

/**
 * Build volatile environment from sitemap
 * @param {String} sitemap Url to sitemap
 */
const getEnvironmentFromSitemap = async sitemap => {
  const url = new URL(sitemap);
  const environment = {
    host: url.origin,
    user: url.username,
    pass: url.password,
    sitemap: url.pathname,
  };

  return {
    ...environment,
    uid: url.hostname,
    urls: await getSitemap(environment),
  };
};

/**
 * Build environment from project
 * @param {Object} project Project config
 */
const getEnvironmentFromProject = async project => {
  const { environments: environmentsRaw, urls, uid, ...projectData } = project;

  if (!environmentsRaw && !urls) {
    console.log(`${chalk.red('Error: Missing urls or environments config')}`);
    process.exit(1);
  }

  if (environmentsRaw && !Array.isArray(environmentsRaw) && typeof environmentsRaw !== 'function') {
    console.log(`${chalk.red('Error: environments need to be an array or a function returning an array')}`);
    process.exit(1);
  }

  // Handle async function or static config
  const environments = environmentsRaw
    ? Array.isArray(environmentsRaw)
      ? environmentsRaw
      : await environmentsRaw()
    : [];

  let [environment] = environments;
  if (environments.length > 1) {
    const choices = environments.map(env => env.name || env.host);
    const { environmentName } = await inquirer.prompt({
      type: 'list',
      name: 'environmentName',
      message: 'Choose environment',
      choices,
    });
    environment = environments.find(env => (env.name || env.host) === environmentName);
  }

  const envId = environment ? getHostame(environment) : '';

  const sitemapUrls = await getSitemap(environment);
  const result = {
    ...projectData,
    ...(environment || {}),
    uid: [uid, envId].filter(v => v).join('/'),
    urls: sitemapUrls,
  };

  if (Array.isArray(urls)) {
    return {
      ...result,
      urls: [...new Set([...urls, ...sitemapUrls])],
    };
  }

  // Handle async function passed as url prop in the config
  if (typeof urls === 'function') {
    return {
      ...result,
      urls: await urls(result),
    };
  }

  return result;
};

// Run
(async () => {
  let [cmd = 'test', sitemap = ''] = cli.input;

  if (!sitemap && /\:\/\//.test(cmd)) {
    sitemap = cmd;
    cmd = 'test';
  }

  if (sitemap) {
    const environment = await getEnvironmentFromSitemap(sitemap);
    return run({ ...environment, ...cli.flags }, cmd);
  }

  const configs = await readConfigs(cli.flags);
  if (configs.length === 0) {
    console.log(`${chalk.red('Error: No config file found')}`);
    process.exit(1);
  }

  const project = await getProject(configs);
  const environment = await getEnvironmentFromProject(project);
  return run({ ...environment, ...cli.flags }, cmd);
})();
