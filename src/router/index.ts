import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Problems from "../pages/Problems.vue";
import Problem from "../components/Problem.vue";
import Code from "../components/Code.vue";
import Contests from "../pages/Contests.vue";
import Contest from "../components/Contest.vue";
import ContestRank from "../components/ContestRank.vue";
import ProblemList from "../pages/ProblemList.vue";
import Status from "../pages/Status.vue";
import UserCenter from "../pages/UserCenter.vue";
import Admin from "../pages/Admin.vue";
import ProblemEdit from "../components/Admin/ProblemEdit.vue";
import AddProblem from "../components/Admin/ProblemEditChildren/AddProblem.vue";
import UpdateProblem from "../components/Admin/ProblemEditChildren/UpdateProblem.vue";
import ContestEdit from "../components/Admin/ContestEdit.vue";
import AddContest from "../components/Admin/ContestEditChildren/AddContest.vue";
import UpdateContest from "../components/Admin/ContestEditChildren/UpdateContest.vue";
import ListEdit from "../components/Admin/ListEdit.vue";
import AddList from "../components/Admin/ListEditChildren/AddList.vue";
import UpdateList from "../components/Admin/ListEditChildren/UpdateList.vue";
import UserEdit from "../components/Admin/UserEdit.vue";
import AddUser from "../components/Admin/UserEditChildren/AddUser.vue";
import BatchAddUser from "../components/Admin/UserEditChildren/BatchAddUser.vue";
import UpdateUser from "../components/Admin/UserEditChildren/UpdateUser.vue";
import AdminEdit from "../components/Admin/AdminEdit.vue";
import AddAdmin from "../components/Admin/AdminEditChildren/AddAdmin.vue";
import UpdateAdmin from "../components/Admin/AdminEditChildren/UpdateAdmin.vue";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: "/",
			redirect: "/Home",
		},
		{
			path: "/Home",
			component: Home,
		},
		{
			path: "/Problems",
			component: Problems,
		},
		{
			path: "/Problem",
			component: Problem,
		},
		{
			path: "/Code",
			component: Code,
		},
		{
			path: "/Contests",
			component: Contests,
		},
		{
			path: "/Contest",
			component: Contest,
		},
		{
			path: "/ContestRank",
			component: ContestRank,
		},
		{
			path: "/ProblemList",
			component: ProblemList,
		},
		{
			path: "/Status",
			component: Status,
		},
		{
			path: "/UserCenter",
			component: UserCenter,
		},
		{
			path: "/Admin",
			component: Admin,
			children: [
				{
					path: "ProblemEdit",
					component: ProblemEdit,
					redirect: "/Admin/ProblemEdit/AddProblem",
					children: [
						{
							path: "AddProblem",
							component: AddProblem,
						},
						{
							path: "UpdateProblem",
							component: UpdateProblem,
						},
					],
				},
				{
					path: "ContestEdit",
					component: ContestEdit,
					redirect: "/Admin/ContestEdit/AddContest",
					children: [
						{
							path: "AddContest",
							component: AddContest,
						},
						{
							path: "UpdateContest",
							component: UpdateContest,
						},
					],
				},
				{
					path: "ListEdit",
					component: ListEdit,
					children: [
						{
							path: "AddList",
							component: AddList,
						},
						{
							path: "UpdateList",
							component: UpdateList,
						},
					],
				},
				{
					path: "UserEdit",
					component: UserEdit,
					redirect: "/Admin/UserEdit/AddUser",
					children: [
						{
							path: "AddUser",
							component: AddUser,
						},
						{
							path: "BatchAddUser",
							component: BatchAddUser,
						},
						{
							path: "UpdateUser",
							component: UpdateUser,
						},
					],
				},
				{
					path: "AdminEdit",
					component: AdminEdit,
					children: [
						{
							path: "AddAdmin",
							component: AddAdmin,
						},
						{
							path: "UpdateAdmin",
							component: UpdateAdmin,
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
