import React from "react";
import { Link } from "react-router-dom";

import styles from "./Footer.module.css";

const Footer = () => {
	return (
		<div>
			<footer className={`${styles["page-footer"]} font-small pt-4`}>
				<div className="container-fluid text-center">
					<div className="row">
						<div className="col">
							<h3 className="font-weight-bold">CryptoX</h3>
							<p>
								CryptoX is a safe and simple gateway to build a strong crypto
								portfolio for everyone.
							</p>
						</div>
					</div>
				</div>
				<div className="footer-copyright text-center py-3">
					© 2k21 Copyright:
					<Link to="/" className={styles["footer-link"]}>
						CryptoX.com
					</Link>
				</div>
			</footer>
		</div>
	);
};

export default Footer;
