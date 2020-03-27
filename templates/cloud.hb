<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cloud Server</title>
    <link rel="stylesheet" href="/css/cloud.css"/>
</head>

<body>
    <h1>
        Cloud Server
        <a href="cloud/upload">
            <button>
                <img src="/img/upload.png" alt="upload" width="10" height="10">
                Upload
            </button>
        </a>
    </h1>

    <ul>
        <li><p>Current directory: <strong>{{currentDirectory}}</strong></p></li>
        {{#if items}}

                {{#each items}}
                    {{#if directory}}
                    <li>
                        <a href="/cloud/download">📁</a>
                        <a href='/cloud/view'>{{name}}</a>
                    </li>
                    {{else}}
                    <li>
                        <a href="/cloud/download">💾</a>
                        <a href='/cloud/view'>{{name}}</a>
                    </li>
                    {{/if}}
                {{/each}}

        {{else}}
        <p>No items to display</p>
        {{/if}} 
 
    </ul>
</body>
</html>