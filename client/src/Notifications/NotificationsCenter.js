import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

import AuthContext from "../store/authContext";
import loader from "../shared/img/smloader.gif";
import icon from "../shared/img/icon.png";
import img from "../shared/img/notification.jpg";

const NotificationsCenter = () => {
	const ctx = useContext(AuthContext);

	const [isLoading, setIsLoading] = useState(false);
	// eslint-disable-next-line
	const [isDeleting, setIsDeleting] = useState(false);
	const [notificationCount, setNotificationCount] = useState(0);
	const [notifications, setNotifications] = useState([]);

	// eslint-disable-next-line
	const showNewNotificationOnDesktop = () => {
		new Notification("CryptoX", {
			body: "how you doin!!!!",
			icon: icon,
			image: img,
		});
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);

				// Fetching notifications on first website load
				let { data } = await axios.get(
					`${process.env.REACT_APP_SERVER_URL}/user/notifications/get`,
					{
						headers: {
							Authorization: "Bearer " + ctx.token,
						},
					}
				);

				data.sort((a, b) => {
					const d1 = new Date(a.Date);
					const d2 = new Date(b.Date);
					return d1.getTime() > d2.getTime();
				});

				setNotifications(data);
				setNotificationCount(data.length);
				setIsLoading(false);
			} catch (err) {
				setIsLoading(false);
				console.log(err);
				// onAlert(err.response.data.message);
			}
		};

		fetchData();
	}, [ctx]); //, onAlert

	const deleteNotifications = async () => {
		try {
			setIsDeleting(true);

			let notificationIDs = [];
			notifications.forEach((element) => {
				notificationIDs.push(element.id);
			});

			// Fetching notifications on first website load
			// eslint-disable-next-line
			let { data: deleted } = await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/user/notifications/delete`,
				{
					ids: notificationIDs,
				},
				{
					headers: {
						Authorization: "Bearer " + ctx.token,
					},
				}
			);

			// Fetching notifications on first website load
			let { data } = await axios.get(
				`${process.env.REACT_APP_SERVER_URL}/user/notifications/get`,
				{
					headers: {
						Authorization: "Bearer " + ctx.token,
					},
				}
			);

			// setNotificationCount(data.length);
			data.concat(notifications);

			data.sort((a, b) => {
				const d1 = new Date(a.Date);
				const d2 = new Date(b.Date);
				return d1.getTime() > d2.getTime();
			});

			setNotifications(data);

			console.log(data);
			setNotificationCount(0);
			setIsDeleting(false);
		} catch (err) {
			setIsDeleting(false);
			console.log(err);
			// onAlert(err.response.data.message);
		}
	}

	return (
		<div className="me-3">
			<button
				type="button"
				className="btn btn-light position-relative"
				data-bs-toggle="modal"
				data-bs-target="#exampleModal"
				onClick={deleteNotifications}
			>
				<i className="fa fa-bell fs-3 text-warning"></i>
				<span className="position-absolute top-0 translate-middle badge rounded-pill bg-danger">
					{notificationCount}
				</span>
			</button>
			<div
				className="modal fade "
				id="exampleModal"
				tabIndex="-1"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog modal-dialog-scrollable">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">
								Notifications
							</h5>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>

						{isLoading && <img src={loader} alt="" />}
						{!isLoading && (
							<div className="modal-body">
								{notifications.map((element) => {
									return (
										<div className="card mb-2">
											<div className="card-body d-flex justify-content-evenly align-items-center">
												<div className="col-1 me-4">
													<i className="fa fa-exclamation-circle h1 text-warning"></i>
												</div>
												<div className="col-8 text-start">
													<h4>{element.title}</h4>
													<p className="text-primary">{element.message}</p>
												</div>
												<div className="col-3 fs-5 text-secondary">{element.Date}</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default NotificationsCenter;
