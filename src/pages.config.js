import Home from './pages/Home';
import ManageModules from './pages/ManageModules';
import ModuleView from './pages/ModuleView';
import Modules from './pages/Modules';
import AdminDashboard from './pages/AdminDashboard';
import VoiceVault from './pages/VoiceVault';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "ManageModules": ManageModules,
    "ModuleView": ModuleView,
    "Modules": Modules,
    "AdminDashboard": AdminDashboard,
    "VoiceVault": VoiceVault,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};