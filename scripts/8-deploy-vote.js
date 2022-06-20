import sdk from "./1-initialize-sdk.js";

(async () => {
	try {
		const voteContractAddress = await sdk.deployer.deployVote({
			name: "randomDAO",
			voting_token_address: "0xc324ACdEA293A29835e9c9246B1dAeD97f4b2A4F",
			voting_delay_in_blocks: 0,
			voting_period_in_blocks: 6570,
			voting_quorum_fraction: 10,
			proposal_token_threshold: 0,
		});

		console.log(
			"✅ Successfully deployed vote contract, address:",
			voteContractAddress
		);
	} catch (err) {
		console.error("Failed to deploy vote contract", err);
	}
})();
