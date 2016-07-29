in one terminal:

  node-inspector

  get the url from the output of this command, drop that url in a browser


in a second terminal:

  npm run td


Now you can go back to the browser and refresh the app and debug your tests


To find/kill the node-inspector process:

  lsof -i tcp:5858

  kill -9 <PROCESS_ID>
