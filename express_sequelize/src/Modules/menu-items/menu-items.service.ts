import MenuItem from "./entities/menu-item.entity";
export class MenuItemsService {
  /* TODO: complete getMenuItems so that it returns a nested menu structure
    Requirements:
    - your code should result in EXACTLY one SQL query no matter the nesting level or the amount of menu items.
    - it should work for infinite level of depth (children of childrens children of childrens children, ...)
    - verify your solution with `npm run test`
    - do a `git commit && git push` after you are done or when the time limit is over
    - post process your results in javascript
    Hints:
    - open the `src/menu-items/menu-items.service.ts` file
    - partial or not working answers also get graded so make sure you commit what you have
    Sample response on GET /menu:
    ```json
    [
        {
            "id": 1,
            "name": "All events",
            "url": "/events",
            "parentId": null,
            "createdAt": "2021-04-27T15:35:15.000000Z",
            "children": [
                {
                    "id": 2,
                    "name": "Laracon",
                    "url": "/events/laracon",
                    "parentId": 1,
                    "createdAt": "2021-04-27T15:35:15.000000Z",
                    "children": [
                        {
                            "id": 3,
                            "name": "Illuminate your knowledge of the laravel code base",
                            "url": "/events/laracon/workshops/illuminate",
                            "parentId": 2,
                            "createdAt": "2021-04-27T15:35:15.000000Z",
                            "children": []
                        },
                        {
                            "id": 4,
                            "name": "The new Eloquent - load more with less",
                            "url": "/events/laracon/workshops/eloquent",
                            "parentId": 2,
                            "createdAt": "2021-04-27T15:35:15.000000Z",
                            "children": []
                        }
                    ]
                },
                {
                    "id": 5,
                    "name": "Reactcon",
                    "url": "/events/reactcon",
                    "parentId": 1,
                    "createdAt": "2021-04-27T15:35:15.000000Z",
                    "children": [
                        {
                            "id": 6,
                            "name": "#NoClass pure functional programming",
                            "url": "/events/reactcon/workshops/noclass",
                            "parentId": 5,
                            "createdAt": "2021-04-27T15:35:15.000000Z",
                            "children": []
                        },
                        {
                            "id": 7,
                            "name": "Navigating the function jungle",
                            "url": "/events/reactcon/workshops/jungle",
                            "parentId": 5,
                            "createdAt": "2021-04-27T15:35:15.000000Z",
                            "children": []
                        }
                    ]
                }
            ]
        }
    ]
  */

  async getMenuItems() {
    // throw new Error('TODO in task 3');
    const menus = await MenuItem.findAll({
      raw: true
    });
    const TopMenus: any = [];
    const MenuItems: any= {};
    menus.map( (menuItem: any) => {
        const { id, parentId } = menuItem;
        MenuItems[id] = menuItem;
        if (!MenuItems[id].children ) {
            MenuItems[id].children = [];
        }
        if (parentId !== null) {
            const parentItem = MenuItems[parentId];
            if (parentItem?.children) {
                parentItem.children.push(menuItem);
            } else {
                MenuItems[parentId].children = [menuItem];
            }
        } else {
            TopMenus.push(menuItem);
        }
    });
    // BFS aggregation childrens
    let queue = [...TopMenus];
    while (queue.length) {
        let item = queue.shift();
        const children = MenuItems[item.id];
        if (children.length > 0) {
            for(let child of children) {
                if (MenuItems[child.id].children.length > 0) {
                    child.children = MenuItems[child.id].children;
                }
                queue.push(child);
            }
        }
    }
    return TopMenus;
  }
}