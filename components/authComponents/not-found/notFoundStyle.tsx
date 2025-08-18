import styled from 'styled-components';

export const NotFoundContainer = styled.div`
  padding: 40px 0;
  background: #fff;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NotFoundRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 0 auto;
  padding: 0 20px;
`;

export const NotFoundContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

export const FourZeroFourBg = styled.div`
  background-image: url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif);
  height: 400px;
  width: 1200px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 80px;
    font-weight: bold;
    color: var(--text-primary);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
`;

export const ContentBox404 = styled.div`
  margin-top: -50px;
  text-align: center;
  
  h3 {
    font-size: 2rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
    line-height: 1.6;
  }
`;

export const Link404 = styled.a`
  cursor: pointer;
  color: #fff !important;
  padding: 12px 24px;
  background: var(--success-500);
  margin: 20px 0;
  display: inline-block;
  text-decoration: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
  
  &:hover {
    background: var(--success-600);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const NotFoundImage = styled.img`
  width: 100%;
  max-width: 500px;
  height: auto;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
`;