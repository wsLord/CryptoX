import React, { useState, useEffect } from "react";

export default function Convert() {
	const assets = [
		{ coinID: "bitcoin", quantity: "212" },
		{ coinID: "dogecoin", quantity: "2312" },
		{ coinID: "ethereum", quantity: "500" },
	];
	const [Limit, setLimit] = useState(0);
	const [From, setFrom] = useState("");
	const [To, setTo] = useState("");

	const [searchInput, setsearchInput] = useState("");

	const [allcoins, setAllcoins] = useState([]);

	const [searchData, setSearchData] = useState([]);

	useEffect(() => {
		const fetchdata = async () => {
			const temp = [];
			try {
				if (allcoins.length === 0) {
					let url = "https://api.coingecko.com/api/v3/coins/list";
					let data = await fetch(url);
					let parseData = await data.json();
					for (let i in parseData) {
						temp.push(parseData[i]);
					}
					setAllcoins(temp);
					console.log(allcoins.length);
				}
			} catch (err) {
				console.log(err);
				// onError;
			}
		};
		fetchdata();
	});
	const handleSelect = (event) => {
		const selected = event.target.value;
		setFrom(selected);
		assets.forEach((element) => {
			if (element.coinID === selected) {
				setLimit(element.quantity);
			}
		});
	};

	const searchHandler = (event) => {
		const value = event.target.value;
		setsearchInput(value);
		let temp = [];
		if (value !== "") {
			let regex = new RegExp(`${value}`, "i");
			for (let i in allcoins) {
				if (regex.test(allcoins[i].id)) {
					temp.push(allcoins[i]);
				}
			}
		}
		setSearchData(temp);
	};

	const handleTo = async (event) => {
		setTo(event.target.value);
		setsearchInput(event.target.value);
		setSearchData([]);

		//Get price from backend
	};
	return (
		<div>
			<form className="m-5 d-flex flex-column align-items-start" action="">
				<div className="d-flex justify-content-between w-100">
					<label HtmlFor="fromAmount" class="form-label h5">
						From
					</label>
					{From !== "" && (
						<p className="text-primary text-end">
							Available : <span className="h5">{Limit}</span> {From} in assets
						</p>
					)}
				</div>
				<div class="input-group mb-3">
					<select class="form-select" onChange={handleSelect}>
						<option className="fs-6" value="" selected>
							Select
						</option>
						{assets.map((element) => {
							return (
								<option className="fs-6" value={element.coinID}>
									{element.coinID}
								</option>
							);
						})}
					</select>
					<input
						type="number"
						class="form-control w-50"
						id="fromAmount"
						placeholder="Amount"
						min="0"
						max={Limit}
						required
					/>
				</div>

				<label HtmlFor="toAmount" class="form-label h5">
					To
				</label>
				<input
					type="search"
					class="form-control"
					placeholder="Search"
					value={searchInput}
					onChange={searchHandler}
				/>
				{searchData.length > 0 && (
					<select
						class="form-select"
						size="3"
						aria-label="size 3 select example"
						onChange={handleTo}
					>
						{searchData.map((element) => {
							return (
								<option className="fs-6" value={element.id}>
									{element.name}
								</option>
							);
						})}
					</select>
				)}
				{To !== "" && From !== "" && (
					<div className="w-100">
						<div className="mt-3 d-flex justify-content-between">
							<p className="h4">Rate </p>
							<p className="fs-5 text-secondary">
								1 {From} &asymp; 100 {To}{" "}
							</p>
						</div>
						<div className="mt-3 d-flex justify-content-between">
							<p className="h4">You may receive </p>
							<p className="fs-5 text-secondary"> 1000 {To} </p>
						</div>
						<p className="text-primary">*May change at time of transaction</p>
					</div>
				)}
				<button type="submit" className="btn btn-success fs-5 mt-3 w-100">
					Convert
				</button>
			</form>
		</div>
	);
}
