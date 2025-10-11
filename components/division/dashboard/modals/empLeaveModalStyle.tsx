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
	padding: 8px 4px;
	border-bottom: 1px solid rgba(2,6,23,0.06);
`;

export const Avatar = styled.img`
	width: 40px;
	height: 40px;
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
	font-weight: 600;
	color: #0f172a;
`;

export const Meta = styled.div`
	font-size: 13px;
	color: rgba(2,6,23,0.5);
`;

export const RightCol = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 6px;
	min-width: 160px;
`;

export const TimeText = styled.div`
	color: rgba(2,6,23,0.7);
	font-size: 14px;
	text-align: right;
	white-space: pre-line;
`;

export const Status = styled.div<{ allowed?: boolean }>`
	font-weight: 600;
	color: ${p => (p.allowed ? '#059669' : '#dc2626')};
`;

export default {};
