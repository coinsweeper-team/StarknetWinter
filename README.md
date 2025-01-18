Recommended Setup - Using the SDK with React
This will provide you with a starter template for building a React application using the Dojo SDK.


npx @dojoengine/create-dojo start -t example-vite-react-sdk



Run the app
To run the app locally, you need to have your world deployed. Follow those steps to make this work.

Run katana

1. katana --dev --dev.no-fee --http.cors_origins '*'


In your contract folder

2. sozo build
3. sozo migrate
4. source ~/.bashrc


Run torii

5. torii -w {world_address-output of previous command} --http.cors_origins '*'


In your client folder
npm install vite --save-dev
npm run dev
