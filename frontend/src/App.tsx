import { Routes ,Route} from "react-router";
import HomePage from "./page/Home/HomePage";
import AuthCallback from "./page/auth-callback/AuthCallback";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./page/chat/ChatPage";

const App = () => {
  //token =>

  return (
    <>
    <Routes>
      <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback
        signInForceRedirectUrl={"/auth-callback"}
      />}/>
      <Route path="/auth-callback" element={<AuthCallback/>}/>
      <Route element={<MainLayout/>}>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/chat" element={<ChatPage/>}/>
      </Route>
    </Routes>
    </>
  )
}

export default App

