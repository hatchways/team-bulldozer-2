# EXPRESS-STARTER
## RFP: Peer mock technical interview platform
Clone the repository

    git clone git@github.com:hatchways/team-bulldozer-2.git -b dev

Switch to the repo folder

    cd team-bulldozer-2

## Start the backend    

Donwload and start a mongo docker container

    docker run --name hatchways-mongo -p 27017:27017 -d mongo:4.4-bionic

Switch to the backend folder

    cd server

Copy the example env file and make the required configuration changes in the .env file

    cp .env.example .env    

Install all the dependencies using node

    npm i

Start the local development server

    npm run dev
You can now access the server at http://localhost:3001   