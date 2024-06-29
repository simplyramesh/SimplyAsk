## Available Scripts

In the project directory, you can run:

### `npm install`

Installs all the required dependencies.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

https://www.npmjs.com/package/react-bpmn
https://codesandbox.io/s/senuf?file=/src/index.js

https://reactflow.dev/examples/

https://github.com/bpmn-io/bpmn-js-example-react-properties-panel

https://github.com/Grupo-Abraxas/react-bpmn-modeler - camunda modeller

#Docker
https://scotch.io/tutorials/react-docker-with-security-in-10-minutes#toc-build-a-docker-image-with-your-react-apphttps://scotch.io/tutorials/react-docker-with-security-in-10-minutes#toc-build-a-docker-image-with-your-react-app
docker build -t dashboard-fe .


### `External Websites CORS Issue`

For demo purposes we can request access from this website:
https://cors-anywhere.herokuapp.com/

### `Deploy to GCP`
https://cloud.google.com/run/docs/quickstarts/build-and-deploy/nodejs
https://betterprogramming.pub/deploy-a-react-app-to-google-cloud-platform-using-google-app-engine-3f74fbd537ec

In the future, we may need to run our own server and change proxy:
https://unpkg.com/x-frame-bypass@1.0.2/x-frame-bypass.js \
https://github.com/Rob--W/cors-anywhere/

docker login 
docker image tag smartcity-dashboard-fe maverick1988/dashboard-ui
docker push maverick1988/dashboard-ui

#VITE_BACKEND_BASE_URL=http://localhost:8080
#VITE_CATALOG_URL=http://localhost:8084
#VITE_CATALOG_URL=https://simplyask-np.cloudapps.telus.com/fulfillment
