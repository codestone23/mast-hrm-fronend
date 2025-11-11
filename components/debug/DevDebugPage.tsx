'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useAppSelector } from '@/store/hooks';
import { enableConsoleLogs } from '@/store/middleware/logger';
import styled from 'styled-components';

const DebugContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  background: white;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  padding: 15px;
  font-size: 12px;
  z-index: 9999;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: monospace;
`;

const ToggleButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
  font-size: 11px;

  &:hover {
    background: #2563eb;
  }
`;

const Section = styled.div`
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.strong`
  color: #3b82f6;
  display: block;
  margin-bottom: 5px;
`;

const Value = styled.span`
  color: #6b7280;
  word-break: break-all;
`;

const ToggleSwitch = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 5px;
`;

const Switch = styled.input`
  margin-right: 5px;
`;

const CodeBlock = styled.pre`
  background: #f3f4f6;
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
  font-size: 11px;
`;

const DevDebugPage: React.FC = () => {
  const { user, isLoading, error, isInitialized } = useUser();
  const [isVisible, setIsVisible] = useState(true);
  const [consoleEnabled, setConsoleEnabled] = useState(false);
  const [enableReduxMonitor, setEnableReduxMonitor] = useState(false);
  const [reduxHistory, setReduxHistory] = useState<Array<{ timestamp: string; state: unknown }>>([]);
  const rootState = useAppSelector((state) => state);

  // Hook để theo dõi Redux state changes
  useEffect(() => {
    if (enableReduxMonitor) {
      setReduxHistory((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          state: JSON.parse(JSON.stringify(rootState)),
        },
      ]);
    }
  }, [rootState, enableReduxMonitor]);

  // Toggle console
  useEffect(() => {
    enableConsoleLogs(consoleEnabled);
  }, [consoleEnabled]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!isVisible) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 9999,
        }}
      >
        <button
          onClick={() => setIsVisible(true)}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Show Debug
        </button>
      </div>
    );
  }

  return (
    <DebugContainer>
      <ToggleButton onClick={() => setIsVisible(false)}>Hide Debug</ToggleButton>

      <Section>
        <Label>⚙️ Settings</Label>
        <ToggleSwitch>
          <Switch
            type="checkbox"
            checked={consoleEnabled}
            onChange={(e) => setConsoleEnabled(e.target.checked)}
          />
          Enable Console Logs
        </ToggleSwitch>
        <ToggleSwitch>
          <Switch
            type="checkbox"
            checked={enableReduxMonitor}
            onChange={(e) => setEnableReduxMonitor(e.target.checked)}
          />
          Monitor Redux Changes
        </ToggleSwitch>
        {enableReduxMonitor && (
          <button
            onClick={() => setReduxHistory([])}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '3px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '10px',
              marginTop: '5px',
            }}
          >
            Clear History
          </button>
        )}
      </Section>

      <Section>
        <Label>📊 Current State</Label>
        <Value>Loading: {isLoading ? 'Yes' : 'No'}</Value>
        <Value>Initialized: {isInitialized ? 'Yes' : 'No'}</Value>
        <Value>Error: {error || 'None'}</Value>
        <Value>User ID: {user?.id || 'None'}</Value>
        <Value>User Name: {user?.name || 'None'}</Value>
        <Value>User Role: {user?.role_assignments?.map((role) => role.name).join(", ") || 'None'}</Value>
      </Section>

      <Section>
        <Label>💾 Redux State</Label>
        <CodeBlock>{JSON.stringify(rootState, null, 2)}</CodeBlock>
      </Section>

      {enableReduxMonitor && reduxHistory.length > 0 && (
        <Section>
          <Label>📜 Change History ({reduxHistory.length} entries)</Label>
          {reduxHistory.slice(-5).map((entry, index) => (
            <CodeBlock key={index}>
              <strong>{entry.timestamp}</strong>
              {JSON.stringify(entry.state, null, 2)}
            </CodeBlock>
          ))}
        </Section>
      )}
    </DebugContainer>
  );
};

export default DevDebugPage;
