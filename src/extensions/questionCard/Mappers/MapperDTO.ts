import { IQuestion } from '../DataModel/IQuestion';
import { IUser } from '../DataModel/IUser';

export class MapperDTO {

    public mapToQuestionDTO(question: any): IQuestion {

        const item = question.item;
        const user = question.user;
        const profile = question.profile;
        const groups = question.groups;

        const author: IUser = this.mapToUserDTO(user, profile, groups);

        const questionDTO: IQuestion = {
            Id: item.Id,
            Title: item.Title || '',
            Question: item.question || '',
            Response: item.Response || '',
            Status: item.Status || '',
            IsAnonimus: item.IsAnonimus || false,
            CreatedDate: item.Created? new Date(item.Created): null,
            Author: author
        };

        return questionDTO;
    }

    public mapToUserDTO(user: any, profile: any, groups: string[]): IUser {

        const displayName: string = (profile)?
                profile.DisplayName : 'Not Assigned';
        const shortName: string = (displayName.split(' ').length > 1)?
                displayName.split(' ')[0].toUpperCase().split('')[0] +
                displayName.split(' ')[1].toUpperCase().split('')[0] : 'NA';
        const firstName:string = (displayName.split(' ').length > 0)?
                displayName.split(' ')[0] : 'Not';
        const secondName:string = (displayName.split(' ').length > 1)?
                displayName.split(' ')[1] : 'Assigned';
        const login: string = (profile)?
            ((profile.SipAddress)? profile.SipAddress : ((profile.Email)? profile.Email : '')) : '';
        const jobTitle: string = (profile)?
            ((profile.JobTitle)? profile.JobTitle : ((profile.Title)? profile.Title : '')) : '';

        return {
            Id: (user)? user.Id : 0,
            DisplayName: displayName,
            Initials: shortName,
            FirstName: firstName,
            SecondName: secondName,
            Email: (user)? user.Email : '',
            IsSiteAdmin: (user)? user.IsSiteAdmin : false,
            Login: login,
            LoginFullString: (user)? user.LoginName : '',
            PictureUrl: (profile)? profile.PictureUrl : '',
            JobTitle: jobTitle,
            Groups: (groups)? groups : ['']
        };
    }
}
