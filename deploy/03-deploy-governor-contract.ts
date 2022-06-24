import { DeployFunction } from "hardhat-deploy/dist/types";
import { QUORUM_PERCENTAGE } from "../helper-hardhat-config";
import { VOTING_PERIOD } from "../helper-hardhat-config";
import { VOTING_DELAY } from "../helper-hardhat-config";

const deployGovernorContract: DeployFunction = async function ({ getNamedAccounts, deployments }) {
    const { deployer } = await getNamedAccounts();
    const { deploy, log, get } = deployments;
    const governmentToken = await get("GovernanceToken");
    const timeLock = await get("TimeLock");

    log("Deploying Governor Contract");

    const governorContract = await deploy("GovernorContract", {
        from: deployer,
        args: [
            governmentToken.address,
            timeLock.address,
            QUORUM_PERCENTAGE,
            VOTING_PERIOD,
            VOTING_DELAY,
        ],
        log: true,
    });
};

export default deployGovernorContract;
