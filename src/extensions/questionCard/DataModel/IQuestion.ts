import { IUser } from './IUser';

export interface IQuestion {
    Id: number;
    Title: string;
    Question: string;    
    Response: string;
    CreatedDate: Date;
    IsAnonimus: boolean;
    Status: string;
    Author: IUser;
}