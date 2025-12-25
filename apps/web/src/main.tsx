import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { LanguageProvider } from './components/LanguageContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Tests from './pages/Tests';
import RunTest from './pages/RunTest';
import Results from './pages/Results';
import ResultDetail from './pages/ResultDetail';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminTestsCrud from './pages/admin/TestsCrud';
import AdminQuestionsCrud from './pages/admin/QuestionsCrud';
import AdminImportExport from './pages/admin/ImportExport';
import AdminSyncTests from './pages/admin/SyncTests';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <LanguageProvider>
                <AuthProvider>
                    <Layout>
                        <Routes>
                            {/* Public routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/tests" element={<Tests />} />

                            {/* Protected user routes */}
                            <Route path="/test/:id" element={
                                <ProtectedRoute>
                                    <RunTest />
                                </ProtectedRoute>
                            } />
                            <Route path="/results" element={
                                <ProtectedRoute>
                                    <Results />
                                </ProtectedRoute>
                            } />
                            <Route path="/results/:id" element={
                                <ProtectedRoute>
                                    <ResultDetail />
                                </ProtectedRoute>
                            } />

                            {/* Admin routes */}
                            <Route path="/admin" element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            } />
                            <Route path="/admin/tests" element={
                                <AdminRoute>
                                    <AdminTestsCrud />
                                </AdminRoute>
                            } />
                            <Route path="/admin/tests/:testId/questions" element={
                                <AdminRoute>
                                    <AdminQuestionsCrud />
                                </AdminRoute>
                            } />
                            <Route path="/admin/import-export" element={
                                <AdminRoute>
                                    <AdminImportExport />
                                </AdminRoute>
                            } />
                            <Route path="/admin/sync" element={
                                <AdminRoute>
                                    <AdminSyncTests />
                                </AdminRoute>
                            } />
                        </Routes>
                    </Layout>
                </AuthProvider>
            </LanguageProvider>
        </BrowserRouter>
    </React.StrictMode>
);
