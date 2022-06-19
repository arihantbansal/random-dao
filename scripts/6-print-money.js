import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0xc324ACdEA293A29835e9c9246B1dAeD97f4b2A4F");

(async () => {
	try {
		const amount = 1000000;
		await token.mintToSelf(amount);
		const totalSupply = await token.totalSupply();

		console.log(
			"✅ There now is",
			totalSupply.displayValue,
			"$PRDM in circulation"
		);
	} catch (error) {
		console.error("Failed to print money", error);
	}
})();
