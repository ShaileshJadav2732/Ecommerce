import "react-loading-skeleton/dist/skeleton.css";
import "./Loader.scss";

import { useEffect, useState } from "react";
const Loader = () => {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 2000);
	}, []);

	return (
		<div className={`home loader ${isLoading ? "loading" : ""}`}>
			<>
				<section className="loader-background"></section>
				<h1 className="loader-title"></h1>
				<main className="loader-products">
					{Array(4)
						.fill(0)
						.map((_, index) => (
							<div className="product-card" key={index}></div>
						))}
				</main>
			</>
		</div>
	);
};

export default Loader;

interface SkeletonProps {
	width?: string;
	count?: number;
}
export const Skeleton = ({ width = "unset", count = 3 }: SkeletonProps) => {
	const Skeletons = Array.from({ length: count }, (_, index) => (
		<div key={index} className="skeleton-shape"></div>
	));
	return (
		<div className="skeleton-loader" style={{ width: width }}>
			{Skeletons}
		</div>
	);
};
