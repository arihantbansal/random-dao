import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0xc324ACdEA293A29835e9c9246B1dAeD97f4b2A4F");

(async () => {
	try {
		const allRoles = await token.roles.getAll();

		console.log("👀 Roles that exist right now:", allRoles);

		await token.roles.setAll({ admin: [], minter: [] });
		console.log(
			"🎉 Roles after revoking ourselves",
			await token.roles.getAll()
		);
		console.log(
			"✅ Successfully revoked our superpowers from the ERC-20 contract"
		);
	} catch (error) {
		console.error("Failed to revoke ourselves from the DAO trasury", error);
	}
})();
