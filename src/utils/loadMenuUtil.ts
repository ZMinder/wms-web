import routers from "../router/router";
import axios from "axios";

function setRouter(menuList) {
    for (let menu of menuList) {
        let child = {
            path: "/" + menu.menuIndex,
            name: menu.menuName,
            component: () => import("../components/" + menu.menuComponent)
        }
        console.log(child)
        routers.addRoute("home", child)
    }
}

function loadMenu() {
    let promise = axios.get("http://localhost:8090/menu");
    promise.then(response => {
        if (response.data.code == 200) {
            setRouter(response.data.data)
        }
    }).catch(error => {
        console.log(error)
    })
}

export default loadMenu