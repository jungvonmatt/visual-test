# JvM Visual Regression Tester

Automates visual regression testing of our projects by comparing DOM screenshots over time.<br/>
Convinience wrapper around [`BackstopJS`](https://garris.github.io/BackstopJS/)

## Install

Clone project

```sh
npm i -g git+ssh://git@stash.jvm.de:7999/jin/visual-regression-testing.git
```

## Usage

**Initialize project**

```
./visual-tester reference
```

**Run tests**

```
./visual-tester test
```

**Approve tests**

```
visual-tester approve
```

You can optionally add query parameters to the requests with the `--query` argument

```
visual-tester test --query 'optimize-css=1&debug=true'
```

You can specify a custom config directory using the `--config-dir` option

```
visual-tester test --config-dir ~/.my-visualtest-directory
```

Or just call with the url to the sitemap

```
visual-tester test https://fahrrad.hamburg/sitemap.xml
```

## Add projects

This is currently configured for the bmw.com website. To add other projects you need to place a config file in one of the following locations:

- In a custom path specified by `--config-dir``
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
