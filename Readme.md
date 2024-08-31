# Setup
## initialize a new Node.js project:
`npm init -y`

## Setup up environment and Install Dependencies:

`npm install typescript ts-node @types/node openai amqplib uuid dotenv zod pdf-parse`
`npm install @types/amqplib --save-dev`
`docker pull rabbitmq:3-management`
`npm i --save-dev @types/pdf-parse`

## create config file
`npx tsc --init`



# Running the program
ensure Docker is running `docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management`
CLI: `npx ts-node index.ts`
