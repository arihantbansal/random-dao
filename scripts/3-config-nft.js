import { readFileSync } from "fs";
import sdk from "./1-initialize-sdk.js";

const editionDrop = sdk.getEditionDrop(
	"0x54220421F87DD72d539383cE8846B55B295D7fc1"
);

(async () => {
	try {
		await editionDrop.createBatch([
			{
				name: "Proof of Randomness",
				description:
					"This NFT will give you access to randomDAO. Let randomness prevail!",
				image: readFileSync("scripts/assets/por.jpg"),
			},
		]);

		console.log("✅ Successfully created a new NFT in the drop!");
	} catch (error) {
		console.error("failed to create the new NFT", error);
	}
})();
