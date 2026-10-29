const { expect } = require("chai");

const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Token contract", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshot in every test.
  async function deployTokenFixture() {
    // Get the Signers here.
    const [owner, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call ethers.deployContract and await
    // its waitForDeployment() method, which happens once its transaction has been
    // mined.
    const hardhatToken = await ethers.deployContract("Turing");

    await hardhatToken.waitForDeployment();

    // Fixtures can return anything you consider useful for your tests
    return { hardhatToken, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });
  });

  describe("Voting", function (){
    it("Should open the voting", async function(){
        const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
        expect(await hardhatToken.owner()).to.equal(owner.address);
    })

    // it("Should fail if sender have 0 tokens", async function () {
    //   const { hardhatToken, owner, addr1 } = await loadFixture(
    //     deployTokenFixture
    //   );
    //   const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

    //   await  expect(
    //     hardhatToken.connect(addr1).transfer(owner.address, 0)
    //   ).to.be.revertedWith("Nao e possivel transferir 0 tokens");

    //   // Owner balance shouldn't have changed.
    //   expect(await hardhatToken.balanceOf(owner.address)).to.equal(
    //     initialOwnerBalance
    //   );
    // });

  });
});
