export enum RequestModalType {
  NONE = 'none',
  LATE_EARLY = 'late-early',
  REMOTE_WORK = 'remote-work',
  PAID_LEAVE = 'paid-leave',
  REGULAR_OVERTIME = 'regular-overtime',
  FORGOT_TIMEKEEPING = 'forgot-timekeeping'
}

export interface RequestModalState {
  isRequestTypeModalOpen: boolean;
  activeModal: RequestModalType;
  selectedDate: string;
}
