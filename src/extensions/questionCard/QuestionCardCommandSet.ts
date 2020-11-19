import '@pnp/polyfill-ie11';
import * as React from 'react';
import * as ReactDom from 'react-dom';

import { sp } from '@pnp/sp';

import { override } from '@microsoft/decorators';
import {
    BaseListViewCommandSet,
    Command,
    IListViewCommandSetListViewUpdatedParameters,
    IListViewCommandSetExecuteEventParameters,
    ListViewCommandSetContext
} from '@microsoft/sp-listview-extensibility';

import QuestionToCEOPane from './components/QuestionToCEOPane';
import { FormSourceEnum } from './DataModel/FormSourceEnum';
import QUESTION_PANE_ID from './DataModel/GlobalConstants';
import { IQuestionPaneProps } from './components/componentInterfaces/IQuestionPaneProps';
import { IQuestionCardExtentionProps } from './components/componentInterfaces/IQuestionCardExtentionProps';

export default class QuestionCardCommandSet extends BaseListViewCommandSet<IQuestionCardExtentionProps> {
    private listTitle: string;
    private webTitle: string;
    private extentionContext: ListViewCommandSetContext;
    private isNotPostBack: boolean = true;

    @override
    public onInit(): Promise<void> {
        this.extentionContext = this.context;
        this.isNotPostBack = true;

        sp.setup({
            spfxContext: this.context
        });

        return Promise.resolve();
    }

    @override
    public onListViewUpdated( event: IListViewCommandSetListViewUpdatedParameters ): void {
        const newQuestion: Command = this.tryGetCommand('NEW_QUESTION');
        const responseQuestion: Command = this.tryGetCommand('RESPONSE_TO_QUESTION');

        this.listTitle = this.context.pageContext.list
            ? this.context.pageContext.list.title
            : '';
        this.webTitle = this.context.pageContext.web.title;
        if (this.context.pageContext.list.title === 'Site Pages') {
            try {
                this.webTitle = this.context.pageContext.site.serverRequestPath
                    .split('/SitePages/')[1]
                    .split('.aspx')[0];
            } finally {
                console.log(this.webTitle);
            }
        }

        const url: URL = new URL(window.location.href);
        const params: URLSearchParams = new URLSearchParams(url.search);
        const cardId: string = params.has('cardId')? params.get('cardId') : undefined;
 
        if(newQuestion) {
            newQuestion.visible =
                this.listTitle === this.properties.ListName || this.webTitle === this.properties.PageName;
        }
 
        if(responseQuestion) {
            responseQuestion.visible =
                (this.listTitle === this.properties.ListName || this.webTitle === this.properties.PageName) &&
                event.selectedRows.length === 1;
        }
 
        if( newQuestion.visible && this.isNotPostBack && cardId ) { 
            this.openPanel(FormSourceEnum.Card, Number(cardId));
        }
        this.isNotPostBack = false;
    }
 
    @override
    public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
        switch (event.itemId) {
            case 'NEW_QUESTION':
                this.openPanel(FormSourceEnum.NewQuestion, 0);
                break;
            case 'RESPONSE_TO_QUESTION':
                const itemRow = event.selectedRows[0];
                const itemId = itemRow.getValueByName('ID') as number;

                this.openPanel(FormSourceEnum.Response, itemId);
                break;
        }
    }
 
    private openPanel(src: FormSourceEnum, itemId: number):void {
        const paneProperties: IQuestionPaneProps =
            this.preparePanelProperties(
                src,
                itemId
            );
        const paneElement: React.ReactElement<IQuestionPaneProps> =
            React.createElement(QuestionToCEOPane, paneProperties);

        const divConteinerForPane: HTMLDivElement = this.ensurePanePlaceHolder();

        ReactDom.render(paneElement, divConteinerForPane);
    }

    private preparePanelProperties(src: FormSourceEnum, itemId: number): IQuestionPaneProps {
        const listId: string = this.extentionContext.pageContext.list
          ? this.extentionContext.pageContext.list.id.toString()
          : '';
        const absoluteUrl: string = this.extentionContext.pageContext.web
          ? this.extentionContext.pageContext.web.absoluteUrl
          : '';
        const serverRelativeUrl: string = this.extentionContext.pageContext.web
          ? this.extentionContext.pageContext.web.serverRelativeUrl
          : '';
        const paneProperties: IQuestionPaneProps = {
          actionContext: this.extentionContext,
          absoluteUrl: absoluteUrl,
          serverRelativeUrl: serverRelativeUrl,
          listId: listId,
          listTitle: this.listTitle,
          itemId: itemId,
          formCaller: src
      };

      return paneProperties;
    }

    private ensurePanePlaceHolder(): HTMLDivElement {
        const panePlaceHolder: HTMLDivElement =
            document.getElementById(QUESTION_PANE_ID) as HTMLDivElement;
        if (panePlaceHolder) {
            panePlaceHolder.remove();
        }

        const newPanePlaceHolderElement: HTMLDivElement = document.createElement('div');
        newPanePlaceHolderElement.id = QUESTION_PANE_ID;

        return document.body.appendChild(newPanePlaceHolderElement);
    }
}