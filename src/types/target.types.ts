export type TWeekdays = {
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
};

export type TTarget = {
  id: string;
  title: string;
  startDate: string; // ISO
  endDate: string;   // ISO
  notifyAt: string;  // "17:00"
  weekdays: TWeekdays;
  color: string;
  createdAt: string;
  updatedAt: string;
};
