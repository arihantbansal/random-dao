import { AddressZero } from "@ethersproject/constants";
import { readFileSync } from "fs";
import sdk from "./1-initialize-sdk.js";

(async () => {
	try {
		const editionDropAddress = await sdk.deployer.deployEditionDrop({
			name: "randomDAO Membership",
			description:
				"A DAO for the crazy. Randomness is beautiful. We embrace that beauty.",
			image: readFileSync("scripts/assets/dice.jpg"),
			primary_sale_recipient: AddressZero,
		});

		const editionDrop = sdk.getEditionDrop(editionDropAddress);

		const metadata = await editionDrop.metadata.get();

		console.log(
			"✅ Successfully deployed editionDrop contract, address:",
			editionDropAddress
		);

		console.log("✅ editionDrop metadata:", metadata);
	} catch (error) {
		console.log("failed to deploy editionDrop contract", error);
	}
})();
