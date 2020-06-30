# JvM Visual Regression Tester

Automates visual regression testing of our projects by comparing DOM screenshots over time.<br/>
Convinience wrapper around [`BackstopJS`](https://garris.github.io/BackstopJS/)

![Browser report](./example/screen.png)

## Getting started

### Prerequisites

This package is hosted in the github registry.
This means you need to [configure npm for use with GitHub Packages](https://help.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages)

The global _.npmrc_ file should something look like this:

```
//registry.npmjs.org/:_authToken=GITHUB_TOKEN
//npm.pkg.github.com/:_authToken=NPM_TOKEN

registry=https://registry.npmjs.org/
@jungvonmatt:registry=https://npm.pkg.github.com/
```

### Install

```bash
npm i @jungvonmatt/visual-test
```

## Usage

**Initialize project**

```
visual-test reference
```

**Run tests**

```
visual-test test
```

**Approve tests**

```
visual-test approve
```

You can optionally add query parameters to the requests with the `--query` argument

```
visual-test test --query 'optimize-css=1&debug=true'
```

You can specify a custom config directory using the `--config-dir` option

```
visual-test test --config-dir ~/.my-visualtest-directory
```

Or just call with the url to the sitemap

```
visual-test test https://fahrrad.hamburg/sitemap.xml
```

## Add projects

This is currently configured for the bmw.com website. To add other projects you need to place a config file in one of the following locations:

- In a custom path specified by `--config-dir`
- In the current working directory

Name: `project`.visualtest.config.js

**Example:**

```
module.exports = {
  environments: [
    {
      name: 'Preview',
      host: 'http://preview.jvm.com',
      base: '/preview/project/web',
      user: 'jvmnext',
      pass: '...',
    },
    {
      name: 'Live',
      host: 'http://live.jvm.com',
      base: '/live/project/web',
    },
  ],
  urls: [
    'http://preview.jvm.com/preview/project/web/index.html',
    'http://preview.jvm.com/preview/project/web/contact.html',
  ]
}
```

You can also use an async function instead of the static array. The `urls` function receives the chosen environment as first parameter so you might grab the sitemap.xml to generate the urls dynamically

For mor examples see the files in [`example`](https://stash.jvm.de/projects/JIN/repos/visual-regression-testing/browse/example)
