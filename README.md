# JvM Visual Regression Tester

Automates visual regression testing of our projects by comparing DOM screenshots over time.<br/>
Convinience wrapper around [`BackstopJS`](https://garris.github.io/BackstopJS/).

![Browser report](./screen.png)

## Getting started

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
visual-test test https://www.jvm.com/sitemap.xml
```

## Add projects

To add a projects you need to place a config file in one of the following locations:

- In a custom path specified by `--config-dir`
- In the current working directory

Name: `project`.visualtest.config.js

## Configuration

#### Config values

| Key          | Description                                                   |
| ------------ | ------------------------------------------------------------- |
| name         | Project name                                                  |
| environments | Environment config. See below.                                |
| urls         | Array with urls or async function returning the urls to test. |

#### Environment Config values

| Key     | Description                       |
| ------- | --------------------------------- |
| name    | Environment name                  |
| host    | Hostname                          |
| user    | RFC2617 basic authorization: user |  |  |
| pass    | RFC2617 basic authorization: pass |
| base    | Base directory on host            |
| sitemap | Path to sitemap                   |

## Examples

**Minimal example**

```js
module.exports = {
  environments: [
    {
      name: 'Production',
      host: 'https://www.example.com',
      sitemap: '/sitemap.xml',
    },
  ],
};
```

**Static urls**

```js
module.exports = {
  environments: [
    {
      name: 'Production',
      host: 'https://www.example.com',
    },
  ],
  urls: ['index.html', 'imprint.html'],
};
```

**With urls function**

```js
module.exports = {
  environments: [
    {
      name: 'PREVIEW (EN)',
      host: 'http://preview.example.com',
      base: '/en',
      user: '',
      pass: '',
      sitemap: '/en/sitemap.xml',
    },
    {
      name: 'PROD',
      host: 'https://www.example.com',
      sitemap: '/sitemap.xml',
    },
  ],
  urls: async (environment) => {
    // The urls from the sitemap are available here
    const { urls } = environment || {};
    return urls.filter((url) => /regex/.test(url));
  },
};
```

## Can I contribute?

Of course. We appreciate all of our [contributors](https://github.com/jungvonmatt/visual-test/graphs/contributors) and
welcome contributions to improve the project further. If you're uncertain whether an addition should be made, feel
free to open up an issue and we can discuss it.

## License

MIT
