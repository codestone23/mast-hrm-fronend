"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import {
  LoginContainer,
  LeftSection,
  LeftContent,
  RightSection,
  LoginCard,
  Logo,
  LogoText,
  LogoSubtext,
  Form,
  InputGroup,
  InputLabel,
  InputWrapper,
  InputIcon,
  PasswordToggle,
  LoginButton,
  ForgotPassword,
  ErrorMessage,
  Input,
} from "./loginStyle";
import { useRouter } from "next/navigation";

interface LoginProps {
  onForgotPassword: () => void;
}

interface LoginFormData {
  username: string;
  password: string;
}

const Login = (props: LoginProps) => {
  const { onForgotPassword } = props;
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    clearErrors();

    router.push("/overview");
    return;

    // try {
    //   if (data.username === "admin" && data.password === "Password@123") {
    //     router.push("/overview");
    //   } else {
    //     setError("root", {
    //       type: "manual",
    //       message: "Tên đăng nhập hoặc mật khẩu không đúng",
    //     });
    //   }
    // } catch {
    //   setError("root", {
    //     type: "manual",
    //     message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <LoginContainer>
      <LeftSection>
        <LeftContent>
          <h1>MAST HRM</h1>
          <p>Hệ thống quản lý nhân sự hiện đại</p>
        </LeftContent>
      </LeftSection>

      <RightSection>
        <LoginCard>
          <Logo>
            <LogoText>MAST</LogoText>
            <LogoSubtext>Hệ thống quản lý nhân sự</LogoSubtext>
          </Logo>

          <Form onSubmit={handleSubmit(onSubmit)}>
            {errors.root && <ErrorMessage>{errors.root.message}</ErrorMessage>}

            <InputGroup>
              <InputLabel htmlFor="username">Tên đăng nhập</InputLabel>
              <InputWrapper>
                <InputIcon>
                  <User size={16} />
                </InputIcon>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  {...register("username", {
                    required: "Vui lòng nhập tên đăng nhập",
                    minLength: {
                      value: 3,
                      message: "Tên đăng nhập phải có ít nhất 3 ký tự",
                    },
                  })}
                />
              </InputWrapper>
              {errors.username && (
                <ErrorMessage>{errors.username.message}</ErrorMessage>
              )}
            </InputGroup>

            <InputGroup>
              <InputLabel htmlFor="password">Mật khẩu</InputLabel>
              <InputWrapper>
                <InputIcon>
                  <Lock size={16} />
                </InputIcon>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  {...register("password", {
                    required: "Vui lòng nhập mật khẩu",
                    minLength: {
                      value: 6,
                      message: "Mật khẩu phải có ít nhất 6 ký tự",
                    },
                  })}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </PasswordToggle>
              </InputWrapper>
              {errors.password && (
                <ErrorMessage>{errors.password.message}</ErrorMessage>
              )}
            </InputGroup>

            <LoginButton type="submit" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </LoginButton>

            <ForgotPassword
              as="button"
              type="button"
              onClick={onForgotPassword}
            >
              Quên mật khẩu?
            </ForgotPassword>
          </Form>
        </LoginCard>
      </RightSection>
    </LoginContainer>
  );
};

export default Login;
