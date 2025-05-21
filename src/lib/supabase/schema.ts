import { pgTable,uuid,timestamp,text  } from "drizzle-orm/pg-core";



export const workspaces = pgTable('workspaces', {
    id:uuid('id').primaryKey().defaultRandom(),
    title:text('name').notNull(),
    createdAt:timestamp('created_at',{withTimezone:true}),
    workspaceOwner:uuid('workspace_owner').notNull(),
    iconId:text('icon_id').notNull(),
    data:text('data').notNull(),
    inTrash:text('in_trash').notNull(),
    logo:text('logo').notNull(),
    bannerUrl:text('banner_url').notNull(),
})


export const folders = pgTable('folders', {
    id:uuid('id').primaryKey().defaultRandom(),
    title:text('name').notNull(),
    createdAt:timestamp('created_at',{withTimezone:true}),
    iconId:text('icon_id').notNull(),
    data:text('data').notNull(),
    inTrash:text('in_trash').notNull(),
    logo:text('logo').notNull(),
    bannerUrl:text('banner_url').notNull(),
    workspaceOwner:uuid('workspace_id').references(() => workspaces.id,{onDelete:'cascade'}).notNull(),
})

export const files = pgTable('files', {
    id:uuid('id').primaryKey().defaultRandom(),
    title:text('name').notNull(),
    createdAt:timestamp('created_at',{withTimezone:true}),
    iconId:text('icon_id').notNull(),
    data:text('data').notNull(),
    inTrash:text('in_trash').notNull(),
    logo:text('logo').notNull(),
    bannerUrl:text('banner_url').notNull(),
    workspaceOwner:uuid('workspace_id').references(() => workspaces.id,{onDelete:'cascade'}).notNull(),
    folders:uuid('folder_id').references(() => folders.id,{onDelete:'cascade'}).notNull(),
})
 