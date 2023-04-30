import style from './style.css';
import { NotLoggedIn } from '../../components/NotLoggedIn/NotLoggedIn';
import { userContext } from "../../contexts/userContext";
import { useContext } from 'preact/hooks';
import { Grid, Box, Card, CardContent, Typography } from '@mui/material';
import { SidebarCard } from '../../components/SidebarCard/SidebarCard';
import { useEffect, useState } from 'preact/hooks';
import useAuthApi from '../../hooks/useApi';

const Home = () => {
	const [userInfo] = useContext(userContext);

	const [loading, data, error] = useAuthApi('/assignments', { method: 'get' });

	if (loading) {
		return <div>Loading...</div>
	}

	if (error) {
		console.log(error);
	}

	if (data) {
		console.log(data);
	}

	// HACK i don't know how to use position: sticky apparently
	const [sideSticky, setSideSticky] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 3.5 * parseFloat(getComputedStyle(document.documentElement).fontSize)) {
				setSideSticky(window.scrollY - 3.5 * parseFloat(getComputedStyle(document.documentElement).fontSize));
			} else {
				setSideSticky(0);
			}
		}
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		}
	}, [])

	// prevent rendering if user is not logged in
	if (!userInfo || Object.keys(userInfo).length === 0) { return <NotLoggedIn /> }

	return (
		<Grid class={style.home} container spacing={2} sx={{
			marginTop: "0",
		}}>
			<Grid item xs={12} md={3} sx={{
					minHeight: {
						xs: "unset",
						md: "100vh",
					},
					position: "relative",
					top: sideSticky,
					backgroundColor: "#212121",
					zIndex: 0
				}}>
					<Typography
						variant="h2"
						class={style.yourProjects}
						sx={{
							margin: "0 1rem 1rem 1rem"
						}}
					>Your projects</Typography>
					{
						userInfo["myProjects"].map((i) => {
							return (
								<SidebarCard name={i.name} numTest={i.numTest} grade={i.grade} key={i} />
							)
						})
					}
			</Grid>
			<Grid item xs={12} md={9}>
				<Typography
					variant="h2"
					class={style.yourProjects}
					sx={{
						margin: "0 1rem 1rem 1rem"
					}}
				>
					All projects
				</Typography>
				{
					data.map((i) => {
						return (
							<Projects name={i.name} numTest={i.numTest} grade={i.grade} key={i} description={i.description} />
						)
					})
				}
			</Grid>
		</Grid>
	);
};

const Projects = props => {
	return (
		<a href={
            `/project/${props.name.replaceAll(" ", "-").toLowerCase()}`
        } class={style.noUnderline}>
			<Card sx={{
				margin: "1em",
				width: "90%",
				backgroundColor: "#464646",
				border: "none"
			}}>
				<CardContent>
					<Box>
						<strong class={style.sidebarTitle}>{props.name}</strong>
					</Box>
					<Box sx={{
						// limit to 50 words then add ellipsis
						overflow: "hidden",
						textOverflow: "ellipsis",
						display: "-webkit-box",
						WebkitLineClamp: 1,
						WebkitBoxOrient: "vertical",
					}}>
						{props.description}
					</Box>
					<Box sx={{
						fontSize: "0.8rem",
					}}>
						{props.numTest} tests
					</Box>
				</CardContent>
			</Card>
		</a>
	)
}

export default Home;
