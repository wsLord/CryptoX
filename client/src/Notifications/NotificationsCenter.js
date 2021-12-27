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
    // useEffect(() => {
    //     const fetchdata = () => {
    //         //Fetch data
    //         setIsLoading(true);
    //         const temp = [{ title: "20 btc Sold", msg: "hello this is msg", date: "27 Dec" },
    //         { title: "20 btc Sold", msg: "hello this is msg", date: "27 Dec" },
    //         { title: "20 btc Sold", msg: "hello this is msg", date: "27 Dec" }]
    //         if (temp.length > data.size) {
    //             showNewNotification();
    //         }
    //         setdata({
    //             size: temp.length,
    //             notifications: temp
    //         })
    //         setIsLoading(false);
    //     }
    //     fetchdata();
    // })

    return (
        <div className='me-3'>
            <button type="button" className="btn btn-light position-relative" data-bs-toggle="modal" data-bs-target="#exampleModal">
                <i className="fa fa-bell fs-3 text-warning"></i>
                <span className="position-absolute top-0 translate-middle badge rounded-pill bg-danger">
                    {data.size}
                </span>
            </button>
            <div className="modal fade " id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Notifications</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        {isLoading &&
                            <img src={loader} alt="" />
                        }
                        {!isLoading &&
                            <div className="modal-body">
                                {data.notifications.map((Element) => {
                                    return (
                                        <div className="card mb-2">
                                            <div className="card-body d-flex justify-content-evenly align-items-center">
                                                <div className='col-1 me-4'><i className="fa fa-exclamation-circle h1 text-warning"></i></div>
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
