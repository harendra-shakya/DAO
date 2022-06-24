import { DeployFunction } from "hardhat-deploy/dist/types";
const { ethers } = require("hardhat");

const deployBox: DeployFunction = async function ({ getNamedAccounts, deployments }) {
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    log("Deploying box");

    const box = await deploy("Box", {
        from: deployer,
        args: [],
        log: true,
    });
    const timeLock = await ethers.getContract("TimeLock");
    const boxContract = await ethers.getContract("Box");
    const transferOwnerTx = await boxContract.transferOwnership(timeLock.address);
    await transferOwnerTx.wait(1);
};

export default deployBox;
