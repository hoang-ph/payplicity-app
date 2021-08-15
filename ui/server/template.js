import serialize from 'serialize-javascript';

export default function template(body, initialData, userData) {
  return `<!DOCTYPE HTML>
<html>
<head>
  <meta charset="utf-8">
  <title>Payplicity</title>
  <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://apis.google.com/js/api:client.js"></script>
  <style>
    table.table-hover tr {cursor: pointer;}
    .panel-title a {display: block; width: 100%; cursor: pointer;}
  </style>

  <!-- Favicon Icon -->
  <link rel="icon" href="/favicon.ico">
  
  <!-- Customize CSS Style Sheet -->
  <link rel="stylesheet" href="/styles/App.css">
  
  <!-- Google fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Audiowide&display=swap" rel="stylesheet">

</head>
<body>
  <!-- Page generated from template. -->
  <div id="contents">${body}</div>
  <script>
    window.__INITIAL_DATA__ = ${serialize(initialData)}
    window.__USER_DATA__ = ${serialize(userData)}
  </script>
  <script src="/env.js"></script>
  <script src="/vendor.bundle.js"></script>
  <script src="/app.bundle.js"></script>
</body>
</html>
`;
}
