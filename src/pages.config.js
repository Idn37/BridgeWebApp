import Home from './pages/Home';
import ModuleView from './pages/ModuleView';
import Modules from './pages/Modules';
import TrainerDashboard from './pages/TrainerDashboard';
import ManageModules from './pages/ManageModules';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "ModuleView": ModuleView,
    "Modules": Modules,
    "TrainerDashboard": TrainerDashboard,
    "ManageModules": ManageModules,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};