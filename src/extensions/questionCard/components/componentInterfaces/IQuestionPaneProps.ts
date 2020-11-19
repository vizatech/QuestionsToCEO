import { ListViewCommandSetContext } from '@microsoft/sp-listview-extensibility';
import { FormSourceEnum } from "../../DataModel/FormSourceEnum";

export interface IQuestionPaneProps {
    actionContext: ListViewCommandSetContext;
    absoluteUrl: string;
    serverRelativeUrl: string;
    itemId: number;
    listId: string;
    listTitle: string;
    formCaller: FormSourceEnum;
}