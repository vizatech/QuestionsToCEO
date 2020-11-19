import { IQuestion } from '../../DataModel/IQuestion';
import { FormSourceEnum } from '../../DataModel/FormSourceEnum';
import { ITheme } from '../../DataModel/ITheme';
import { IUser } from '../../DataModel/IUser';

export interface IQuestionPaneState {
    PaneOpen: boolean;
    IsInProcess: boolean;
    ButtonSaveEnabled: boolean;  
    CurrentQuestion: IQuestion;
    CurrentUser: IUser;
    CurrentTheme: ITheme;
    FormType: FormSourceEnum;
}