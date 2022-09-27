import { Member } from './member.model';

export class Group {
  GroupId!: number;
  GroupName!: string;
  OrganizationName!: string;
  SponsorName!: string;
  SponsorPhone!: string;
  SponsorEmail!: string;
  MaxGroupSize!: number;
  Members!: Array<Member>;
}
