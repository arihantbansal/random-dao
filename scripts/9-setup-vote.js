import sdk from "./1-initialize-sdk.js";

const vote = sdk.getVote("0x95879AC69b55E8b1B907ECA66A906944Bd205C15");
const token = sdk.getToken("0xc324ACdEA293A29835e9c9246B1dAeD97f4b2A4F");

(async () => {
	try {
		await token.roles.grant("minter", vote.getAddress());

		console.log(
			"Successfully gave vote contract permissions to act on token contract"
		);
	} catch (error) {
		console.error(
			"failed to grant vote contract permissions on token contract",
			error
		);
		process.exit(1);
	}

	try {
		const ownedTokenBalance = await token.balanceOf(process.env.WALLET_ADDRESS);

		const ownedAmount = ownedTokenBalance.displayValue;
		const percent90 = (Number(ownedAmount) / 100) * 90;

		await token.transfer(vote.getAddress(), percent90);

		console.log(
			"✅ Successfully transferred " + percent90 + " tokens to vote contract"
		);
	} catch (err) {
		console.error("failed to transfer tokens to vote contract", err);
	}
})();
