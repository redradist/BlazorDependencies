## Blazor.Dependecies

This library helps maintan dependecies for Razor Class Library for scripts and styles

Take a look at sample in `sample/` folder

Only thing you need to do is specify `blazorDeps.json` file in `wwwroot`:
```json
[
  {
    "type": "script",
    "url": "https://pay.google.com/gp/p/js/pay.js"
  },
  {
    "type": "script",
    "url": "_content//scripts.js"
  },
  {
    "type": "script",
    "url": "_content/BlazorGooglePay/blazorGooglePay.js"
  },
  {
    "type": "Razor Class Library",
    "name": "BrowserInterop"
  },
  {
    "type": "RCL",
    "name": "BrowserInterop"
  },
  {
    "type": "style",
    "url": "_content/BlazorGooglePay/blazorGooglePay.css"
  }
]
```

that describe dependecies and add the following code instead of your `<script src="_framework/blazor.webassembly.js"></script>` tag:
```html
    <script src="_framework/blazor.webassembly.js" autostart='false'></script>
    <script src="https://cdn.jsdelivr.net/gh/redradist/BlazorDependencies/src/blazor.dependencies.js"></script>
    <script>
        window.blazorDepsPromise.then(() => {
            Blazor.start();
        });
    </script>
```

Here is example of `index.html`:
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>SomeApp.Web</title>
    <base href="/" />
    <link href="css/normalize.css" rel="stylesheet" />
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet" />
    <link href="css/app.css" rel="stylesheet" />
    <link href="_content/MatBlazor/dist/matBlazor.css" rel="stylesheet" />
</head>

<body>
    <app>Loading...</app>

    <div id="blazor-error-ui">
        An unhandled error has occurred.
        <a href="" class="reload">Reload</a>
        <a class="dismiss">🗙</a>
    </div>
    <script src="_framework/blazor.webassembly.js" autostart='false'></script>
    <script src="https://cdn.jsdelivr.net/gh/redradist/BlazorDependencies/src/blazor.dependencies.js"></script>
    <script>
        window.blazorDepsPromise.then(() => {
            Blazor.start();
        });
    </script>
    <script src="_content/MatBlazor/dist/matBlazor.js"></script>
    <script src="scripts/window.js"></script>
</body>

</html>
```
