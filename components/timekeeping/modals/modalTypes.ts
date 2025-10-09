export enum RequestModalType {
  NONE = 'none',
  LATE_ARRIVAL = 'late-arrival',
  EARLY_DEPARTURE = 'early-departure',
  REMOTE_WORK = 'remote-work',
  UNPAID_LEAVE = 'unpaid-leave',
  PAID_LEAVE = 'paid-leave',
  REGULAR_OVERTIME = 'regular-overtime',
  FORGOT_TIMEKEEPING = 'forgot-timekeeping'
}

export interface RequestModalState {
  isRequestTypeModalOpen: boolean;
  activeModal: RequestModalType;
  selectedDate: string;
}
