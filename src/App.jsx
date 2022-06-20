import {
	useAddress,
	useMetamask,
	useEditionDrop,
	useToken,
} from "@thirdweb-dev/react";
import { useState, useEffect, useMemo } from "react";

const App = () => {
	const address = useAddress();
	const connectWithMetamask = useMetamask();
	const editionDrop = useEditionDrop(
		"0x54220421F87DD72d539383cE8846B55B295D7fc1"
	);
	const token = useToken("0xc324ACdEA293A29835e9c9246B1dAeD97f4b2A4F");
	const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
	const [isClaiming, setIsClaiming] = useState(false);

	const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
	const [memberAddresses, setMemberAddresses] = useState([]);

	const shortenAddress = (str) => {
		return str.substring(0, 6) + "..." + str.substring(str.length - 4);
	};

	useEffect(() => {
		if (!hasClaimedNFT) {
			return;
		}

		const getAllAddresses = async () => {
			try {
				const memberAddresses =
					await editionDrop.history.getAllClaimerAddresses(0);
				setMemberAddresses(memberAddresses);
				console.log("🚀 Members addresses", memberAddresses);
			} catch (error) {
				console.error("failed to get member list", error);
			}
		};
		getAllAddresses();
	}, [hasClaimedNFT, editionDrop.history]);

	useEffect(() => {
		if (!hasClaimedNFT) {
			return;
		}

		const getAllBalances = async () => {
			try {
				const amounts = await token.history.getAllHolderBalances();
				setMemberTokenAmounts(amounts);
				console.log("👜 Amounts", amounts);
			} catch (error) {
				console.error("failed to get member balances", error);
			}
		};
		getAllBalances();
	}, [hasClaimedNFT, token.history]);

	const memberList = useMemo(() => {
		return memberAddresses.map((address) => {
			const member = memberTokenAmounts?.find(
				({ holder }) => holder === address
			);

			return {
				address,
				tokenAmount: member?.balance.displayValue || "0",
			};
		});
	}, [memberAddresses, memberTokenAmounts]);

	useEffect(() => {
		if (!address) {
			return;
		}

		const checkBalance = async () => {
			try {
				const balance = await editionDrop.balanceOf(address, 0);
				if (balance.gt(0)) {
					setHasClaimedNFT(true);
					console.log("🌟 this user has a membership NFT!");
				} else {
					setHasClaimedNFT(false);
					console.log("😭 this user doesn't have a membership NFT.");
				}
			} catch (error) {
				setHasClaimedNFT(false);
				console.error("Failed to get balance", error);
			}
		};
		checkBalance();
	}, [address, editionDrop]);

	const mintNft = async () => {
		try {
			setIsClaiming(true);
			await editionDrop.claim("0", 1);
			console.log(
				`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`
			);
			setHasClaimedNFT(true);
		} catch (error) {
			setHasClaimedNFT(false);
			console.error("Failed to mint NFT", error);
		} finally {
			setIsClaiming(false);
		}
	};

	if (!address) {
		return (
			<div className="landing">
				<h1>Welcome to randomDAO</h1>
				<button onClick={connectWithMetamask} className="btn-hero">
					Connect your wallet
				</button>
			</div>
		);
	}

	if (hasClaimedNFT) {
		return (
			<div className="member-page">
				<h1>🍪DAO Member Page</h1>
				<p>Congratulations on being a member</p>
				<div>
					<div>
						<h2>Member List</h2>
						<table className="card">
							<thead>
								<tr>
									<th>Address</th>
									<th>Token Amount</th>
								</tr>
							</thead>
							<tbody>
								{memberList.map((member) => {
									return (
										<tr key={member.address}>
											<td>{shortenAddress(member.address)}</td>
											<td>{member.tokenAmount}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mint-nft">
			<h1>Mint your free 🍪DAO Membership NFT</h1>
			<button disabled={isClaiming} onClick={mintNft}>
				{isClaiming ? "Minting..." : "Mint your nft (FREE)"}
			</button>
		</div>
	);
};

export default App;
