"use client";

import React from 'react';
import { 
  Calendar, 
  Users, 
  Clock, 
  Target,
  FileText,
  CheckCircle,
  AlertCircle,
  Pause,
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  Star,
  Download
} from 'lucide-react';
import { Breadcrumb, BreadcrumbItemData } from '@/components/common';
import {
  ProjectDetailContainer,
  ProjectDetailHeader,
  ProjectDetailTitle,
  ProjectDetailMeta,
  ProjectDetailGrid,
  ProjectDetailCard,
  CardHeader,
  CardTitle,
  CardIcon,
  ProjectOverview,
  ProjectStatus,
  ProjectProgress,
  ProjectProgressLabel,
  ProjectProgressText,
  ProjectProgressPercent,
  ProjectProgressBar,
  ProjectProgressFill,
  ProjectInfo,
  ProjectInfoItem,
  ProjectInfoLabel,
  ProjectInfoValue,
  TeamSection,
  TeamMember,
  TeamMemberAvatar,
  TeamMemberInfo,
  TeamMemberName,
  TeamMemberRole,
  TeamMemberContact,
  TaskSection,
  TaskList,
  TaskItem,
  TaskCheckbox,
  TaskContent,
  TaskTitle,
  TaskDescription,
  TaskMeta,
  TaskAssignee,
  TaskDueDate,
  TaskPriority,
  TimelineSection,
  TimelineItem,
  TimelineDate,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
  DocumentSection,
  DocumentList,
  DocumentItem,
  DocumentIcon,
  DocumentInfo,
  DocumentName,
  DocumentSize,
  DocumentActions,
  ActionButton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription
} from './projectDetailStyle';
import ROUTERS from "@/config/router";

interface ProjectDetailProps {
  projectId: string;
}

interface TaskData {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  assignee: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

interface TeamMemberData {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  phone: string;
}

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'milestone' | 'task' | 'meeting' | 'update';
}

interface Document {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadDate: string;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId }) => {

  const projectData = {
    id: projectId,
    name: 'Hệ thống quản lý nhân sự MAST',
    description: 'Phát triển hệ thống quản lý nhân sự toàn diện với các tính năng chấm công, quản lý lương, đánh giá hiệu suất và báo cáo.',
    status: 'active' as const,
    progress: 75,
    startDate: '01/03/2024',
    endDate: '30/12/2024',
    client: 'MAST Corporation',
    budget: '500,000,000 VNĐ',
    manager: 'Nguyễn Văn A',
    priority: 'high' as const,
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    objectives: [
      'Tự động hóa quy trình quản lý nhân sự',
      'Tích hợp hệ thống chấm công thông minh',
      'Xây dựng dashboard báo cáo chi tiết',
      'Đảm bảo bảo mật và quyền riêng tư'
    ]
  };

  const teamMembers: TeamMemberData[] = [
    {
      id: 'tm-001',
      name: 'Nguyễn Văn A',
      role: 'Project Manager',
      avatar: 'NVA',
      email: 'nguyenvana@company.com',
      phone: '0123456789'
    },
    {
      id: 'tm-002',
      name: 'Trần Thị B',
      role: 'Frontend Developer',
      avatar: 'TTB',
      email: 'tranthib@company.com',
      phone: '0123456790'
    },
    {
      id: 'tm-003',
      name: 'Lê Văn C',
      role: 'Backend Developer',
      avatar: 'LVC',
      email: 'levanc@company.com',
      phone: '0123456791'
    },
    {
      id: 'tm-004',
      name: 'Phạm Thị D',
      role: 'UI/UX Designer',
      avatar: 'PTD',
      email: 'phamthid@company.com',
      phone: '0123456792'
    }
  ];

  const tasks: TaskData[] = [
    {
      id: 'task-001',
      title: 'Thiết kế giao diện đăng nhập',
      description: 'Tạo mockup và prototype cho màn hình đăng nhập',
      completed: true,
      assignee: 'Phạm Thị D',
      dueDate: '15/09/2024',
      priority: 'high'
    },
    {
      id: 'task-002',
      title: 'Phát triển API authentication',
      description: 'Xây dựng API xác thực người dùng với JWT',
      completed: true,
      assignee: 'Lê Văn C',
      dueDate: '20/09/2024',
      priority: 'high'
    },
    {
      id: 'task-003',
      title: 'Tích hợp frontend với API',
      description: 'Kết nối giao diện với backend API',
      completed: false,
      assignee: 'Trần Thị B',
      dueDate: '25/09/2024',
      priority: 'medium'
    },
    {
      id: 'task-004',
      title: 'Testing và bug fixing',
      description: 'Thực hiện kiểm thử và sửa lỗi',
      completed: false,
      assignee: 'Nguyễn Văn A',
      dueDate: '30/09/2024',
      priority: 'medium'
    }
  ];

