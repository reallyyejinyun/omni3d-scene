import { createBrowserRouter, Navigate } from 'react-router-dom';
import PortalView from '@/views/Portal/PortalView';
import LoginView from '@/views/Login/LoginView';
import DashboardView from '@/views/Dashboard/DashboardView';
import EditorView from '@/views/Editor/EditorView';
import Previewer from '@/views/Previewer';
import AssetManagementView from '@/views/AssetManagementView/AssetManagementView';
import ProjectList from '@/views/ProjectList/ProjectList';
import DataSourceManagementView from '@/views/DataSourceManagement/DataSourceManagementView';

export const router = createBrowserRouter([
    {
        path: '/',
        // element: <PortalView />,
        element: <Navigate to="/dashboard" replace />,
    },
    {
        path: '/login',
        element: <LoginView />,
    },
    {
        path: '/dashboard',
        element: <DashboardView />,
        children: [
            {
                index: true,
                element: <Navigate to="projects" replace />,
            },
            {
                path: 'projects',
                element: <ProjectList />,
            },
            {
                path: 'assets',
                element: <AssetManagementView />,
            },
            {
                path: 'datasource',
                element: <DataSourceManagementView />,
            },
        ],
    },
    {
        path: '/editor/:id',
        element: <EditorView />,
    },
    {
        path: '/preview/:id',
        element: <Previewer />,
    },
    {
        path: '/preview',
        element: <Previewer />,
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);
