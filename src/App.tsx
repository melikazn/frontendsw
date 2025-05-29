import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/guest/Register";
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/layouts/AdminLayout";

import AdminVocabulary from "./pages/admin/AdminVocabulary";


import AdminDashboard from "./pages/admin/AdminDashboard";
import { ProtectedAdminRoute, ProtectedUserRoute } from "./routes/ProtectedRoutes";
import VocabularyList from "./pages/admin/VocabularyList";
import VocabularyDetail from "./pages/admin/VocabularyDetail";
import AddVocabulary from "./pages/admin/AddVocabulary";
import AddCategory from "./pages/admin/AddCategory";
import AddSection from "./pages/admin/AddSection";
import SectionList from "./pages/admin/SectionList";
import UploadVideo from "./pages/admin/UploadVideo";


import AddQuestions from "./pages/admin/AddQuestions";
import CreateTest from "./pages/admin/CreateTest";
import SectionTests from "./pages/admin/SectionTests";


import AdminForum from "./pages/admin/AdminForum";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminUserList from "./pages/admin/AdminUserList";

import UserProfile from "./pages/user/UserProfilePage";
import UserLayout from "./components/layouts/UserLayout";
import UserVocabulary from "./pages/user/UserVocabularyPage";
import UserVocabularyOverview from "./pages/user/UserVocabularyOverviewPage";
import UserVocabularyAlphabet from "./pages/user/UserVocabularyAlphabetPage";
import UserVocabularyDetail from "./pages/user/UserVocabularyDetailPage";
import UserFavorites from "./pages/user/UserFavoritesWordsPage";
import UserCategoryList from "./pages/user/UserCategoryList";


import UserTestStart from "./pages/user/UserTestStart";
import UserTestResults from "./pages/user/UserTestResults";
import LevelSelect from "./pages/user/LevelSelect";
import UserForum from "./pages/user/UserForum";

import UserMessages from "./pages/user/UserMessages";
import UserSendMessage from "./pages/user/UserSendMessages";
import UserMessageOverview from "./pages/user/UserMessageOverviewPage";
import UserMessageThread from "./pages/user/UserMessageThread";
import AdminMessageThread from "./pages/admin/AdminMessageThread";
import AdminSendGlobalMessage from "./pages/admin/AdminSendGlobalMessage";
import AdminMyMessages from "./pages/admin/AdminMyMessages";

import UserDashboard from "./pages/user/UserDashboard";
import VocabularyQuizPage from "./pages/user/VocabularyQuizPage";

import SectionVideoList from "./pages/admin/SectionVideoList";
import VideoLevels from "./pages/user/VideoLevels";
import VideosByLevel from "./pages/user/VideosByLevel";
import UserFavoriteVideos from "./pages/user/UserFavoriteVideosPage";
import HomePage from "./pages/guest/HomePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@material-tailwind/react";
import Contact from "./pages/guest/Contact";
import GuestVocabularyOverview from "./pages/guest/GuestVocabularyOverview";
import GuestVocabularyAlphabet from "./pages/guest/GuestVocabularyAlphabet";
import GuestVocabularyDetail from "./pages/guest/GuestVocabularyDetail";
import GuestVocabulary from "./pages/guest/GuestVocabulary";
import UserSectionList from "./pages/user/UserSectionList";
import CategoryList from "./pages/admin/CategoryList";

function App() {
  return (
        <ThemeProvider>
    <Router>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/kontakt" element={<Contact />} />

            {/* ❗ Ordförråd – synligt för alla */}

          <Route path="/guestvocabulary" element={<GuestVocabularyOverview />} />
          <Route path="/guestvocabulary/:level" element={<GuestVocabularyAlphabet />} />
          <Route path="/guestvocabulary/:level/:letter" element={<GuestVocabulary />} />
          <Route path="/guestvocabulary/detail/:id" element={<GuestVocabularyDetail />} />
          

        <Route
          path="/dashboard"
          element={
            <ProtectedUserRoute>
              <UserLayout />
            </ProtectedUserRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="" element={<UserDashboard />} />

          {/* Profil & inställningar */}
          <Route path="profile" element={<UserProfile />} />

          {/* Ordförråd */}
          <Route path="vocabulary-quiz" element={<VocabularyQuizPage />} />

            {/* ❗ Ordförråd – synligt för inloggade */}
          <Route path="vocabulary" element={<UserVocabularyOverview />} />
          <Route path="vocabulary/:level" element={<UserVocabularyAlphabet />} />
          <Route path="vocabulary/:level/:letter" element={<UserVocabulary />} />
          <Route path="vocabulary/detail/:id" element={<UserVocabularyDetail />} />

          {/* Tester */}
          <Route path="tests" element={<LevelSelect />} />
          <Route path="tests/:level" element={<UserCategoryList />} />
          <Route path="tests/:level/:id/sections" element={<UserSectionList />} />

          <Route path="tests/:testId/start" element={<UserTestStart />} />
          <Route path="results" element={<UserTestResults />} />

          {/* Kategorier & sektioner */}
          <Route path="categories" element={<UserCategoryList />} />


          {/* Forum */}
          <Route path="forum" element={<UserForum />} />


          {/* Meddelanden */}
          <Route path="messages" element={<UserMessageOverview />} />
          <Route path="messages/send" element={<UserSendMessage />} />
          <Route path="messages/list" element={<UserMessages />} />
          <Route path="messages/thread/:messageId" element={<UserMessageThread />} />


          {/* Notifikationer */}

        <Route path="videos" element={<VideoLevels />} />
        <Route path="videos/by-level/:level" element={<VideosByLevel />} />
        <Route path="favorites/videos" element={<UserFavoriteVideos />} />


          {/* Favoriter */}
          <Route path="favorites" element={<UserFavorites />} />
        </Route>


        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >

          <Route path="vocabulary" element={<AdminVocabulary />} />
          <Route path="vocabulary/add" element={<AddVocabulary />} />
          <Route path="vocabulary/:level/:letter" element={<VocabularyList />} />
          <Route path="vocabulary/detail/:id" element={<VocabularyDetail />} />
          <Route path="categories/add" element={<AddCategory/>} />
          <Route path="categories" element={< CategoryList/>} />
          <Route path="sections/add" element={<AddSection />} />
          <Route path="sections" element={<SectionList />} />
      

          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="videos/upload" element={<UploadVideo />} />
          <Route path="sections/:id/videos" element={<SectionVideoList />} />

          <Route path="tests/:testId/questions" element={<AddQuestions />} />
          <Route path="tests/create" element={<CreateTest />} />
          <Route path="sections/:id/tests" element={<SectionTests />} />


          <Route path="forum" element={<AdminForum />} />
          <Route path="users" element={<AdminUserList />} />

          <Route path="messages" element={<AdminMessages />} />
          <Route path="messages/send-global" element={<AdminSendGlobalMessage />} />
          <Route path="messages/my" element={<AdminMyMessages />} />
          <Route path="messages/thread/:messageId" element={<AdminMessageThread />} />

        </Route>
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
