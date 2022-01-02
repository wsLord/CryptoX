import React, { useState, useEffect, useContext, Fragment } from "react";
import AuthContext from "../store/authContext";
import { useHistory } from "react-router-dom";
import Alert from "../shared/components/Alert";

export default function Search() {

    const history = useHistory();

    const ctx = useContext(AuthContext);
    const [search, setSearch] = useState("");
    const [allCoins, setAllCoins] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [coinID, setCoinID] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchdata = async () => {
            try {
                let url = 'https://api.coingecko.com/api/v3/coins/list';
                let data = await fetch(url);
                let parseData = await data.json();
                setAllCoins(parseData);

            } catch (err) {
                console.log(err);
            }
        };

        fetchdata();
    }, [ctx]);

    const handleSearch = async (event) => {
        const value = event.target.value;
        setSearch(value);
        setCoinID("");
        let regex = new RegExp(`${value}`, "i");
        var temp = allCoins.filter(element => regex.test(element.name));
        temp = temp.slice(0, 50);
        setSearchData(temp);
    }

    const handleSelect = (event) => {
        setSearch(event.name);
        setCoinID(event.id);
    }
    const onSubmit = () => {
        if (coinID === "") {
            setError("Invalid CoinID");
        }
        else {
            const newPath = `/coins/${coinID}`
            history.push(newPath);
        }
    }

    const clearError = () => {
        setError(null);
    };

    return (
        <Fragment>
            <div className='me-2'>
                <button type="button" class="btn btn-light" data-bs-toggle="modal" data-bs-target="#SearchModal">
                    <i class="fa fa-search fs-2 text-success"></i>
                </button>

                <div class="modal fade" id="SearchModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Search Coin</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="m-2">{error && <Alert msg={error} onClose={clearError} />}</div>
                            <div className="m-2">
                                <div class="input-group">
                                    <span class="input-group-text bg-white border-end-0"><i class="fa fa-search fs-4 text-secondary"></i></span>
                                    <input type="search" value={search} onChange={handleSearch} class="form-control border-start-0 p-3" placeholder="Search" required />
                                    <button class="btn btn-success px-4" onClick={onSubmit} ><i class="fa fa-arrow-right"></i></button>
                                </div>
                            </div>
                            <div class="modal-body">

                                <div className="d-flex flex-column">
                                    {searchData.map((element) => {
                                        return (
                                            <div className="d-flex justify-content-between" key={element.id} type="button" onClick={() => handleSelect(element)}>
                                                <p className="fs-6">{element.name}</p>
                                                <p className="fs-6 text-secondary">{element.symbol}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
