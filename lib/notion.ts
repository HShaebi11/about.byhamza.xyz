import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getProjects = async () => {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    console.error('NOTION_DATABASE_ID is not defined');
    return [];
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
        property: 'Order',
        direction: 'ascending',
      },
    ],
  });

  return response.results;
};

export const getProjectBySlug = async (slug: string) => {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) return null;

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Slug',
      rich_text: {
        equals: slug,
      },
    },
  });

  if (response.results.length === 0) return null;

  const pageId = response.results[0].id;
  const blocks = await notion.blocks.children.list({ block_id: pageId });

  return {
    page: response.results[0],
    blocks: blocks.results,
  };
};