  const timeline: TimelineEvent[] = [
    {
      id: 'tl-001',
      date: '01/03/2024',
      title: 'Khởi động dự án',
      description: 'Họp kick-off và phân công nhiệm vụ',
      type: 'milestone'
    },
    {
      id: 'tl-002',
      date: '15/03/2024',
      title: 'Hoàn thành phân tích yêu cầu',
      description: 'Tài liệu đặc tả kỹ thuật được phê duyệt',
      type: 'milestone'
    },
    {
      id: 'tl-003',
      date: '01/04/2024',
      title: 'Bắt đầu giai đoạn thiết kế',
      description: 'Team design bắt đầu tạo wireframe và mockup',
      type: 'task'
    },
    {
      id: 'tl-004',
      date: '15/09/2024',
      title: 'Hoàn thành module đăng nhập',
      description: 'Frontend và backend đăng nhập đã sẵn sàng',
      type: 'update'
    }
  ];

  const documents: Document[] = [
    {
      id: 'doc-001',
      name: 'Tài liệu đặc tả kỹ thuật.pdf',
      size: '2.5 MB',
      type: 'pdf',
      uploadDate: '15/03/2024'
    },
    {
      id: 'doc-002',
      name: 'Database Schema.sql',
      size: '156 KB',
      type: 'sql',
      uploadDate: '20/03/2024'
    },
    {
      id: 'doc-003',
      name: 'UI Mockups.fig',
      size: '12.8 MB',
      type: 'figma',
      uploadDate: '25/03/2024'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      case 'paused':
        return <Pause size={16} />;
      case 'cancelled':
        return <X size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang thực hiện';
      case 'completed':
        return 'Hoàn thành';
      case 'paused':
        return 'Tạm dừng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };


  const breadcrumbItems: BreadcrumbItemData[] = [
    {
      label: 'Trang chủ',
      href: ROUTERS.PERSONAL.BASE    
    },
    {
      label: 'Dự án',
      href: ROUTERS.PERSONAL.PROJECTS,
      icon: <Briefcase size={16} />
    },
    {
      label: projectData.name,
      icon: <Target size={16} />
    }
  ];

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <ProjectDetailContainer>
      <Breadcrumb items={breadcrumbItems} />
      
      <ProjectDetailHeader>
        <ProjectDetailTitle>{projectData.name}</ProjectDetailTitle>
        <ProjectDetailMeta>
          <ProjectStatus $status={projectData.status}>
            {getStatusIcon(projectData.status)}
            {getStatusText(projectData.status)}
          </ProjectStatus>
          <span>•</span>
          <span>{projectData.client}</span>
          <span>•</span>
          <span>{projectData.startDate} - {projectData.endDate}</span>
        </ProjectDetailMeta>
      </ProjectDetailHeader>

      <ProjectDetailGrid>
        {/* Tổng quan dự án */}
        <ProjectDetailCard>
          <CardHeader>
            <CardIcon>
              <Target size={20} />
            </CardIcon>
            <CardTitle>Tổng quan dự án</CardTitle>
          </CardHeader>
          
          <ProjectOverview>
            <p>{projectData.description}</p>
            
            <ProjectProgress>
              <ProjectProgressLabel>
                <ProjectProgressText>Tiến độ tổng thể</ProjectProgressText>
                <ProjectProgressPercent>{projectData.progress}%</ProjectProgressPercent>
              </ProjectProgressLabel>
              <ProjectProgressBar>
                <ProjectProgressFill $progress={projectData.progress} />
              </ProjectProgressBar>
            </ProjectProgress>

            <ProjectInfo>
              <ProjectInfoItem>
                <ProjectInfoLabel>Ngân sách:</ProjectInfoLabel>
                <ProjectInfoValue>{projectData.budget}</ProjectInfoValue>
              </ProjectInfoItem>
              <ProjectInfoItem>
                <ProjectInfoLabel>Quản lý dự án:</ProjectInfoLabel>
                <ProjectInfoValue>{projectData.manager}</ProjectInfoValue>
              </ProjectInfoItem>
              <ProjectInfoItem>
                <ProjectInfoLabel>Công nghệ:</ProjectInfoLabel>
                <ProjectInfoValue>{projectData.technologies.join(', ')}</ProjectInfoValue>
              </ProjectInfoItem>
            </ProjectInfo>

            <div>
              <h4>Mục tiêu dự án:</h4>
              <ul>
                {projectData.objectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>
          </ProjectOverview>
        </ProjectDetailCard>

        {/* Nhiệm vụ */}
        <ProjectDetailCard>
          <CardHeader>
            <CardIcon>
              <CheckCircle size={20} />
            </CardIcon>
            <CardTitle>Nhiệm vụ ({completedTasks}/{totalTasks})</CardTitle>
          </CardHeader>

          <TaskSection>
            <ProjectProgress>
              <ProjectProgressLabel>
                <ProjectProgressText>Tiến độ nhiệm vụ</ProjectProgressText>
                <ProjectProgressPercent>{taskProgress}%</ProjectProgressPercent>
              </ProjectProgressLabel>
              <ProjectProgressBar>
                <ProjectProgressFill $progress={taskProgress} />
              </ProjectProgressBar>
            </ProjectProgress>

            <TaskList>
              {tasks.map((task) => (
                <TaskItem key={task.id}>
                  <TaskCheckbox $completed={task.completed}>
                    {task.completed && <CheckCircle size={16} />}
                  </TaskCheckbox>
                  <TaskContent>
                    <TaskTitle $completed={task.completed}>{task.title}</TaskTitle>
                    <TaskDescription>{task.description}</TaskDescription>
                    <TaskMeta>
                      <TaskAssignee>
                        <User size={14} />
                        {task.assignee}
                      </TaskAssignee>
                      <TaskDueDate>
                        <Calendar size={14} />
                        {task.dueDate}
                      </TaskDueDate>
                      <TaskPriority $priority={task.priority}>
                        <Star size={14} />
                        {task.priority === 'high' ? 'Cao' : task.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                      </TaskPriority>
                    </TaskMeta>
                  </TaskContent>
                </TaskItem>
              ))}
            </TaskList>
          </TaskSection>
        </ProjectDetailCard>

        {/* Thành viên nhóm */}
        <ProjectDetailCard>
          <CardHeader>
            <CardIcon>
              <Users size={20} />
            </CardIcon>
            <CardTitle>Thành viên nhóm ({teamMembers.length})</CardTitle>
          </CardHeader>

          <TeamSection>
            {teamMembers.map((member) => (
              <TeamMember key={member.id}>
                <TeamMemberAvatar>{member.avatar}</TeamMemberAvatar>
                <TeamMemberInfo>
                  <TeamMemberName>{member.name}</TeamMemberName>
                  <TeamMemberRole>{member.role}</TeamMemberRole>
                  <TeamMemberContact>
                    <div>
                      <Mail size={14} />
                      {member.email}
                    </div>
                    <div>
                      <Phone size={14} />
                      {member.phone}
                    </div>
                  </TeamMemberContact>
                </TeamMemberInfo>
              </TeamMember>
            ))}
          </TeamSection>
        </ProjectDetailCard>

        {/* Timeline */}
        <ProjectDetailCard>
          <CardHeader>
            <CardIcon>
              <Clock size={20} />
            </CardIcon>
            <CardTitle>Lịch sử dự án</CardTitle>
          </CardHeader>

          <TimelineSection>
            {timeline.map((event, index) => (
              <TimelineItem key={event.id} $isLast={index === timeline.length - 1}>
                <TimelineDate>{event.date}</TimelineDate>
                <TimelineContent>
                  <TimelineTitle>{event.title}</TimelineTitle>
                  <TimelineDescription>{event.description}</TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            ))}
          </TimelineSection>
        </ProjectDetailCard>

        {/* Tài liệu */}
        <ProjectDetailCard>
          <CardHeader>
            <CardIcon>
              <FileText size={20} />
            </CardIcon>
            <CardTitle>Tài liệu dự án ({documents.length})</CardTitle>
          </CardHeader>

          <DocumentSection>
            {documents.length > 0 ? (
              <DocumentList>
                {documents.map((doc) => (
                  <DocumentItem key={doc.id}>
                    <DocumentIcon>
                      <FileText size={20} />
                    </DocumentIcon>
                    <DocumentInfo>
                      <DocumentName>{doc.name}</DocumentName>
                      <DocumentSize>{doc.size} • Tải lên {doc.uploadDate}</DocumentSize>
                    </DocumentInfo>
                    <DocumentActions>
                      <ActionButton>
                        <Download size={16} />
                        Tải xuống
                      </ActionButton>
                    </DocumentActions>
                  </DocumentItem>
                ))}
              </DocumentList>
            ) : (
              <EmptyState>
                <EmptyStateIcon>
                  <FileText size={32} />
                </EmptyStateIcon>
                <EmptyStateTitle>Chưa có tài liệu</EmptyStateTitle>
                <EmptyStateDescription>
                  Chưa có tài liệu nào được tải lên cho dự án này.
                </EmptyStateDescription>
              </EmptyState>
            )}
          </DocumentSection>
        </ProjectDetailCard>
      </ProjectDetailGrid>
    </ProjectDetailContainer>
  );
};

export default ProjectDetail;
