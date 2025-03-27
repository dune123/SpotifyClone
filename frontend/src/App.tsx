import { Routes ,Route} from "react-router";
import HomePage from "./page/Home/HomePage";
import AuthCallback from "./page/auth-callback/AuthCallback";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./page/chat/ChatPage";
import AlbumPage from "./page/album/AlbumPage";
import AdminPage from "./page/admin/AdminPage";
import { Toaster } from "react-hot-toast";

const App = () => {
  //token =>

  return (
    <>
    <Routes>
      <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback
        signInForceRedirectUrl={"/auth-callback"}
      />}/>
      <Route path="/auth-callback" element={<AuthCallback/>}/>
      <Route path="/admin" element={<AdminPage/>}/>
      <Route element={<MainLayout/>}>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/chat" element={<ChatPage/>}/>
        <Route path="/albums/:albumId" element={<AlbumPage/>}/>
      </Route>
    </Routes>
    <Toaster />
    </>
  )
}

export default App

