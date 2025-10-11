import styled from 'styled-components';

export const Container = styled.div``;

export const Header = styled.div`
  padding: 8px 0 12px 0;
  border-bottom: 1px solid var(--border);
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 1.05rem;
  color: var(--text-primary);
`;

export const Code = styled.div`
  color: var(--text-muted);
  font-size: 0.85rem;
`;

export const Body = styled.div`
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Row = styled.div`
  display: flex;
  gap: 24px;
`;

export const Col = styled.div`
  flex: 1;
`;

export const Label = styled.div`
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 8px;
`;

export const Value = styled.div`
  font-size: 0.95rem;
  color: var(--text-primary);
  padding: 4px 0 8px 0;
  border-bottom: 1px dashed rgba(0,0,0,0.04);
`;

export const PricesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
+  thead th {
    text-align: left;
+    padding: 8px 10px;
+    background: #f3f4f6;
+  }
+  tbody td { padding: 10px; border-top: 1px solid rgba(0,0,0,0.04); }
+
`;

export default {};

