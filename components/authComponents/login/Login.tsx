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
import { useLogin } from "./useLogin";

interface LoginProps {
  onForgotPassword: () => void;
}

interface LoginFormData {
  username: string;
  password: string;
}

const Login = (props: LoginProps) => {
  const { onForgotPassword } = props;
  const [showPassword, setShowPassword] = useState(false);

  const { loginMutation, isLoading, setIsLoading } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
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

    loginMutation.mutate(data);
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
                      value: 8,
                      message: "Mật khẩu phải có ít nhất 8 ký tự",
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
