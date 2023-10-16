import {
	createRouter,
	createWebHashHistory,
	NavigationGuardNext,
	RouteLocationNormalized,
} from "vue-router";
// import Home from "../pages/Home.vue";
// import Problem from "../components/Problem.vue";
// import Code from "../components/Code.vue";
// import Contests from "../pages/Contests.vue";
// import Contest from "../components/Contest.vue";
// import ContestRank from "../components/ContestRank.vue";
// import ProblemList from "../pages/ProblemList.vue";
// import Status from "../pages/Status.vue";
// import UserCenter from "../pages/UserCenter.vue";

import Admin from "./admin";
import { needLoginCertificate } from "./guard";
const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: "/",
			redirect: "/Home",
		},
		{
			path: "/Home",
			component: () => import("../pages/Home.vue"),
		},
		{
			path: "/Problems",
			component: () => import("../pages/Problems.vue"),
		},
		{
			path: "/Problem/:PID",
			name: "Problem",
			component: () => import("../pages/Problem.vue"),
		},
		{
			path: "/Problem/:PID/:CID",
			name: "ContestProblem",
			component: () => import("../pages/Problem.vue"),
		},
		{
			path: "/Solution",
			name: "Solution",
			component: () => import("../pages/Solution.vue"),
		},
		{
			path: "/Code",
			component: () => import("../pages/Code.vue"),
			beforeEnter: (
				to: RouteLocationNormalized,
				from: RouteLocationNormalized,
				next: NavigationGuardNext
			) => {
				if (needLoginCertificate()) next();
			},
		},
		{
			path: "/Contests",
			name: "Contests",
			component: () => import("../pages/Contests.vue"),
		},
		{
			path: "/Contest/:CID",
			name: "Contest",
			component: () => import("../pages/Contest.vue"),
		},
		{
			path: "/ContestRank/:CID",
			name: "ContestRank",
			component: () =>
				import("../pages/ContestChildren/ContestRank.vue"),
		},
		{
			path: "/ContestStatus",
			name: "ContestStatus",
			component: () =>
				import("../pages/ContestChildren/ContestStatus.vue"),
		},
		{
			path: "/Lists",
			component: () => import("../pages/Lists.vue"),
		},
		{
			path: "/List/:LID",
			name: "List",
			component: () => import("../pages/List.vue"),
		},
		{
			path:"/ListRank/:LID",
			name:"ListRank",
			component: () => import("../pages/ListChildren/ListRank.vue"),
		},
		{
			path: "/Status",
			component: () => import("../pages/Status.vue"),
		},
		{
			path: "/About",
			component: () => import("../pages/About.vue"),
		},
		{
			path: "/UserCenter",
			component: () => import("../pages/UserCenter.vue"),
			beforeEnter: (
				to: RouteLocationNormalized,
				from: RouteLocationNormalized,
				next: NavigationGuardNext
			) => {
				if (needLoginCertificate()) next();
			},
		},
		Admin,
	],
});

export default router;
