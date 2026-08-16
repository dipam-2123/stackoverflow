import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import {AppwriteException, ID, Models, OAuthProvider} from "appwrite"
import { account } from "@/models/client/config";


export interface UserPrefs {
  reputation: number
}

interface IAuthStore {
  session: Models.Session | null;
  jwt: string | null
  user: Models.User<UserPrefs> | null
  hydrated: boolean

  setHydrated(): void;
  verfiySession(): Promise<void>;
  login(
    email: string,
    password: string
  ): Promise<
  {
    success: boolean;
    error?: AppwriteException| null
  }>
  createAccount(
    name: string,
    email: string,
    password: string
  ): Promise<
  {
    success: boolean;
    error?: AppwriteException| null
  }>
  loginWithOAuth(provider: "google" | "github"): void
  logout(): Promise<void>
}


export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated() {
        set({hydrated: true})
      },

      async verfiySession() {
        try {
          const session = await account.getSession("current")
          let user = await account.get<UserPrefs>()

          // OAuth signups never go through login(), so seed reputation here.
          if (!user.prefs?.reputation) {
            await account.updatePrefs<UserPrefs>({reputation: 0})
            user = await account.get<UserPrefs>()
          }

          set({session, user})

        } catch (error) {
          // Session is invalid/expired — clear the persisted user so the UI
          // doesn't keep showing a logged-in state that Appwrite rejects.
          console.log(error)
          set({session: null, jwt: null, user: null})
        }
      },

      async login(email: string, password: string) {
        try {
          const session = await account.createEmailPasswordSession(email, password)
          const [user, {jwt}] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT()

          ])
          if (!user.prefs?.reputation) await account.updatePrefs<UserPrefs>({
            reputation: 0
          })

          set({session, user, jwt})
          
          return { success: true}

        } catch (error) {

          console.log(error)
          return {
            success: false,
            error: error instanceof AppwriteException ? error: null,
            
          }
        }
      },

      async createAccount(name:string, email: string, password: string) {
        try {
          await account.create(ID.unique(), email, password, name)
          return {success: true}
        } catch (error) {
          console.log(error)
          return {
            success: false,
            error: error instanceof AppwriteException ? error: null,
            
          }
        }
      },

      loginWithOAuth(provider: "google" | "github") {
        // Appwrite handles the OAuth flow via a full-page redirect. On success
        // the user lands back on "/" with a session cookie already set; on
        // failure they're sent back to the login page.
        const origin = window.location.origin

        account.createOAuth2Session(
          provider === "google" ? OAuthProvider.Google : OAuthProvider.Github,
          `${origin}/`,
          `${origin}/login`
        )
      },

      async logout() {
        try {
          await account.deleteSessions()
          set({session: null, jwt: null, user: null})

        } catch (error) {
          console.log(error)
        }
      },
    })),
    {
      name: "auth",
      onRehydrateStorage(){
        return (state, error) => {
          if (!error) state?.setHydrated()
        }
      }
    }
  )
)