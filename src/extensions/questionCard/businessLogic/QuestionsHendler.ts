import { ListViewCommandSetContext } from "@microsoft/sp-listview-extensibility";

import { Repository } from "../persistence/Repository";
import { MapperDTO } from "../Mappers/MapperDTO";
import { IQuestion } from "../DataModel/IQuestion";
import { ITheme } from "../DataModel/ITheme";
import { IUser } from "../DataModel/IUser";

export class QuestionHandler extends Repository {
    private mapperDTO: MapperDTO;

    public constructor(
        actionContext: ListViewCommandSetContext,
        absoluteUrl: string,
        serverRelativeUrl: string
    ) {
        super(actionContext, absoluteUrl);

        this.mapperDTO = new MapperDTO();
    }

    public async createNewQuestion(item: IQuestion, closePane: () => void): Promise<boolean> {

        

        return Promise.resolve(true);
    }

    public async getQuestion( questionId: number ): Promise<IQuestion> {

        const _listName: string = "Questions";
        const _itemId: string = questionId.toString();
        const _fieldContextName: string = "Id";
        const _selectedFields: string[] = [
            "Id",
            "Title",
            "question",
            "Response",
            "Status",
            "IsAnonimus",
            "Created",
            "Author/Id"
        ];
        const _expandedFields: string[] = ["Author"];
        const _orderByField: string = "Id";

        return await this.getListItemByTextKeyExpanded(
                _listName,
                _fieldContextName,
                _itemId,
                _selectedFields,
                _expandedFields,
                _orderByField
            )
            .then( question => {
                const authorId = question.Author
                    ? Number(question.Author.Id)
                    : null;

                return this.resolveUserPropertiesById(question, authorId);
            })
            .then( 
                resolvedItem => this.mapperDTO.mapToQuestionDTO(resolvedItem)
            );
    }

    public async getCurrentUser(): Promise<IUser> {

        return await this.getCurrentUserInfo()
        .then(
            resolvedUser => 
                this.mapperDTO.mapToUserDTO(
                    resolvedUser._currentUser, 
                    resolvedUser._currentUserProfile, 
                    resolvedUser._groups)
        );
    }
    
    public getCurrentThemeContext = (): ITheme => {
        const _themeColorsFromWindow: any = (window as any).__themeState__.theme;
        const _currentTheme: ITheme = {
            ThemeDark: _themeColorsFromWindow.themeDark || '#005a9e',
            ThemeDarkAlt: _themeColorsFromWindow.themeDarkAlt || '#106ebe',
            ThemeDarker: _themeColorsFromWindow.themeDarker || '#004578',
            ThemeLight: _themeColorsFromWindow.themeLight || '#c7e0f4',
            ThemeLighterAlt: _themeColorsFromWindow.themeLighterAlt || '#eff6fc',
            ThemeLighter: _themeColorsFromWindow.themeLighter || '#deecf9',
            ThemePrimary: _themeColorsFromWindow.themePrimary || '#0078d4',
            ThemeSecondary: _themeColorsFromWindow.themeSecondary || '#2b88d8',
            ThemeTertiary: _themeColorsFromWindow.themeTertiary || '#71afe5'
        };

        return _currentTheme;
    }
}
