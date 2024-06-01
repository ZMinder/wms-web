import routers from "../router/router";
import axios from "axios";

export function setRouter(menuList) {
    for (let menu of menuList) {
        let child = {
            path: "/" + menu.menuIndex,
            name: menu.menuName,
            component: () => import("../components/" + menu.menuComponent)
        }
        // console.log(child)
        routers.addRoute("home", child)
    }
}

async function loadMenu() {
    try {
        let response = await axios.get("http://localhost:8090/menu");
        if (response.data.code == 200) {
            setRouter(response.data.data)
        }
    } catch (error) {
        console.log(error)
    }
}

export default loadMenu