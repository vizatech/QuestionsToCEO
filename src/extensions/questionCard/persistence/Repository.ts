import '@pnp/sp';
import { sp } from '@pnp/sp';
import { 
    ListViewCommandSetContext 
} from '@microsoft/sp-listview-extensibility';

export class Repository {

    public constructor(actionContext: ListViewCommandSetContext, absoluteUrl: string) {
        sp.setup({
            spfxContext: actionContext
        });
    }

    public async getListItemByTextKeyExpanded(
        listName:string, keyFieldName:string, itemKey: string,
        fieldsToSelect: string[], fieldsToExpand: string[],
        fieldOrderBy:string): Promise<any> {

        const _filter = keyFieldName + " eq '" + itemKey + "'";

        return await sp.web.lists.getByTitle(listName).items
            .filter(_filter)
            .select(...fieldsToSelect)
            .expand(...fieldsToExpand)
            .orderBy(fieldOrderBy, true)
            .get().then( items => {
                return (items.length > 0)? items[0]: null; 
            });
    }

    public async resolveUserPropertiesById(item: any, userId: number):Promise<any> {

        const user = (userId)? await sp.web.getUserById(userId).get(): null;
        const profile = (user)? await sp.profiles.getPropertiesFor(user.LoginName): null;
        const userGroups: string[] = (userId)? 
            (await sp.web.getUserById(userId).groups.get()).map( group => group.Title ): 
            [];
        const groups: string[] = (userGroups.length > 0)? userGroups: [''];

        return Promise.resolve({item, user, profile, groups});
    }
    
    public async getCurrentUserInfo():Promise<any> {
        const _currentUser:any = await sp.web.currentUser.get();
        const _currentUserProfile = await sp.profiles.userProfile;
        const _currentUserGroups: string[] = 
            (await sp.web.currentUser.groups.get()).map( group => group.Title );
        const _groups: string[] = (_currentUserGroups.length > 0)? _currentUserGroups: [''];

        return Promise.resolve({_currentUser, _currentUserProfile, _groups});
    }

    public async updateListItem(listName: string, itemId: number, updateProperties: any):Promise<any> {

        return await sp.web.lists.getByTitle(listName)
            .items.getById(itemId)
            .update(updateProperties)
            .then(async updatedItem => await updatedItem.item.get());
    }

    public async createListItem(listName: string, itemProperties: any):Promise<any> {
        return await sp.web.lists.getByTitle(listName)
            .items.add(itemProperties)
            .then(async newItem => {                 
                return await newItem.item.get();
            });
    }
}