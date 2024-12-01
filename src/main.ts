import { Client } from "typesense"
import type { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

const testData = [
    {
        lvl0: "Zhuang Zi",
        lvl1: "Chapter 2",
        content: "昔者莊周夢為胡蝶，栩栩然胡蝶也。自喻適志與，不知周也。俄然覺，則蘧蘧然周也，不知周之夢為胡蝶與，胡蝶之夢為周與？周與胡蝶，則必有分矣。此之謂物化。",
        url: "/zhuangzi-2#p269",
        url_without_anchor: "/zhuangzi-2",
        item_priority: 100,
        comment: false,
    }
]

const typesenseClient = new Client({
    apiKey: process.env.TYPESENSE_API_KEY!,
    nodes: [
        {
            host: "localhost",
            port: 8108,
            protocol: "http",
        },
    ]
});

const indexName = "zhuangzi-2";

const schema: CollectionCreateSchema = {
    name: indexName,
    fields: [
        { name: "lvl0", type: "string" },
        { name: "lvl1", type: "string" },
        { name: "content", type: "string", locale: "zh" },
        { name: "url", type: "string" },
        { name: "url_without_anchor", type: "string" },
        { name: "item_priority", type: "int32" },
        { name: "comment", type: "bool" },
    ],
}; 


async function main() {
    await typesenseClient.collections().create(schema);
    await typesenseClient.collections(indexName).documents().import(testData);

    const searchResult = await typesenseClient
        .collections(indexName)
        .documents()
        .search({
            q: "蝶",
            query_by: "content",
        });
    console.log(searchResult.hits);
}

main();