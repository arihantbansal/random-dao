import {
	useAddress,
	useMetamask,
	useEditionDrop,
	useToken,
	useVote,
	useNetwork,
} from "@thirdweb-dev/react";
import { ChainId } from "@thirdweb-dev/sdk";
import { useState, useEffect, useMemo } from "react";
import { AddressZero } from "@ethersproject/constants";

const App = () => {
	const address = useAddress();
	const connectWithMetamask = useMetamask();
	const network = useNetwork();
	const editionDrop = useEditionDrop(
		"0x54220421F87DD72d539383cE8846B55B295D7fc1"
	);
	const token = useToken("0xc324ACdEA293A29835e9c9246B1dAeD97f4b2A4F");
	const vote = useVote("0x95879AC69b55E8b1B907ECA66A906944Bd205C15");

	const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
	const [isClaiming, setIsClaiming] = useState(false);
	const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
	const [memberAddresses, setMemberAddresses] = useState([]);
	const [proposals, setProposals] = useState([]);
	const [isVoting, setIsVoting] = useState(false);
	const [hasVoted, setHasVoted] = useState(false);

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

	useEffect(() => {
		if (!hasClaimedNFT) {
			return;
		}

		const getAllProposals = async () => {
			try {
				const proposals = await vote.getAll();
				setProposals(proposals);
				console.log("🌈 Proposals:", proposals);
			} catch (error) {
				console.log("failed to get proposals", error);
			}
		};
		getAllProposals();
	}, [hasClaimedNFT, vote]);

	useEffect(() => {
		if (!hasClaimedNFT) {
			return;
		}

		if (!proposals.length) {
			return;
		}

		const checkIfUserHasVoted = async () => {
			try {
				const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
				setHasVoted(hasVoted);
				if (hasVoted) {
					console.log("🥵 User has already voted");
				} else {
					console.log("🙂 User has not voted yet");
				}
			} catch (error) {
				console.error("Failed to check if wallet has voted", error);
			}
		};
		checkIfUserHasVoted();
	}, [hasClaimedNFT, proposals, address, vote]);

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

	if (address && network?.[0].data.chain.id !== ChainId.Rinkeby) {
		return (
			<div className="unsupported-network">
				<h2>Please connect to Rinkeby</h2>
				<p>
					This dapp only works on the Rinkeby network, please switch networks in
					your connected wallet.
				</p>
			</div>
		);
	}

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
					<div>
						<h2>Active Proposals</h2>
						<form
							onSubmit={async (e) => {
								e.preventDefault();
								e.stopPropagation();

								setIsVoting(true);

								const votes = proposals.map((proposal) => {
									const voteResult = {
										proposalId: proposal.proposalId,
										vote: 2,
									};
									proposal.votes.forEach((vote) => {
										const elem = document.getElementById(
											proposal.proposalId + "-" + vote.type
										);

										if (elem.checked) {
											voteResult.vote = vote.type;
											return;
										}
									});
									return voteResult;
								});

								try {
									const delegation = await token.getDelegationOf(address);
									if (delegation === AddressZero) {
										await token.delegateTo(address);
									}
									try {
										await Promise.all(
											votes.map(async ({ proposalId, vote: _vote }) => {
												const proposal = await vote.get(proposalId);
												if (proposal.state === 1) {
													return vote.vote(proposalId, _vote);
												}
												return;
											})
										);
										try {
											await Promise.all(
												votes.map(async ({ proposalId }) => {
													const proposal = await vote.get(proposalId);

													if (proposal.state === 4) {
														return vote.execute(proposalId);
													}
												})
											);
											setHasVoted(true);
											console.log("successfully voted");
										} catch (err) {
											console.error("failed to execute votes", err);
										}
									} catch (err) {
										console.error("failed to vote", err);
									}
								} catch (err) {
									console.error("failed to delegate tokens");
								} finally {
									setIsVoting(false);
								}
							}}>
							{proposals.map((proposal) => (
								<div key={proposal.proposalId} className="card">
									<h5>{proposal.description}</h5>
									<div>
										{proposal.votes.map(({ type, label }) => (
											<div key={type}>
												<input
													type="radio"
													id={proposal.proposalId + "-" + type}
													name={proposal.proposalId}
													value={type}
													defaultChecked={type === 2}
												/>
												<label htmlFor={proposal.proposalId + "-" + type}>
													{label}
												</label>
											</div>
										))}
									</div>
								</div>
							))}
							<button disabled={isVoting || hasVoted} type="submit">
								{isVoting
									? "Voting..."
									: hasVoted
									? "You Already Voted"
									: "Submit Votes"}
							</button>
							{!hasVoted && (
								<small>
									This will trigger multiple transactions that you will need to
									sign.
								</small>
							)}
						</form>
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
