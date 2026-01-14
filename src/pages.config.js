import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import ManageModules from './pages/ManageModules';
import ModuleView from './pages/ModuleView';
import Modules from './pages/Modules';
import VoiceVault from './pages/VoiceVault';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AdminDashboard": AdminDashboard,
    "Home": Home,
    "ManageModules": ManageModules,
    "ModuleView": ModuleView,
    "Modules": Modules,
    "VoiceVault": VoiceVault,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};