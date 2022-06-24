import { DeployFunction } from "hardhat-deploy/dist/types";
import { ethers } from "hardhat";

const deployGovernmentToken: DeployFunction = async function ({ getNamedAccounts, deployments }) {
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    log("Deploying Governance Token");

    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        args: [],
        log: true,
    });

    log(`deployed governance token ${governanceToken.address}`);
    await delegate(governanceToken.address, deployer);
    log("Delegated!");
};

const delegate = async function (governanceTokenAddress: string, delegatedAccount: string) {
    const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress);
    const tx = await governanceToken.delegate(delegatedAccount);
    await tx.wait(1);
    console.log(`Checkpoits ${await governanceToken.numCheckpoints(delegatedAccount)}`);
};

export default deployGovernmentToken;
