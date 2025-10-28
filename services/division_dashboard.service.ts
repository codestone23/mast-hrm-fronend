import axiosInstance from '@/lib/axios';
import {
  WorkInfoData,
  BirthdayEmployeeData,
  WorkStatisticData,
} from '@/types/api';

class DivisionDashboardService {
  async getWorkInfo(divisionId: number, date: Date): Promise<WorkInfoData> {
    const response = await axiosInstance.get(`/divisions/${divisionId}/work-info`, {
      params: {
        date: date.toISOString(),
      },
    });
    return response.data;
  }

  async getBirthdayEmployeeData(divisionId: number, month: number): Promise<BirthdayEmployeeData> {
    const response = await axiosInstance.get(`/divisions/${divisionId}/birthday-employees`, {
      params: {
        month: month,
      },
    });
    return response.data;
  }

  async getWorkStatisticData(divisionId: number, year: number): Promise<WorkStatisticData> {
    const response = await axiosInstance.get(`/divisions/${divisionId}/statistics`, {
      params: {
        year: year,
      },
    });
    return response.data;
  }

}

export const divisionDashboardService = new DivisionDashboardService();
export default divisionDashboardService;
