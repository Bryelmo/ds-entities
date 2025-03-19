# DS Entities - Layout builder
Build your page layout with this new Strapi plugin inspired by Drupal.
DS Entities gives you a chance to organize and position you contents through API to display them in your project.

## Entity types
- **Node:** contains the web content data
- **Region:** a portion of page layout
- **Block:** a slot that can be positioned inside region
- **View:** used for display list of nodes
- **Tag:** used for tagging nodes

### Node entity
The main entity used for display the web content. It can be organized in node types and used for represent a web page, an article, etc...
The node content is represented by an unique machine name and by a slug string useful for routing path.

### Region entity
A layout page can be organized in regions like header, footer, etc... The region entity represents a portion of layout that can be filled with one or more blocks.

### Block entity
The block entity can be organized in block types and it's useful like a slot placed inside a region to display a view of nodes.
The block can be positioned/related into a region and displayed in specific context of view like nodes or node types.
The block content is represented by an unique machine name.

### View entity
The view entity can be organized in view types and it's useful for represent list of nodes.
It's possible display specific nodes, or list of nodes types or per tag types and also attach specific blocks into the header or footer view ensuring maximum customization.
The view content is represented by an unique machine name.

### Tag entity
The tag entity it's useful for tagging node contents and display them into the views.

## Installation
DS Entities requires Strapi 5 and can be installed with:
```sh
npm install ds-entities
```
## API
DS Entities organizes all the entities in a specific layout structure that can be used for build the web page on your frontend application. That structure is available calling the following endpoint:
```sh
http://localhost:1337/api/ds-entities/layout
```
That endpoint will return blocks data organized per regions
```sh
{
    "unassigned": [
        {
            id": 3,
            "documentId": "hmo5qnsarnx5b4q6kdd745e9",
            "Title": "Sample Block",
            "HideTitle": true,
            "Entity": "block",
            "Uid": "block_sample-block",
            "Body": [...],
            ...
        },
        ...
    ],
    "custom-region": [ ... ]
}
```
DS Entities provides all the entities organized in two other useful structures that can be used as registry fro handling translations or routing. Those structure are available calling the following endpoints:
```sh
http://localhost:1337/api/ds-entities/map
```
That endpoint will return entities data organized per Type and Uid
```sh
{
    "nodes": {
        "page": {
            "node_page-node": {
                ...
                "Title": "Page Node",
                "HideTitle": false,
                "Slug": "page-node",
                "Entity": "node",
                "Uid": "node_page-node",
                ...
            }
            ...
        },
    ],
    "blocks": {
        "default": {
            "block_sample-block": {
                ...
                Title": "Sample block",
                "HideTitle": true,
                "Entity": "block",
                "Uid": "block_sample-block",
                ...
            }
            ...
        },
    }
    "views": {
        "default": {
            "view_sample-view": {
                ...
                "Title": "Sample view",
                "HideTitle": false,
                "Uid": "view_sample-view",
                "Entity": "view",
                ...
            }
            ...
        },
    }
}
```
```sh
http://localhost:1337/api/ds-entities/slugs
```
That endpoint will return entities data organized per Slug
```sh
{
    "nodes": {
        "page-node": {
             ...
                "Title": "Page Node",
                "HideTitle": false,
                "Slug": "page-node",
                "Entity": "node",
                "Uid": "node_page-node",
                ...
            ...
        },
        ...
    ]
}
```
Other DS entities are available on their specific endpoints
```sh
http://localhost:1337/api/ds-entities/nodes
http://localhost:1337/api/ds-entities/blocks
http://localhost:1337/api/ds-entities/views
http://localhost:1337/api/ds-entities/tags
```
### Multilingual
It's possible to select layout data for each language using the locale query param:
```sh
http://localhost:1337/api/ds-entities/layout?locale=en
```

## Permissions and RBAC
Every endpoints can be controlled inside the Strapi users permission plugin.
It's also possible assign some permission rules for admin user roles and decide what kind of node type can be edited by specific admin roles. This can be done becasue DS Entities plugin create a permission condition for each node type created.

**Example:**
Only Editor admin role can edit and publish Page nodes types:
1. Go to Editor role panel
2. Click on Settings for Node permissions
3. Assign condition on Read permission as "Is Page node type"