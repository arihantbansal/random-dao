import { useAddress, useMetamask } from "@thirdweb-dev/react";
import { useEffect } from "react";

const App = () => {
	const address = useAddress();
	const connectWithMetamask = useMetamask();

	useEffect(() => {
		console.log("👋 Address:", address);
	}, [address]);

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

	return (
		<div className="landing">
			<h1>👀 wallet connected, now what!</h1>
		</div>
	);
};

export default App;
