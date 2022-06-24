import { ethers, network } from "hardhat";
import {
    NEW_STORE_VALUE,
    FUNC,
    PROPOSAL_DESCRIPTION,
    developmentChains,
    MIN_DELAY,
} from "../helper-hardhat-config";
import moveTime from "../utils/move-time";
import moveBlocks from "../utils/move-blocks";

export default async function queueAndExecute() {
    const governor = await ethers.getContract("GovernorContract");
    const args = [NEW_STORE_VALUE];
    const box = await ethers.getContract("Box");
    const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, args);
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION));
    const queueTx = await governor.queue(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    );
    await queueTx.wait(1);

    if (developmentChains.includes(network.name)) {
        await moveTime(MIN_DELAY + 10);
        await moveBlocks(1);
    }

    const executeTx = await governor.execute(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    );
    await executeTx.wait(1);
    console.log("Executed!");

    const boxNewValue = await box.retrieve();
    console.log(`New Box value ${boxNewValue.toString()}`);
}

queueAndExecute()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
