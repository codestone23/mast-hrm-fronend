"use client";

import React, { useState } from 'react';
import { FileText, Clock, Link as LinkIcon, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/common';
import {
  ReportList,
  ReportItem,
  ReportHeader,
  ReportTitle,
  ReportType,
  ReportMeta,
  ReportMetaItem,
  ReportDescription,
  EmptyState
} from './modals/modalStyles';

interface ReportData {
  id: string;
  title: string;
  type: string;
  link: string;
  workingHours: string;
  reportDate: string;
  description: string;
  date: string;
}

interface DailyReportsProps {
  reports?: ReportData[];
  onCreateReport?: () => void;
}

const DailyReports: React.FC<DailyReportsProps> = ({ reports = [], onCreateReport }) => {

  // Default sample data if no reports provided
  const defaultReports: ReportData[] = [
    {
      id: 'report_1',
      title: 'Báo cáo tiến độ dự án MAST',
      type: 'project',
      link: 'https://docs.google.com/document/d/example',
      workingHours: '120', // 2 hours in minutes
      reportDate: new Date().toISOString().split('T')[0],
      description: 'Hoàn thành phân tích yêu cầu và thiết kế database cho module quản lý nhân sự',
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: 'report_2',
      title: 'Báo cáo họp team',
      type: 'meeting',
      link: '',
      workingHours: '90', // 1.5 hours in minutes
      reportDate: new Date().toISOString().split('T')[0],
      description: 'Tham gia họp review sprint và lên kế hoạch cho sprint tiếp theo',
      date: new Date().toISOString().split('T')[0]
    }
  ];

  const displayReports = reports.length > 0 ? reports : defaultReports;

  const getTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'daily': 'Hàng ngày',
      'weekly': 'Hàng tuần',
      'monthly': 'Hàng tháng',
      'project': 'Dự án',
      'task': 'Công việc',
      'meeting': 'Họp',
      'other': 'Khác'
    };
    return typeMap[type] || type;
  };

  const handleCreateReport = (reportData: ReportData) => {
    // setReports(prev => [reportData, ...prev]);
  };

  const handleOpenCreateModal = () => {
    // setIsCreateModalOpen(true);
    if (onCreateReport) {
      onCreateReport();
    }
  };

  const formatWorkingHours = (workingHoursStr: string) => {
    const totalMinutes = parseInt(workingHoursStr);
    if (isNaN(totalMinutes) || totalMinutes === 0) return '0 phút';
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (totalMinutes < 60) {
      return `${minutes} phút`;
    } else if (minutes === 0) {
      return `${hours} giờ`;
    } else {
      return `${hours} giờ ${minutes} phút`;
    }
  };

  const todayReports = reports.filter(report => 
    report.date === new Date().toISOString().split('T')[0]
  );

  return (
    <>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Báo cáo hôm nay ({todayReports.length})
        </h3>
        <Button 
          variant="primary" 
          size="sm"
          onClick={handleOpenCreateModal}
        >
          <Plus size={16} />
          Tạo báo cáo
        </Button>
      </div>

      {todayReports.length === 0 ? (
        <EmptyState>
          <FileText size={48} />
          <h3>Chưa có báo cáo nào</h3>
          <p>Tạo báo cáo đầu tiên để theo dõi công việc của bạn</p>
        </EmptyState>
      ) : (
        <ReportList>
          {todayReports.map((report) => (
            <ReportItem key={report.id}>
              <ReportHeader>
                <ReportTitle>{report.title}</ReportTitle>
                <ReportType>{getTypeLabel(report.type)}</ReportType>
              </ReportHeader>
              
              <ReportMeta>
                <ReportMetaItem>
                  <Clock size={14} />
                  <span>{formatWorkingHours(report.workingHours)}</span>
                </ReportMetaItem>
                {report.link && (
                  <ReportMetaItem>
                    <LinkIcon size={14} />
                    <a 
                      href={report.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: 'var(--primary-600)', textDecoration: 'none' }}
                    >
                      Tài liệu
                    </a>
                  </ReportMetaItem>
                )}
              </ReportMeta>
              
              {report.description && (
                <ReportDescription>{report.description}</ReportDescription>
              )}
            </ReportItem>
          ))}
        </ReportList>
      )}

      {/* <CreateReportModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateReport}
      /> */}
    </>
  );
};

export default DailyReports;
