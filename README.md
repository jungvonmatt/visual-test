# JvM Visual Regression Tester

Automates visual regression testing of our projects by comparing DOM screenshots over time.

## Install

Clone project

```sh
git clone ssh://git@stash.jvm.de:7999/jin/visual-regression-testing.git
```

Install dependencies

```
npm i
```

I suggest to add a symlink inside `~/bin` to the executable so the tool can be started from anywhere.


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

```
visual-tester test https://fahrrad.hamburg/sitemap.xml
```

Or just call with the url to the sitemap

## Add projects

This is currently configured for the bmw.com website. To add other projects you need to place a config file in one of the following locations:
* Inside the projects directory in this Repo.
* In a custom path specified by

Name: `project`.visualtest.config.js<br>
Example:

```
module.exports = {
  environments: [
    {
      name: 'Preview',
      value: {
        host: 'http://preview.jvm.com',
        base: '/preview/project/web',
        user: 'jvmnext',
        pass: '...',
      },
    },
    {
      name: 'Live',
      value: {
        host: 'http://live.jvm.com',
        base: '/live/project/web',
      },
    },
  ],
  urls: [
    'http://preview.jvm.com/preview/project/web/index.html',
    'http://preview.jvm.com/preview/project/web/contact.html',
  ]
}
```

You can also use an async function instead of the static array. The `urls` function receives the chosen environment as first parameter so you might grab the sitemap.xml to generate the urls dynamically
