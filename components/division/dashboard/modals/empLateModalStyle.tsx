import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const DateLabel = styled.div`
  font-weight: 600;
  color: #0f172a;
  padding: 0 4px;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 8px;
  border-bottom: 1px solid rgba(2,6,23,0.06);
`;

export const Avatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const Name = styled.div`
  font-weight: 700;
  color: #0f172a;
`;

export const Meta = styled.div`
  font-size: 13px;
  color: rgba(2,6,23,0.5);
`;

export const RightCol = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 80px;
`;

export const Minutes = styled.div`
  font-weight: 700;
  color: #0b2340;
`;

export default {};
