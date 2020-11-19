export interface IUser {
    Id: number;
    FirstName: string;
    SecondName: string;
    DisplayName: string;
    Initials: string;
    Email: string;
    IsSiteAdmin: boolean;
    Login: string;
    LoginFullString: string;
    PictureUrl: string;
    JobTitle: string;
    Groups: string[];
}