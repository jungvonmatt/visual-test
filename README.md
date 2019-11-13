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
./visual-tester approve
```

You can optionally add query parameters to the requests with the `--query` argument
```
./visual-tester test --query 'optimize-css=1&debug=true'
```

## Add projects
This is currently configured for the bmw.com website. To add other projects you need to place an according config file inside the projects directory.

Name: <project>.config.js<br>
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