1. Build the Project

npm run build

2. Start the Development Server

Run the following command to start a development server:

npm start

By default, the application will be served on http://localhost:8000. If the port 8000 is already in use, stop any conflicting processes or change the port in the package.json file.

3. Open in Browser

Navigate to the following URL in your browser:

http://localhost:8000

"start": "http-server public -c-1 -p 8080"

CSS is located in public/styles/ and is linked in your HTML file.

dist/ is located directory and the public/ directory has all assets for deployment.
