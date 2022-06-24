const fs = require("fs");
import { network, ethers } from "hardhat";
import {
    NEW_STORE_VALUE,
    FUNC,
    PROPOSAL_DESCRIPTION,
    developmentChains,
    MIN_DELAY,
    proposalsFile,
} from "../helper-hardhat-config";
import moveBlocks from "../utils/move-blocks";

export async function propose(args: any[], functionToCall: string, proposalDescription: string) {
    const governor = await ethers.getContract("GovernorContract");
    const box = await ethers.getContract("Box");
    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args);
    console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`);
    console.log(`Proposal Description: \n ${proposalDescription}`);

    const proposeTx = await governor.propose(
        [box.address],
        [0],
        [encodedFunctionCall],
        proposalDescription
    );

    const proposeReceipt = await proposeTx.wait(1);

    if (developmentChains.includes(network.name)) {
        moveBlocks(MIN_DELAY + 1);
    }
    const proposalId = proposeReceipt.events[0].args.proposalId;
    let proposals = await JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
    await proposals[network.config.chainId!.toString()].push(proposalId.toString());
    await fs.writeFileSync(proposalsFile, JSON.stringify(proposals));
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
