import { Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/Login';
import SignupPage from '../pages/Signup';
import HomePage from '../pages/Home';
import ExplorePage from '../pages/Explore';
import { Write } from '../pages/Write';
import AuthInitializer from '../hooks/AuthInitaliser';
import { ProtectedRoute } from './protectedRoute';
import { PublicRoute } from './publicRoute';
import NavbarLayout from '../components/NavbarLayout';
import React from 'react';
import ForgotPasswordPage from '../pages/ForgotPassword';
import ProfilePage from '../pages/ProfilePage';
import ArticleReader from '../pages/ArticleReader';
import MyArticles from '../pages/MyArticle';
import EditArticle from '../pages/EditArticle';
import NotFound from '../pages/PagenNotFound';

const AppRoute: React.FC = () => {
  return (
    <AuthInitializer>
      <Routes>

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        </Route>


        <Route element={<NavbarLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/trending" element={<div>Trending Page</div>} />
          <Route path="/article/:id" element={<ArticleReader />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/saved" element={<div>Saved Page</div>} />
            <Route path="/settings" element={<div>Settings Page</div>} />
            <Route path="/write" element={<Write />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-articles" element={<MyArticles />} />
            <Route path="/edit-article/:id" element={<EditArticle />} />
          </Route>
          <Route path="*" element={<NotFound />} />


        </Route>
      </Routes>
    </AuthInitializer>
  );
};

export default AppRoute;