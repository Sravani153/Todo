export interface UserAudit {
  id: number;
  userId: number;
  fieldName: string;
  oldValue: string;
  newValue: string;
  updatedBy: string;
  updatedAt: string;
  action:string;
}
