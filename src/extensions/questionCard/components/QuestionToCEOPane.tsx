import * as React from 'react';
import {
    DefaultButton,
    PrimaryButton,
    Panel,
    Label,
    Persona,
    PersonaSize,
    PersonaPresence,
    TextField,
    Checkbox
} from 'office-ui-fabric-react';

import { QuestionHandler } from '../businessLogic/QuestionsHendler';
import { FormSourceEnum } from "../DataModel/FormSourceEnum";
import { IQuestion } from '../DataModel/IQuestion';
import { ITheme } from '../DataModel/ITheme';

import styles from '../scss/CreateQuestionStyles.module.scss';
import { IQuestionPaneProps } from './componentInterfaces/IQuestionPaneProps';
import { IQuestionPaneState } from './componentInterfaces/IQuestionPaneState';

const buttonStyle = { root: { marginRight: 8 } };

export default class QuestionToCEOPane extends React.Component<IQuestionPaneProps, IQuestionPaneState> {

    private questionHandler: QuestionHandler;

    constructor(props: IQuestionPaneProps) { super(props);

        this.questionHandler = new QuestionHandler(
            props.actionContext,
            props.absoluteUrl,
            props.serverRelativeUrl
        );

        this.questionHandler.getCurrentUser()
            .then( currentuser => {

                switch(props.formCaller) {
                    case FormSourceEnum.NewQuestion:
                        this.setState({
                            PaneOpen: true,
                            ButtonSaveEnabled: false,
                            CurrentUser: currentuser,
                            CurrentTheme: this.questionHandler.getCurrentThemeContext(),
                            IsInProcess: false,
                            FormType: props.formCaller
                        });
                        break;
                    default:
                        this.questionHandler
                            .getQuestion(props.itemId)
                            .then( question => {

                                this.setState({
                                    PaneOpen: true,
                                    ButtonSaveEnabled: false,
                                    CurrentUser: currentuser,
                                    CurrentTheme: this.questionHandler.getCurrentThemeContext(),
                                    IsInProcess: false,
                                    CurrentQuestion: question,
                                    FormType: props.formCaller
                                });
                        });
                }
            });
    }
                
    private closePane = ():void => {
        this.setState({ PaneOpen: false });
    }

    private onSave = ():void => {
        this.setState({ PaneOpen: false });
    }

    private onChangeIsAnonimus = ():void => {
        this.setState({ PaneOpen: false });
    }

    public render(): React.ReactElement<IQuestionPaneProps> {
        return (
            <div>
                {this.state && (
                    <Panel 
                        isOpen={this.state.PaneOpen}
                        onDismiss={this.closePane}
                        headerText='Вопрос к Генеральному директору'
                        closeButtonAriaLabel='Закрыть'
                        customWidth='800px'
                        onRenderFooterContent={() => (
                            <div>
                                <PrimaryButton
                                    onClick={this.onSave}
                                    styles={buttonStyle}
                                    disabled={!this.state.ButtonSaveEnabled}
                                >Сохранить и выйти</PrimaryButton>
                                <DefaultButton
                                    onClick={this.closePane}
                                >Выйти</DefaultButton>
                            </div>
                        )}
                        isFooterAtBottom={true}
                        >
                            {(this.state.FormType === FormSourceEnum.NewQuestion) && (
                                <div className={styles.newTeamDetailsBlock}>
                                    <div className={styles.detailsRow}>
                                        <TextField
                                            label='ВОПРОС'
                                            multiline rows={3}
                                        />
                                    </div>
                                    <div className={styles.detailsRow}>
                                        <Checkbox
                                            label='СПРОСИТЬ АНОНИМНО'
                                            checked={false}
                                            onChange={this.onChangeIsAnonimus}
                                        />    
                                    </div>
                                </div>
                            )}
                            {(this.state.FormType === FormSourceEnum.Response) && (
                                <div className={styles.newTeamDetailsBlock}>
                                    <div className={styles.detailsRow}>
                                        <Label>{this.state.CurrentQuestion.Question}</Label>
                                    </div>
                                    <br />
                                    <div className={styles.detailsRow}>
                                        <Persona
                                            imageUrl={this.state.CurrentQuestion.Author.PictureUrl || ''}
                                            imageInitials={this.state.CurrentQuestion.Author.Initials || 'NA'}
                                            primaryText={this.state.CurrentQuestion.Author.DisplayName || 'Not Assigned'}
                                            secondaryText={this.state.CurrentQuestion.Author.JobTitle || ''}
                                            size={PersonaSize.size40}
                                            presence={PersonaPresence.online}
                                            hidePersonaDetails={false}
                                            imageAlt={this.state.CurrentQuestion.Author.DisplayName}
                                        />
                                        <Label>{(this.state.CurrentQuestion.CreatedDate)?
                                            this.state.CurrentQuestion.CreatedDate.toDateString(): ''}
                                        </Label>
                                    </div>
                                    <hr />
                                    <div className={styles.detailsRow}>
                                        <TextField 
                                            label='ОТВЕТ'
                                            multiline rows={12}
                                        />
                                    </div>
                                </div>
                            )}
                    </Panel>
                )}
            </div>
        );
    }
}