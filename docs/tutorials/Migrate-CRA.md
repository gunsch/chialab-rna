# Migrate Create React App to RNA

In this tutorial we will migrate [Create React App](https://facebook.github.io/create-react-app/) to RNA, replacing default `react-scripts serve` and `react-scripts build` scripts.

## Prepare the source code

The RNA dev server works serving a source directory that contains one (or more) HTML entrypoints. Since CRA static files are stored under the `public` folder, we need to copy its contents to the `src` directory:

```sh
$ mv public/index.html    src/index.html
$ mv public/favicon.ico   src/favicon.ico
$ mv public/logo192.png   src/logo192.png
$ mv public/logo512.png   src/logo512.png
$ mv public/manifest.json src/manifest.json
```

### Replace `%PUBLIC_URL%` with local references

Since the HTML file is now part of the build, we don't need the `%PUBLIC_URL%` placeholder anymore.

```diff
- <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
+ <link rel="icon" href="favicon.ico" />
```

```diff
- <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
+ <link rel="apple-touch-icon" href="logo192.png" />
```

```diff
- <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
+ <link rel="manifest" href="manifest.json" />
```

### Include scripts and styles

`react-scripts` automatically injects `index.js` and `index.css` in the HTML file, so we need to add those references in the `index.html` file:

```diff
    <title>React App</title>
+   <link rel="stylesheet" href="index.css">
  </head>
```

```diff
+   <script src="index.js" type="module"></script>
+   <script src="index.js" nomodule=""></script>
  </body>
```

## Update package.json scripts

First, we need to install `rna` dependencies:

```sh
# NPM
$ npm i -D @chialab/rna @chialab/rna-bundler @chialab/rna-dev-server
# YARN
$ yarn add -D @chialab/rna @chialab/rna-bundler @chialab/rna-dev-server
```

Then, we are ready to update the `package.json` file to replace `react-scripts` witn `rna`.

We will pass `--jsxModule` to make sure `React` JSX pragma is imported in JavaScript files. Other JSX configurations for React are automatically loaded by `esbuild`.

```diff
{
  "scripts": {
-   "start": "react-scripts start",
+   "start": "rna serve src --jsxModule 'react'",
-   "build": "react-scripts build",
+   "build": "rna build src/index.html -O public --jsxModule 'react'",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

Both `serve` and `build` scripts are now ready to play with your React app 🎉
