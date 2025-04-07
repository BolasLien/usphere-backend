import supabase from "../utils/db";
import * as userService from "./userService";
import { User } from "../types/models";

interface AuthError {
  status: number;
  message: string;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    pic: string;
  };
}

interface UserProfile {
  id: string;
  name: string;
  pic: string;
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  if (!email || !password) {
    throw { status: 400, message: "Email 與密碼必填" } as AuthError;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw { status: 401, message: "帳號或密碼錯誤" } as AuthError;
  }

  const user = await userService.getUserById(data.user.id);

  if (!user) {
    throw { status: 404, message: "找不到使用者資料" } as AuthError;
  }

  return {
    access_token: data.session.access_token,
    user: {
      id: user.id,
      name: user.display_name || '',
      pic: user.profile_pic_url || '',
    },
  };
};

export const logoutUser = async (access_token: string | undefined): Promise<void> => {
  if (!access_token) {
    throw { status: 400, message: "缺少訪問令牌" } as AuthError;
  }

  const { error } = await supabase.auth.admin.signOut(access_token);

  if (error) {
    throw { status: 500, message: "登出失敗" } as AuthError;
  }
};

export const whoami = async (userId: string): Promise<UserProfile> => {
  const user = await userService.getUserById(userId);

  if (!user) {
    throw { status: 404, message: "使用者資料不存在" } as AuthError;
  }

  return {
    id: user.id,
    name: user.display_name || '',
    pic: user.profile_pic_url || '',
  };
};
