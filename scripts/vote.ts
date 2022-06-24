const { network } = require("hardhat");
const fs = require("fs");
import { ethers } from "hardhat";
import { developmentChains, proposalsFile, VOTING_PERIOD } from "../helper-hardhat-config";
import moveBlocks from "../utils/move-blocks";

const index = 0;

export default async function vote(proposalIndex: number) {
    const proposals = await JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
    console.log("proposals", proposals);
    const proposalId = await proposals[network.config.chainId!][proposalIndex];
    console.log("proposalId", proposalId);
    // 0 = Against, 1 = For, 2 = Abstrain
    const voteWay = 1;
    const reason = "I like it";
    const governor = await ethers.getContract("GovernorContract");
    const voteTxResponse = await governor.castVoteWithReason(proposalId, voteWay, reason);
    await voteTxResponse.wait(1);

    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1);
    }

    console.log("Voted! Ready to go");
}

vote(index)
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
