const readline = require("readline");
const fs = require("fs");
const path = require("path");

const {
  controllerFileContent,
  serviceFileContent,
  prismaFileContent,
  swaggerFileContent,
} = require("./content-templates");

// Ask Prompt
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Q: What is your new route's name? ", (newRoute) => {
  const directoryRelativePath = `./src/${newRoute}/`;
  const directoryPath = path.join(__dirname, "..", directoryRelativePath);

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
    console.log(`[Created], ${directoryRelativePath}`);

    // Create the controller
    const controllerRelativePath = `./src/${newRoute}/${newRoute}.controller.js`;
    const controllerFilePath = path.join(__dirname, "..", controllerRelativePath);
    try {
      fs.writeFileSync(controllerFilePath, controllerFileContent(newRoute));
      console.log(`[Created], ${controllerRelativePath}`);
    } catch (error) {
      console.error(`Error creating file '${controllerRelativePath}': ${error}`);
    }

    // Create the service
    const serviceRelativePath = `./src/${newRoute}/${newRoute}.service.js`;
    const serviceFilePath = path.join(__dirname, "..", serviceRelativePath);
    try {
      fs.writeFileSync(serviceFilePath, serviceFileContent());
      console.log(`[Created], ${serviceRelativePath}`);
    } catch (error) {
      console.error(`Error creating file '${serviceRelativePath}': ${error}`);
    }

    // Create the prisma
    const prismaRelativePath = `./src/${newRoute}/${newRoute}.prisma`;
    const prismaFilePath = path.join(__dirname, "..", prismaRelativePath);
    try {
      fs.writeFileSync(prismaFilePath, prismaFileContent(newRoute));
      console.log(`[Created], ${prismaRelativePath}`);
    } catch (error) {
      console.error(`Error creating file '${prismaRelativePath}': ${error}`);
    }

    // Create the swaggerFile
    const swaggerRelativePath = `./src/${newRoute}/${newRoute}.swagger.json`;
    const swaggerFilePath = path.join(__dirname, "..", swaggerRelativePath);
    try {
      fs.writeFileSync(swaggerFilePath, swaggerFileContent(newRoute));
      console.log(`[Created], ${swaggerRelativePath}`);
    } catch (error) {
      console.error(`Error creating file '${swaggerRelativePath}': ${error}`);
    }

    console.log(`
**********************************************************************
NOTE: 
    (1) Add this new route to the "src/main.js" file
    (2) Spread the swagger file in the "src/config.js" file
    (3) Run "$ yarn prisma" to update the Database's schema
**********************************************************************
`);

    console.log("[DONE]!!");
  } else {
    console.log(`Directory '${directoryPath}' already exists`);
  }

  rl.close();
});
