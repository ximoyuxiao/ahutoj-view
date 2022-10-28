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
			path: "/Problem",
			component: () => import("../components/Problem.vue"),
		},
		{
			path: "/Code",
			component: () => import("../components/Code.vue"),
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
			component: () => import("../pages/Contests.vue"),
		},
		{
			path: "/Contest",
			component: () => import("../components/Contest.vue"),
		},
		{
			path: "/ContestRank",
			component: () => import("../components/ContestRank.vue"),
		},
		{
			path: "/ProblemList",
			component: () => import("../pages/ProblemList.vue"),
		},
		{
			path: "/Status",
			component: () => import("../pages/Status.vue"),
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

//路由跳转后回到页面顶端
router.afterEach((to, from, next) => {
	window.scrollTo(0, 0);
});

export default router;
