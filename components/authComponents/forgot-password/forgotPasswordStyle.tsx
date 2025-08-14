import styled from "styled-components";
import IMAGES from "@/config/images";

export const ForgotPasswordContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const LeftSection = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 3rem 2rem;
  border-right: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: inset -4px 0 8px rgba(0, 0, 0, 0.05);
  min-height: 100vh;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(241, 245, 249, 0.6) 100%);
    pointer-events: none;
  }
  
  @media (max-width: 1024px) {
    padding: 2.5rem 1.5rem;
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    border-right: none;
    border-bottom: 1px solid rgba(148, 163, 184, 0.2);
    box-shadow: inset 0 -4px 8px rgba(0, 0, 0, 0.05);
    min-height: auto;
    
    &::before {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(241, 245, 249, 0.6) 100%);
    }
  }
`;

export const RightSection = styled.div`
  flex: 2;
  background-image: url(${IMAGES.common.backgroundLogin.src});
  background-size: contain;
  background-color: #597596;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 1024px) {
    flex: 1;
  }
  
  @media (max-width: 768px) {
    min-height: 200px;
    flex: none;
  }
`;

export const RightContent = styled.div`
  text-align: center;
  color: #fff;
  z-index: 2;
  position: relative;
  
  h1 {
    font-size: 5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  p {
    font-size: 1.25rem;
    opacity: 0.9;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
`;

export const ForgotPasswordCard = styled.div`
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  position: relative;
  z-index: 1;
  
`;

export const Logo = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    border-radius: 2px;
  }
`;

export const LogoText = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.75rem;
  letter-spacing: -0.025em;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const LogoSubtext = styled.p`
  color: var(--text-secondary);
  font-size: 0.875rem;
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 0.5rem;
`;

export const Subtitle = styled.p`
  color: var(--text-secondary);
  font-size: 0.875rem;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const InputGroup = styled.div`
  position: relative;
`;

export const InputLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-left: 2.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: #fff;
  color: #000;

  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: var(--text-muted);
  }
`;

export const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  color: var(--text-muted);
  z-index: 1;
`;

export const SubmitButton = styled.button`
  width: 100%;
  background-color: var(--primary-500);
  color: white;
  font-weight: 600;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--primary-600);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  &:disabled {
    background-color: var(--text-muted);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const BackToLogin = styled.a`
  background-color: transparent;
  border: none;
  text-align: center;
  font-size: 0.875rem;
  color: var(--primary-500);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary-600);
    text-decoration: underline;
  }
`;

export const SuccessMessage = styled.div`
  background-color: var(--success-50);
  color: var(--success-600);
  padding: 0.75rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  border: 1px solid var(--success-100);
`;

export const ErrorMessage = styled.div`
  background-color: var(--error-50);
  color: var(--error-600);
  padding: 0.75rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  border: 1px solid var(--error-100);
`;
