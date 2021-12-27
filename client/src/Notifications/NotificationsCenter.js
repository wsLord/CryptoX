import React, { useEffect, useState } from "react";
import loader from "../shared/img/smloader.gif"
import icon from "../shared/img/icon.png"
import img from "../shared/img/notification.jpg"


export default function NotificationsCenter() {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setdata] = useState({
        size: 0,
        notifications: []
    })

    const showNewNotification = () => {
        new Notification("CryptoX", {
            body: "how you doin!!!!",
            icon: icon,
            image: img
        })
    }
    useEffect(() => {
        const fetchdata = () => {
            //Fetch data
            setIsLoading(true);
            const temp = [{ title: "20 btc Sold", msg: "hello this is msg", date: "27 Dec" },
            { title: "20 btc Sold", msg: "hello this is msg", date: "27 Dec" },
            { title: "20 btc Sold", msg: "hello this is msg", date: "27 Dec" }]
            setIsLoading(false);
        }
        fetchdata();
    })

    return (
        <div className='me-3'>
            <button type="button" class="btn btn-light position-relative" data-bs-toggle="modal" data-bs-target="#exampleModal">
                <i class="fa fa-bell fs-3 text-warning"></i>
                <span class="position-absolute top-0 translate-middle badge rounded-pill bg-danger">
                    {data.size}
                </span>
            </button>
            <div class="modal fade " id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Notifications</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        {isLoading &&
                            <img src={loader} alt="" />
                        }
                        {!isLoading &&
                            <div class="modal-body">
                                {data.notifications.map((Element) => {
                                    return (
                                        <div class="card mb-2">
                                            <div class="card-body d-flex justify-content-evenly align-items-center">
                                                <div className='col-1 me-4'><i class="fa fa-exclamation-circle h1 text-warning"></i></div>
                                                <div className="col-8 text-start">
                                                    <h4>{Element.title}</h4>
                                                    <p className="text-primary">{Element.msg}</p>
                                                </div>
                                                <div className="col-3 fs-5 text-secondary">{Element.date}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
