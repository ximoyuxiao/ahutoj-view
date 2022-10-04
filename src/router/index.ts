import { createRouter, createWebHashHistory } from "vue-router";
// import Home from "../pages/Home.vue";
// import Problem from "../components/Problem.vue";
// import Code from "../components/Code.vue";
// import Contests from "../pages/Contests.vue";
// import Contest from "../components/Contest.vue";
// import ContestRank from "../components/ContestRank.vue";
// import ProblemList from "../pages/ProblemList.vue";
// import Status from "../pages/Status.vue";
// import UserCenter from "../pages/UserCenter.vue";
// import Admin from "../pages/Admin.vue";
// import ProblemEdit from "../components/Admin/ProblemEdit.vue";
// import AddProblem from "../components/Admin/ProblemEditChildren/AddProblem.vue";
// import UpdateProblem from "../components/Admin/ProblemEditChildren/UpdateProblem.vue";
// import EditProblemJudgeFile from "../components/Admin/ProblemEditChildren/EditProblemJudgeFile.vue";
// import ContestEdit from "../components/Admin/ContestEdit.vue";
// import AddContest from "../components/Admin/ContestEditChildren/AddContest.vue";
// import UpdateContest from "../components/Admin/ContestEditChildren/UpdateContest.vue";
// import ListEdit from "../components/Admin/ListEdit.vue";
// import AddList from "../components/Admin/ListEditChildren/AddList.vue";
// import UpdateList from "../components/Admin/ListEditChildren/UpdateList.vue";
// import UserEdit from "../components/Admin/UserEdit.vue";
// import AddUser from "../components/Admin/UserEditChildren/AddUser.vue";
// import BatchAddUser from "../components/Admin/UserEditChildren/BatchAddUser.vue";
// import UpdateUser from "../components/Admin/UserEditChildren/UpdateUser.vue";
// import AdminEdit from "../components/Admin/AdminEdit.vue";
// import AddAdmin from "../components/Admin/AdminEditChildren/AddAdmin.vue";
// import UpdateAdmin from "../components/Admin/AdminEditChildren/UpdateAdmin.vue";

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
		},
		{
			path: "/Admin",
			component: () => import("../pages/Admin.vue"),
			children: [
				{
					path: "ProblemEdit",
					component: () =>
						import("../components/Admin/ProblemEdit.vue"),
					redirect: "/Admin/ProblemEdit/AddProblem",
					children: [
						{
							path: "AddProblem",
							component: () =>
								import(
									"../components/Admin/ProblemEditChildren/AddProblem.vue"
								),
						},
						{
							path: "UpdateProblem",
							component: () =>
								import(
									"../components/Admin/ProblemEditChildren/UpdateProblem.vue"
								),
						},
						{
							path: "EditProblemJudgeFile",
							component: () =>
								import(
									"../components/Admin/ProblemEditChildren/EditProblemJudgeFile.vue"
								),
						},
					],
				},
				{
					path: "ContestEdit",
					component: () =>
						import("../components/Admin/ContestEdit.vue"),
					redirect: "/Admin/ContestEdit/AddContest",
					children: [
						{
							path: "AddContest",
							component: () =>
								import(
									"../components/Admin/ContestEditChildren/AddContest.vue"
								),
						},
						{
							path: "UpdateContest",
							component: () =>
								import(
									"../components/Admin/ContestEditChildren/UpdateContest.vue"
								),
						},
					],
				},
				{
					path: "ListEdit",
					component: () => import("../components/Admin/ListEdit.vue"),
					redirect: "Admin/ListEdit/AddList",
					children: [
						{
							path: "AddList",
							component: () =>
								import(
									"../components/Admin/ListEditChildren/AddList.vue"
								),
						},
						{
							path: "UpdateList",
							component: () =>
								import(
									"../components/Admin/ListEditChildren/UpdateList.vue"
								),
						},
					],
				},
				{
					path: "UserEdit",
					component: () => import("../components/Admin/UserEdit.vue"),
					redirect: "/Admin/UserEdit/AddUser",
					children: [
						{
							path: "AddUser",
							component: () =>
								import(
									"../components/Admin/UserEditChildren/AddUser.vue"
								),
						},
						{
							path: "BatchAddUser",
							component: () =>
								import(
									"../components/Admin/UserEditChildren/BatchAddUser.vue"
								),
						},
						{
							path: "UpdateUser",
							component: () =>
								import(
									"../components/Admin/UserEditChildren/UpdateUser.vue"
								),
						},
					],
				},
				{
					path: "AdminEdit",
					component: () =>
						import("../components/Admin/AdminEdit.vue"),
					redirect: "/Admin/AdminEdit/AddAdmin",
					children: [
						{
							path: "AddAdmin",
							component: () =>
								import(
									"../components/Admin/AdminEditChildren/AddAdmin.vue"
								),
						},
						{
							path: "UpdateAdmin",
							component: () =>
								import(
									"../components/Admin/AdminEditChildren/UpdateAdmin.vue"
								),
						},
					],
				},
			],
		},
	],
});

//路由跳转后回到页面顶端
router.afterEach((to, from, next) => {
	window.scrollTo(0, 0);
});

export default router;
