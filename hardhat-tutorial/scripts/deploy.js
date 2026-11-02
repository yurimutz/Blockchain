// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const path = require("path");

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  console.log("Deploying the contracts with the account:", deployerAddress);

  const balance = await ethers.provider.getBalance(deployerAddress);
  console.log("Account balance:", balance.toString());

  const Turing = await ethers.getContractFactory("Turing");
  const token = await Turing.deploy();
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("Turing contract address:", tokenAddress);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(tokenAddress);
}

function saveFrontendFiles(tokenAddress) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ Token: tokenAddress }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("Turing");

  fs.writeFileSync(
    path.join(contractsDir, "Token.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
